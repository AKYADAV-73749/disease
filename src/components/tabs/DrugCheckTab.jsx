// src/components/tabs/DrugCheckTab.jsx
import React, { useState } from "react";
import { Pill, Plus, ShieldAlert, Loader2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";

export default function DrugCheckTab() {
  const { t, darkMode, loading } = useApp();
  const { checkDrugInteraction } = useGemini();
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const dm = darkMode;

  const inputClass = `w-full pl-14 pr-4 py-4 border-2 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-bold shadow-sm ${dm ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-600" : "bg-white border-slate-100 text-slate-700"}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full justify-between">
      <div className="space-y-5">
        {[{ label: t.label_drug1, val: drugA, set: setDrugA, ph: "e.g. Aspirin" },
          { label: t.label_drug2, val: drugB, set: setDrugB, ph: "e.g. Ibuprofen" }]
          .map(({ label, val, set, ph }, i) => (
          <React.Fragment key={i}>
            {i === 1 && (
              <div className="flex justify-center -my-1">
                <div className={`border-2 rounded-full p-1 shadow-sm ${dm ? "bg-slate-800 border-slate-700 text-rose-400" : "bg-white border-rose-100 text-rose-400"}`}>
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase ml-1 tracking-wider ${dm ? "text-slate-500" : "text-slate-400"}`}>{label}</label>
              <div className="relative group">
                <div className={`absolute left-3 top-3.5 p-1.5 rounded-lg transition-colors ${dm ? "bg-slate-700 group-focus-within:bg-rose-500" : "bg-rose-100 group-focus-within:bg-rose-500"}`}>
                  <Pill className={`w-4 h-4 group-focus-within:text-white ${dm ? "text-rose-400" : "text-rose-500"}`} />
                </div>
                <input type="text" value={val} onChange={e => set(e.target.value)} placeholder={ph} className={inputClass} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <button onClick={() => checkDrugInteraction(drugA, drugB)} disabled={!drugA.trim() || !drugB.trim() || loading}
        className="mt-8 w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />}
        <span className="text-lg">{loading ? t.btn_checking : t.btn_check_drug}</span>
      </button>
    </div>
  );
}
