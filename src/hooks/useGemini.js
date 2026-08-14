// src/hooks/useGemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useApp } from "../context/AppContext";
import { EXPERT_CONTEXT } from "../expertData";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true }) : null;

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
// MULTI-AI FALLBACK ENGINE (Groq / Llama 3)
// -------------------------------------------------------------
async function generateGroqFallback(prompt) {
  if (!groq) {
    console.warn("Groq API key is missing. Multi-AI fallback disabled.");
    return null;
  }
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });
    
    const text = chatCompletion.choices[0]?.message?.content || "";
    return JSON.parse(text);
  } catch (error) {
    console.error("Groq Fallback Error:", error);
    return null;
  }
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
    let prompt = "";
    try {
      const profileCtx = buildProfileContext(healthProfile);
      let basePrompt = `Act as a medical AI assistant.`;
      if (expertMode) {
        basePrompt = `${EXPERT_CONTEXT}\nINSTRUCTION: EXPERT MODE. Use ONLY the verified guidelines above.`;
      }
      prompt = `${basePrompt}\n${profileCtx}
Analyze symptoms: "${input}".
Language: ${langLabel}. ALL response content MUST be in ${langLabel}.
Return ONLY valid JSON (no markdown):
{
  "analysis": "1-sentence summary",
  "potential_conditions": [{"name":"","probability":"","reason":""}],
  "cureness_probability": "Short text (e.g., 'High', 'Moderate', 'Low')",
  "cureness_color": "green|yellow|red (must be exactly one of these)",
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
      console.error("Gemini Error:", e);
      if (String(e).includes("429") || String(e).includes("fetch")) {
        console.warn("Gemini Rate Limit Hit! Engaging Groq AI Fallback.");
        const fallbackData = await generateGroqFallback(prompt);
        if (fallbackData) {
          setResult(fallbackData);
          saveToHistory(fallbackData, input + " (Groq AI)");
        } else {
          setError("Both AI engines failed. Please try again later.");
        }
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
        setResult({
          analysis: "⚠️ Gemini AI Quota Exceeded (Rate Limit).",
          potential_conditions: [{ name: "Rate Limit 429", probability: "100%", reason: "Groq fallback does not support image analysis yet." }],
          cureness_probability: "API Blocked",
          cureness_color: "red",
          specialist: "N/A",
          immediate_action: ["Wait 1 minute for quota to reset.", "Try describing your symptoms in the Symptoms tab instead."],
          disclaimer: "Automatic system response."
        });
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
        setResult({
          analysis: "⚠️ Gemini AI Quota Exceeded (Rate Limit).",
          potential_conditions: [{ name: "Rate Limit 429", probability: "100%", reason: "Groq fallback does not support PDF/Image analysis yet." }],
          cureness_probability: "API Blocked",
          cureness_color: "red",
          specialist: "N/A",
          immediate_action: ["Wait 1 minute for quota to reset."],
          disclaimer: "Automatic system response."
        });
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
    let prompt = "";
    try {
      const profileCtx = buildProfileContext(healthProfile);
      prompt = `${profileCtx}
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
        console.warn("Gemini Rate Limit Hit! Engaging Groq AI Fallback.");
        const fallbackData = await generateGroqFallback(prompt);
        if (fallbackData) {
          setResult(fallbackData);
          saveToHistory(fallbackData, `Drug Check: ${drugA} + ${drugB} (Groq AI)`);
        } else {
          setError("Both AI engines failed. Please try again later.");
        }
      } else {
        setError("Could not check interaction. Please try again.");
      }
    }
    setLoading(false);
  }

  async function sendChatMessage(chatInput, result, chatMessages) {
    if (!chatInput.trim() || !result) return;
    let prompt = "";
    try {
      const profileCtx = buildProfileContext(healthProfile);
      let ctxInstruction = "";
      if (expertMode) ctxInstruction = `EXPERT MODE: Use ONLY verified data.\n${EXPERT_CONTEXT}\n`;
      const history = chatMessages.map(m => `${m.role === "user" ? "User" : "Doctor"}: ${m.text}`).join("\n");
      prompt = `${ctxInstruction}${profileCtx}
You are a helpful AI Doctor. Language: ${langLabel}. Respond in ${langLabel}.
CONTEXT: Analysis: ${result.analysis} | Conditions: ${result.potential_conditions.map(c=>c.name).join(", ")} | Specialist: ${result.specialist}
CONVERSATION:\n${history}
Reply to last message. Max 3 sentences. Always recommend real doctor for serious issues.`;
      const res = await model.generateContent(prompt);
      return res.response.text();
    } catch (e) {
      console.error(e);
      if (String(e).includes("429") || String(e).includes("fetch")) {
        if (!groq) return "⚠️ Chat is temporarily unavailable due to AI quota limits (Error 429). Please wait a moment.";
        
        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
          });
          return chatCompletion.choices[0]?.message?.content || "Sorry, I am having trouble responding right now.";
        } catch (groqErr) {
          console.error("Groq Chat Fallback Error:", groqErr);
          return "⚠️ Both AI engines are currently unavailable due to quota limits. Please wait a moment.";
        }
      }
      return "⚠️ Chat is temporarily unavailable. Please try again.";
    }
  }

  return { analyzeSymptoms, analyzeImage, analyzeReport, checkDrugInteraction, sendChatMessage };
}
