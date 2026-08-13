// src/components/shared/HistoryPanel.jsx
import React from "react";
import { History, Trash2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

export default function HistoryPanel() {
  const { t, darkMode, history, clearHistory, loadHistoryItem } = useApp();
  const dm = darkMode;

  if (!history.length) return null;

  const colorMap = {
    green:  dm ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    yellow: dm ? "bg-yellow-900/40 text-yellow-400"   : "bg-yellow-100 text-yellow-700",
    red:    dm ? "bg-rose-900/40 text-rose-400"       : "bg-rose-100 text-rose-700",
  };

  return (
    <div className={`backdrop-blur-sm rounded-3xl p-6 border shadow-lg animate-in slide-in-from-bottom-2 ${dm ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-white/50"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold flex items-center gap-2 ${dm ? "text-slate-200" : "text-slate-700"}`}>
          <History className="w-4 h-4 text-teal-600" />{t.history_title}
        </h3>
        <button onClick={clearHistory} className="text-xs text-rose-500 flex items-center gap-1 hover:bg-rose-500/10 px-2 py-1 rounded-md transition-colors">
          <Trash2 className="w-3 h-3" />{t.clear_all}
        </button>
      </div>
      <motion.div 
        className="space-y-2 max-h-48 overflow-y-auto pr-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {history.map(item => (
          <motion.div 
            key={item.id} 
            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
            onClick={() => loadHistoryItem(item)}
            className={`p-3 rounded-xl cursor-pointer transition-all border group shadow-sm hover:shadow-md hover:scale-[1.01] ${dm ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white hover:bg-teal-50 border-slate-100 hover:border-teal-200"}`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">{item.date}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${colorMap[item.result?.cureness_color] || colorMap.green}`}>
                {item.result?.cureness_probability}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className={`text-sm font-medium truncate group-hover:text-teal-500 ${dm ? "text-slate-300" : "text-slate-700"}`}>{item.input}</p>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${dm ? "text-slate-600" : "text-slate-300"}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
