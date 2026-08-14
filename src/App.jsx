// src/App.jsx — Slim Orchestrator (~150 lines)
import React from "react";
import {
  Activity, Camera, FileText, Heart, Pill, User,
  AlertTriangle, Loader2
} from "lucide-react";

import { AppProvider, useApp } from "./context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen   from "./components/auth/LoginScreen";
import Header        from "./components/layout/Header";
import SymptomsTab   from "./components/tabs/SymptomsTab";
import VisualScanTab from "./components/tabs/VisualScanTab";
import LabReportTab  from "./components/tabs/LabReportTab";
import VitalsTab     from "./components/tabs/VitalsTab";
import DrugCheckTab  from "./components/tabs/DrugCheckTab";
import HealthProfile from "./components/profile/HealthProfile";
import ResultPanel   from "./components/results/ResultPanel";
import ChatModal     from "./components/shared/ChatModal";
import HistoryPanel  from "./components/shared/HistoryPanel";

// Inner app — uses context
function MediScanApp() {
  const { user, authLoading, darkMode, t, activeTab, setActiveTab, result, setResult, setError, error, user: u } = useApp();
  const dm = darkMode;

  if (authLoading) return (
    <div className={`h-screen flex items-center justify-center ${dm ? "bg-slate-900" : "bg-gradient-to-br from-teal-50 to-indigo-50"}`}>
      <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
    </div>
  );

  if (!user) return <LoginScreen />;

  const tabs = [
    { id: "symptoms", icon: Activity, label: t.tab_text,    color: "teal"   },
    { id: "image",    icon: Camera,   label: t.tab_visual,  color: "indigo" },
    { id: "report",   icon: FileText, label: t.tab_report,  color: "blue"   },
    { id: "vitals",   icon: Heart,    label: t.tab_vitals,  color: "rose"   },
    { id: "drug",     icon: Pill,     label: t.tab_drug,    color: "rose"   },
    { id: "profile",  icon: User,     label: t.tab_profile, color: "teal"   },
  ];

  const tabContent = {
    symptoms: <SymptomsTab />,
    image:    <VisualScanTab />,
    report:   <LabReportTab />,
    vitals:   <VitalsTab />,
    drug:     <DrugCheckTab />,
    profile:  <HealthProfile />,
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col relative overflow-x-hidden transition-colors duration-700 ${dm ? "bg-[#030303] text-slate-100" : "bg-[#F8F9FA] text-slate-900"}`}>
      {/* Ultra-premium atmospheric glows */}
      <div className={`fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${dm ? "bg-teal-900/20" : "bg-teal-200/40"}`} />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${dm ? "bg-indigo-900/20" : "bg-indigo-200/40"}`} />

      <Header />

      <main className={`flex-1 mx-auto w-full p-6 md:p-12 mb-32 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${result ? "max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-10" : "max-w-3xl flex flex-col items-center"}`}>
        {/* LEFT / CENTER: Input */}
        <div className={`w-full space-y-8 transition-all duration-700 ${!result ? "scale-100" : "scale-[0.98]"}`}>
          <div className="text-left">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tighter ${dm ? "text-white" : "text-slate-900"}`}>{t.header_check}</h2>
            <p className={`text-lg md:text-xl font-medium tracking-wide ${dm ? "text-slate-400" : "text-slate-500"}`}>{t.header_desc}</p>
          </div>

          <div className={`backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden border transition-all duration-500 ${dm ? "bg-[#0A0A0A]/80 border-white/5" : "bg-white/80 border-black/5"}`}>
            <div className="p-8 md:p-10 min-h-[500px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {error && (
            <div className={`p-5 rounded-3xl flex items-center gap-4 shadow-2xl backdrop-blur-xl border ${dm ? "bg-rose-950/40 border-rose-900/50 text-rose-300" : "bg-rose-50/80 border-rose-100 text-rose-700"}`}>
              <div className={`${dm ? "bg-rose-900/50" : "bg-rose-200"} p-3 rounded-full`}><AlertTriangle className="w-5 h-5" /></div>
              <p className="text-sm font-bold tracking-wide">{error}</p>
            </div>
          )}

          <HistoryPanel />
        </div>

        {/* RIGHT: Results (Slides in elegantly) */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-full w-full"
          >
            <ResultPanel />
          </motion.div>
        )}
      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className={`flex items-center gap-2 p-2.5 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] border backdrop-blur-3xl transition-colors duration-500 ${dm ? "bg-[#111]/80 border-white/10" : "bg-white/90 border-slate-200"}`}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
                className={`group relative flex flex-col items-center justify-center w-16 h-14 md:w-20 md:h-16 rounded-[1.25rem] transition-all duration-300 ${isActive ? (dm ? "bg-[#222]" : "bg-slate-100") : "hover:bg-black/5 dark:hover:bg-white/5"}`}>
                <tab.icon className={`w-5 h-5 md:w-6 md:h-6 mb-1 transition-all duration-300 ${isActive ? `text-${tab.color}-500 scale-110` : (dm ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700")}`} />
                <span className={`text-[9px] md:text-[10px] font-bold tracking-wider transition-all duration-300 ${isActive ? `text-${tab.color}-500` : (dm ? "text-slate-500" : "text-slate-400")}`}>{tab.label}</span>
                {isActive && <div className={`absolute -bottom-2 w-1 h-1 rounded-full bg-${tab.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />}
              </button>
            )
          })}
        </div>
      </div>

      <ChatModal />
    </div>
  );
}

// Root export — wraps with context
export default function App() {
  return (
    <AppProvider>
      <MediScanApp />
    </AppProvider>
  );
}
