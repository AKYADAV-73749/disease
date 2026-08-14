// src/components/results/ResultPanel.jsx
import React from "react";
import { Sparkles, HeartPulse, Stethoscope, Thermometer, AlertTriangle, FileDown, Share2, MapPin, MessageCircle, BrainCircuit, Volume2, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { useVoice } from "../../hooks/useVoice";

export default function ResultPanel() {
  const { t, darkMode, result, loading, setIsChatOpen, downloadPDF, handleShare, lang } = useApp();
  const { isSpeaking, speak, stopSpeaking } = useVoice();
  const dm = darkMode;
  const langCode = lang === "hi" ? "hi-IN" : "en-US";

  if (loading && !result) return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md rounded-[2.5rem] z-20 border shadow-2xl ${dm ? "bg-slate-900/60 border-slate-800" : "bg-white/40 border-white"}`}>
      <div className="relative">
        <div className={`w-20 h-20 border-4 rounded-full ${dm ? "border-slate-800" : "border-slate-100"}`} />
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-8 h-8 text-teal-500 animate-pulse" />
        </div>
      </div>
      <p className={`mt-6 font-bold text-lg animate-pulse ${dm ? "text-slate-400" : "text-slate-600"}`}>{t.consulting}</p>
    </div>
  );

  if (!result) return (
    <div className={`h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed rounded-[3rem] backdrop-blur-sm ${dm ? "border-slate-800 bg-slate-900/40" : "border-slate-200/60 bg-white/30"}`}>
      <div className={`w-24 h-24 rounded-full shadow-xl flex items-center justify-center mb-6 ring-8 ${dm ? "bg-slate-800 ring-slate-800/50" : "bg-white ring-white/50"}`}>
        <Stethoscope className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className={`text-2xl font-bold mb-2 ${dm ? "text-slate-300" : "text-slate-400"}`}>{t.ready_title}</h3>
      <p className={`max-w-xs mx-auto font-medium ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.ready_desc}</p>
    </div>
  );

  const colorClass = {
    green:  { bg: dm ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-100", icon: dm ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-600", text: dm ? "text-emerald-400" : "text-emerald-800", val: dm ? "text-emerald-300" : "text-emerald-900", bar: "bg-emerald-500" },
    yellow: { bg: dm ? "bg-yellow-900/20 border-yellow-800" : "bg-yellow-50 border-yellow-100",   icon: dm ? "bg-yellow-900/50 text-yellow-400" : "bg-yellow-100 text-yellow-600",   text: dm ? "text-yellow-400" : "text-yellow-800",   val: dm ? "text-yellow-300" : "text-yellow-900",   bar: "bg-yellow-500" },
    red:    { bg: dm ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-100",         icon: dm ? "bg-rose-900/50 text-rose-400" : "bg-rose-100 text-rose-600",         text: dm ? "text-rose-400" : "text-rose-800",         val: dm ? "text-rose-300" : "text-rose-900",         bar: "bg-rose-500" },
  }[result.cureness_color] || colorClass?.green;
  const cc = colorClass;

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
      }}
      className="space-y-6 relative"
    >
      {loading && <div className={`absolute inset-0 z-10 rounded-[2.5rem] backdrop-blur-sm ${dm ? "bg-slate-950/60" : "bg-white/60"} flex items-center justify-center`}><BrainCircuit className="w-8 h-8 text-teal-500 animate-pulse" /></div>}

      {/* Summary Card */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/20 transition-all duration-700" />
        <div className="relative z-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-inner ring-1 ring-white/10">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">{t.analysis_title}</h3>
                <button onClick={() => isSpeaking ? stopSpeaking() : speak(result.analysis, langCode)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  {isSpeaking ? <Square className="w-5 h-5 text-yellow-300" /> : <Volume2 className="w-5 h-5 text-slate-300" />}
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">{result.analysis}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={downloadPDF} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-white/10">
              <FileDown className="w-4 h-4" />{t.report}
            </button>
            <button onClick={handleShare} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-white/10">
              <Share2 className="w-4 h-4" />{t.share}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chat Button */}
      <motion.button variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} onClick={() => setIsChatOpen(true)}
        className="w-full py-5 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-2xl font-bold shadow-xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]">
        <MessageCircle className="w-6 h-6" />
        <span className="text-lg">{t.chat_btn}</span>
      </motion.button>

      {/* Status Card */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={`rounded-[2rem] p-8 border-2 transition-all duration-500 ${cc.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${cc.icon}`}><HeartPulse className="w-6 h-6" /></div>
          <h3 className={`font-bold text-sm uppercase tracking-widest ${cc.text}`}>{t.cure_prob}</h3>
        </div>
        <p className={`text-3xl font-black mb-4 ${cc.val}`}>{result.cureness_probability}</p>
        <div className={`w-full rounded-full h-3 overflow-hidden shadow-inner ${dm ? "bg-black/30" : "bg-white/60"}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: result.cureness_probability?.match(/\d+%/)?.[0] ?? "100%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className={`h-full rounded-full ${cc.bar}`}
          />
        </div>
      </motion.div>

      {/* Conditions */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={`backdrop-blur-md rounded-[2rem] shadow-lg border p-8 ${dm ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-white"}`}>
        <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.conditions_title}</h4>
        <div className="space-y-6">
          {result.potential_conditions.map((c, i) => (
            <div key={i} className="relative group">
              <div className="flex justify-between items-end mb-2">
                <span className={`font-bold text-lg group-hover:text-teal-500 transition-colors ${dm ? "text-slate-200" : "text-slate-800"}`}>{c.name}</span>
                <span className="text-sm font-bold text-white bg-teal-500 px-2 py-1 rounded-lg shadow-sm">{c.probability}</span>
              </div>
              <div className={`w-full rounded-full h-2 mb-3 overflow-hidden ${dm ? "bg-slate-700" : "bg-slate-100"}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: c.probability?.includes("%") ? c.probability : "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.2) }}
                  className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full"
                />
              </div>
              <p className={`text-sm leading-relaxed ${dm ? "text-slate-400" : "text-slate-500"}`}>{c.reason}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions Grid */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className={`backdrop-blur-sm rounded-[2rem] p-6 border hover:shadow-lg transition-all ${dm ? "bg-indigo-900/20 border-indigo-800" : "bg-indigo-50/80 border-indigo-100"}`}>
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <Stethoscope className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">{t.specialist_title}</span>
          </div>
          <p className={`font-black text-xl mb-4 ${dm ? "text-indigo-300" : "text-indigo-900"}`}>{result.specialist}</p>
          <button onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(result.specialist + " near me")}`, "_blank")}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm border flex items-center justify-center gap-2 group ${dm ? "bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white border-slate-700" : "bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100"}`}>
            <MapPin className="w-4 h-4 group-hover:animate-bounce" />{t.find_nearby}
          </button>
        </div>

        <div className={`backdrop-blur-sm rounded-[2rem] p-6 border hover:shadow-lg transition-all ${dm ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50/80 border-emerald-100"}`}>
          <div className="flex items-center gap-2 text-emerald-600 mb-3">
            <Thermometer className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">{t.home_relief}</span>
          </div>
          <ul className="space-y-2">
            {result.immediate_action.map((a, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm font-medium ${dm ? "text-emerald-300" : "text-emerald-900"}`}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{a}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className={`rounded-2xl p-5 border flex gap-4 items-start ${dm ? "bg-rose-900/20 border-rose-800" : "bg-rose-50/50 border-rose-100"}`}>
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p className={`text-xs leading-relaxed font-medium ${dm ? "text-rose-300" : "text-rose-800"}`}>
          <strong>{t.disclaimer_title}</strong> {result.disclaimer}
        </p>
      </motion.div>
    </motion.div>
  );
}
