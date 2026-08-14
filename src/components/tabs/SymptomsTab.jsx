// src/components/tabs/SymptomsTab.jsx
import React, { useState } from "react";
import { BrainCircuit, Loader2, Mic, Plus, BookOpenCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";
import { useVoice } from "../../hooks/useVoice";
import BodyMap from "./BodyMap";

export default function SymptomsTab() {
  const { t, darkMode, loading, expertMode, setExpertMode, healthProfile, lang } = useApp();
  const { analyzeSymptoms } = useGemini();
  const { isListening, toggleVoice } = useVoice();
  const [input, setInput] = useState("");
  const dm = darkMode;
  const langCode = lang === "hi" ? "hi-IN" : "en-US";

  const addSymptom = (sObj) => {
    const s = sObj[lang] || sObj.en;
    if (input.includes(s)) return;
    setInput(prev => prev ? `${prev}, ${s}` : s);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <label className={`text-xs font-extrabold uppercase tracking-widest ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.label_symptoms}</label>
        {isListening && <span className="text-xs font-bold text-rose-500 animate-pulse flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />{t.listening}</span>}
      </div>

      {/* Expert Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        {healthProfile?.name && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${dm ? "bg-teal-900/40 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
            👤 {t.ai_enhanced}
          </span>
        )}
        <label className="flex items-center gap-3 cursor-pointer ml-auto">
          <span className={`text-xs font-bold flex items-center gap-1 ${expertMode ? "text-teal-500" : (dm ? "text-slate-500" : "text-slate-400")}`}>
            <BookOpenCheck className="w-3 h-3" />
            {expertMode ? "Expert Mode: ON" : "Expert Mode: OFF"}
          </span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={expertMode} onChange={() => setExpertMode(!expertMode)} />
            <div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${expertMode ? "bg-teal-500" : (dm ? "bg-slate-700" : "bg-slate-300")}`} />
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${expertMode ? "translate-x-5" : ""}`} />
          </div>
        </label>
      </div>

      <div className="relative group">
        <textarea
          className={`w-full h-40 p-5 rounded-2xl border-2 outline-none transition-all resize-none font-medium text-lg leading-relaxed shadow-inner ${dm ? "bg-slate-800/50 border-slate-700 text-slate-200 focus:bg-slate-800 focus:border-teal-500 placeholder:text-slate-600" : "bg-slate-50/50 border-slate-100 text-slate-700 focus:bg-white focus:border-teal-500 placeholder:text-slate-400"}`}
          placeholder={t.placeholder_symptoms}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={() => toggleVoice(text => setInput(prev => prev ? `${prev} ${text}` : text), langCode)}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${isListening ? "bg-rose-500 text-white shadow-lg scale-110 animate-pulse" : (dm ? "bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600" : "bg-white text-slate-400 hover:text-teal-600 shadow-md hover:scale-105")}`}>
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Body Map */}
      <BodyMap onRegionClick={addSymptom} />

      <button onClick={() => analyzeSymptoms(input)} disabled={!input.trim() || loading}
        className="mt-8 w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] disabled:cursor-not-allowed text-white rounded-2xl font-extrabold tracking-wide shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] group">
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />}
        <span className="text-lg">{loading ? t.btn_analyzing : t.btn_analyze}</span>
      </button>
    </div>
  );
}
