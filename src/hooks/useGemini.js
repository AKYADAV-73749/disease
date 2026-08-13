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

// -------------------------------------------------------------
// LOCAL FALLBACK ENGINE (For 429 Rate Limits or Offline Mode)
// -------------------------------------------------------------
function generateLocalFallback(input, isImage = false, isReport = false) {
  if (isImage || isReport) {
    return {
      analysis: "⚠️ AI Quota Exceeded (Rate Limit).",
      potential_conditions: [{ name: "Rate Limit 429", probability: "100%", reason: "You have exceeded your free Gemini AI quota." }],
      cureness_probability: "API Blocked",
      cureness_color: "red",
      specialist: "N/A",
      immediate_action: ["Wait 1 minute and try again.", "For images, local fallback is not supported."],
      disclaimer: "This is an automatic system response."
    };
  }

  const blocks = EXPERT_CONTEXT.split("\n\n");
  const words = input.toLowerCase().split(/[,\s]+/).filter(w => w.length > 3);
  
  let bestMatch = null;
  let maxScore = 0;

  for (const block of blocks) {
    if (!block.includes("Symptoms:")) continue;
    let score = 0;
    words.forEach(w => {
      if (block.toLowerCase().includes(w)) score++;
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = block;
    }
  }

  if (bestMatch && maxScore > 0) {
    const lines = bestMatch.split("\n");
    const name = lines[0].replace(/^\d+\.\s*/, "").replace(":", "").trim();
    const action = lines.find(l => l.includes("- Action:"))?.replace("- Action:", "")?.trim() || "Consult a doctor.";
    const warning = lines.find(l => l.includes("- Warning:"))?.replace("- Warning:", "")?.trim() || "";

    return {
      analysis: `(Offline Fallback) Local database matched your keywords with ${name}.`,
      potential_conditions: [{ name, probability: "Local Match", reason: warning || "Matched via local emergency database." }],
      cureness_probability: warning ? "High Risk" : "Moderate",
      cureness_color: warning ? "red" : "yellow",
      specialist: "General Physician",
      immediate_action: [action],
      disclaimer: "This result was generated offline from local databases due to API rate limits (429)."
    };
  }

  return {
    analysis: "(Offline Fallback) Could not definitively match your symptoms locally.",
    potential_conditions: [{ name: "Unknown", probability: "N/A", reason: "Requires AI cloud access." }],
    cureness_probability: "Unknown",
    cureness_color: "yellow",
    specialist: "General Physician",
    immediate_action: ["Rest and hydrate.", "Consult a doctor if symptoms persist.", "Try again in 1 minute when AI quota resets."],
    disclaimer: "You have exceeded your AI quota. This is a generic offline response."
  };
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
      if (String(e).includes("429") || String(e).includes("fetch")) {
        console.warn("AI Rate Limit Hit! Engaging Local Fallback Engine.");
        const fallbackData = generateLocalFallback(input);
        setResult(fallbackData);
        saveToHistory(fallbackData, input + " (Offline)");
      } else {
        setError("Could not analyze symptoms. Please try again.");
      }
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
      if (String(e).includes("429") || String(e).includes("fetch")) {
        const fallbackData = generateLocalFallback("", true, false);
        setResult(fallbackData);
      } else {
        setError("Error analyzing image. Ensure the image is clear.");
      }
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
      if (String(e).includes("429") || String(e).includes("fetch")) {
        const fallbackData = generateLocalFallback("", false, true);
        setResult(fallbackData);
      } else {
        setError("Error reading report. Ensure text is clear.");
      }
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
      if (String(e).includes("429") || String(e).includes("fetch")) {
        setResult({
          analysis: "⚠️ AI Quota Exceeded. Cannot check drug interaction offline.",
          potential_conditions: [{ name: "Rate Limit 429", probability: "100%", reason: "Try again in 1 minute." }],
          cureness_probability: "API Blocked",
          cureness_color: "red",
          specialist: "N/A",
          immediate_action: ["Wait for quota reset."],
          disclaimer: "Automatic system response."
        });
      } else {
        setError("Could not check interaction. Please try again.");
      }
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
      return "⚠️ Chat is temporarily unavailable due to AI quota limits (Error 429). Please wait a moment.";
    }
  }

  return { analyzeSymptoms, analyzeImage, analyzeReport, checkDrugInteraction, sendChatMessage };
}
