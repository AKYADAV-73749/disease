// src/hooks/useGemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useApp } from "../context/AppContext";
import { EXPERT_CONTEXT } from "../expertData";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function buildProfileContext(healthProfile) {
  if (!healthProfile || !healthProfile.name) return "";
  const conditions = healthProfile.chronicConditions?.join(", ") || "None";
  return `
PATIENT PROFILE (Use this to personalize the response):
- Name: ${healthProfile.name}
- Age: ${healthProfile.age || "Unknown"}
- Gender: ${healthProfile.gender || "Unknown"}
- Blood Group: ${healthProfile.bloodGroup || "Unknown"}
- Known Allergies: ${healthProfile.allergies || "None"}
- Chronic Conditions: ${conditions}
- Current Medications: ${healthProfile.medications || "None"}
Consider this profile when assessing risk factors, medication interactions, and recommendations.
`;
}

export function useGemini() {
  const {
    setResult, setLoading, setError, setChatMessages, setIsChatOpen,
    expertMode, lang, saveToHistory, healthProfile
  } = useApp();

  const langLabel = lang === "hi" ? "Hindi" : "English";
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  async function analyzeSymptoms(input) {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setError(null);
    setChatMessages([]); setIsChatOpen(false);
    try {
      const profileCtx = buildProfileContext(healthProfile);
      let basePrompt = `Act as a medical AI assistant.`;
      if (expertMode) {
        basePrompt = `${EXPERT_CONTEXT}\nINSTRUCTION: EXPERT MODE. Use ONLY the verified guidelines above.`;
      }
      const prompt = `${basePrompt}\n${profileCtx}
Analyze symptoms: "${input}".
Language: ${langLabel}. ALL response content MUST be in ${langLabel}.
Return ONLY valid JSON (no markdown):
{
  "analysis": "1-sentence summary",
  "potential_conditions": [{"name":"","probability":"","reason":""}],
  "cureness_probability": "Text only",
  "cureness_color": "green|yellow|red",
  "specialist": "Doctor type",
  "immediate_action": ["Action 1","Action 2"],
  "disclaimer": "Disclaimer text"
}`;
      const res = await model.generateContent(prompt);
      const text = res.response.text().replace(/```json/g,"").replace(/```/g,"").trim();
      const data = JSON.parse(text);
      setResult(data);
      saveToHistory(data, input);
    } catch (e) {
      console.error(e);
      setError("Could not analyze symptoms. Please try again.");
    }
    setLoading(false);
  }

  async function analyzeImage(imageFile) {
    if (!imageFile) return;
    setLoading(true); setResult(null); setError(null);
    setChatMessages([]); setIsChatOpen(false);
    try {
      const profileCtx = buildProfileContext(healthProfile);
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });
      const prompt = `${profileCtx}
Analyze this medical image for visual symptoms.
Language: ${langLabel}. ALL content in ${langLabel}.
Return ONLY valid JSON:
{"analysis":"","potential_conditions":[{"name":"","probability":"","reason":""}],"cureness_probability":"","cureness_color":"green|yellow|red","specialist":"","immediate_action":[],"disclaimer":""}`;
      const res = await model.generateContent([prompt, { inlineData: { data: base64, mimeType: imageFile.type }}]);
      const data = JSON.parse(res.response.text().replace(/```json/g,"").replace(/```/g,"").trim());
      setResult(data);
      saveToHistory(data, "Image Analysis");
    } catch (e) {
      console.error(e);
      setError("Error analyzing image. Ensure the image is clear.");
    }
    setLoading(false);
  }

  async function analyzeReport(imageFile) {
    if (!imageFile) return;
    setLoading(true); setResult(null); setError(null);
    setChatMessages([]); setIsChatOpen(false);
    try {
      const profileCtx = buildProfileContext(healthProfile);
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });
      const prompt = `${profileCtx}
Analyze this medical lab report. Identify High/Low/Abnormal values.
Language: ${langLabel}. ALL content in ${langLabel}.
Return ONLY valid JSON:
{"analysis":"Summary of key findings","potential_conditions":[{"name":"Test Name","probability":"Value - STATUS","reason":"What this means"}],"cureness_probability":"Normal Report|Abnormal Report","cureness_color":"green|red","specialist":"Pathologist|General Physician","immediate_action":["Recommendation"],"disclaimer":"AI reading - verify with doctor"}`;
      const res = await model.generateContent([prompt, { inlineData: { data: base64, mimeType: imageFile.type }}]);
      const data = JSON.parse(res.response.text().replace(/```json/g,"").replace(/```/g,"").trim());
      setResult(data);
      saveToHistory(data, "Lab Report Analysis");
    } catch (e) {
      console.error(e);
      setError("Error reading report. Ensure text is clear.");
    }
    setLoading(false);
  }

  async function checkDrugInteraction(drugA, drugB) {
    if (!drugA.trim() || !drugB.trim()) return;
    setLoading(true); setResult(null); setError(null);
    setChatMessages([]); setIsChatOpen(false);
    try {
      const profileCtx = buildProfileContext(healthProfile);
      const prompt = `${profileCtx}
Check drug interaction between "${drugA}" and "${drugB}".
Language: ${langLabel}. Respond ONLY in ${langLabel}.
Return ONLY valid JSON:
{"analysis":"1-2 sentence explanation","cureness_probability":"High Risk|Low Risk|Safe","cureness_color":"green|yellow|red","potential_conditions":[{"name":"Side Effect","probability":"High|Medium|Low","reason":"Mechanism"}],"specialist":"Pharmacist|Doctor","immediate_action":["Action"],"disclaimer":"Not medical advice."}`;
      const res = await model.generateContent(prompt);
      const data = JSON.parse(res.response.text().replace(/```json/g,"").replace(/```/g,"").trim());
      setResult(data);
      saveToHistory(data, `Drug Check: ${drugA} + ${drugB}`);
    } catch (e) {
      console.error(e);
      setError("Could not check interaction. Please try again.");
    }
    setLoading(false);
  }

  async function sendChatMessage(chatInput, result, chatMessages, setChatMessages) {
    if (!chatInput.trim() || !result) return;
    const userMsg = { role: "user", text: chatInput };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    try {
      const profileCtx = buildProfileContext(healthProfile);
      let ctxInstruction = "";
      if (expertMode) ctxInstruction = `EXPERT MODE: Use ONLY verified data.\n${EXPERT_CONTEXT}\n`;
      const history = updated.map(m => `${m.role === "user" ? "User" : "Doctor"}: ${m.text}`).join("\n");
      const prompt = `${ctxInstruction}${profileCtx}
You are a helpful AI Doctor. Language: ${langLabel}. Respond in ${langLabel}.
CONTEXT: Analysis: ${result.analysis} | Conditions: ${result.potential_conditions.map(c=>c.name).join(", ")} | Specialist: ${result.specialist}
CONVERSATION:\n${history}
Reply to last message. Max 3 sentences. Always recommend real doctor for serious issues.`;
      const res = await model.generateContent(prompt);
      return res.response.text();
    } catch (e) {
      console.error(e);
      return "I am having trouble connecting. Please try again.";
    }
  }

  return { analyzeSymptoms, analyzeImage, analyzeReport, checkDrugInteraction, sendChatMessage };
}
