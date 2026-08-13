// src/components/layout/Header.jsx
import React from "react";
import { Stethoscope, ShieldAlert, Moon, Sun, LogOut, Languages } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const { t, lang, setLang, darkMode, setDarkMode, handleLogout, user } = useApp();
  const dm = darkMode;

  return (
    <header className={`sticky top-0 z-50 shadow-sm transition-colors duration-500 ${dm ? "bg-slate-900/80 border-slate-800 backdrop-blur-xl border-b" : "bg-white/70 border-white/50 backdrop-blur-xl border-b"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-600 to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-extrabold text-2xl tracking-tight bg-clip-text text-transparent ${dm ? "bg-gradient-to-r from-teal-400 to-indigo-400" : "bg-gradient-to-r from-teal-700 to-indigo-700"}`}>
              {t.app_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Dark Mode */}
          <button onClick={() => setDarkMode(!dm)}
            className={`flex items-center justify-center p-2 rounded-full shadow-sm border transition-all ${dm ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            {dm ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language */}
          <button onClick={() => setLang(l => l === "en" ? "hi" : "en")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shadow-sm border hover:scale-105 transition-all ${dm ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`}>
            <Languages className="w-3.5 h-3.5 text-teal-600" />
            {lang === "en" ? "🇺🇸 EN" : "🇮🇳 HI"}
          </button>

          {/* Badge */}
          <div className={`hidden md:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border shadow-sm ${dm ? "bg-teal-900/30 text-teal-400 border-teal-800" : "bg-teal-50/80 text-teal-700 border-teal-100"}`}>
            <ShieldAlert className="w-4 h-4" />{t.prototype_badge}
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className={`flex items-center gap-2 text-xs font-bold hover:text-rose-600 transition-colors px-3 py-2 rounded-xl border ${dm ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-rose-900/30" : "bg-white border-slate-200 text-slate-500 hover:bg-rose-50"}`}>
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
