// src/components/layout/Header.jsx
import React from "react";
import { Stethoscope, ShieldAlert, LogOut, Languages } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const { t, lang, setLang, darkMode, handleLogout, user } = useApp();
  const dm = darkMode;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${dm ? "bg-[#050505]/60 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-white/60 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]"}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-teal-600 to-teal-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-extrabold text-2xl tracking-tight bg-clip-text text-transparent ${dm ? "bg-gradient-to-r from-teal-400 to-indigo-400" : "bg-gradient-to-r from-teal-700 to-indigo-700"}`}>
              {t.app_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language */}
          <button onClick={() => setLang(l => l === "en" ? "hi" : "en")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${dm ? "bg-[#111] text-slate-300" : "bg-white text-slate-700"}`}>
            <Languages className="w-4 h-4 text-teal-500" />
            {lang === "en" ? "EN" : "HI"}
          </button>

          {/* Badge */}
          <div className={`hidden md:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border shadow-sm ${dm ? "bg-teal-900/30 text-teal-400 border-teal-800" : "bg-teal-50/80 text-teal-700 border-teal-100"}`}>
            <ShieldAlert className="w-4 h-4" />{t.prototype_badge}
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className={`flex items-center gap-2 text-xs font-bold hover:text-rose-500 transition-all px-4 py-2.5 rounded-2xl ${dm ? "bg-[#111] text-slate-400 hover:bg-rose-950/30" : "bg-white text-slate-500 hover:bg-rose-50"}`}>
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
