// src/components/tabs/SymptomsTab.jsx
import React, { useState } from "react";
import { BrainCircuit, Loader2, Mic, Plus, BookOpenCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";
import { useVoice } from "../../hooks/useVoice";
import { COMMON_SYMPTOMS } from "../../constants/symptoms";

export default function SymptomsTab() {
  const { t, darkMode, loading, expertMode, setExpertMode, healthProfile } = useApp();
  const { analyzeSymptoms } = useGemini();
  const { isListening, toggleVoice } = useVoice();
  const [input, setInput] = useState("");
  const dm = darkMode;

  const addSymptom = (s) => {
    if (input.includes(s)) return;
    setInput(prev => prev ? `${prev}, ${s}` : s);
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
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
        <button onClick={() => toggleVoice(text => setInput(prev => prev ? `${prev} ${text}` : text))}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${isListening ? "bg-rose-500 text-white shadow-lg scale-110 animate-pulse" : (dm ? "bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600" : "bg-white text-slate-400 hover:text-teal-600 shadow-md hover:scale-105")}`}>
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Symptom chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {COMMON_SYMPTOMS.map(s => (
          <button key={s} onClick={() => addSymptom(s)}
            className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 ${dm ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-teal-900/30 hover:border-teal-700 hover:text-teal-400" : "bg-white border-slate-100 text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700"}`}>
            <Plus className="w-3 h-3" />{s}
          </button>
        ))}
      </div>

      <button onClick={() => analyzeSymptoms(input)} disabled={!input.trim() || loading}
        className="mt-8 w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6 group-hover:scale-110 transition-transform" />}
        <span className="text-lg">{loading ? t.btn_analyzing : t.btn_analyze}</span>
      </button>
    </div>
  );
}
