// src/App.jsx — Slim Orchestrator (~150 lines)
import React from "react";
import {
  Activity, Camera, FileText, Heart, Pill, User,
  AlertTriangle, Loader2
} from "lucide-react";

import { AppProvider, useApp } from "./context/AppContext";
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
  const { user, authLoading, darkMode, t, activeTab, setActiveTab, setResult, setError, error, user: u } = useApp();
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
    <div className={`min-h-screen font-sans flex flex-col relative overflow-x-hidden transition-colors duration-500 ${dm ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-teal-50 via-white to-indigo-50 text-slate-900"}`}>
      {/* Background ambience */}
      <div className={`fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 animate-pulse ${dm ? "bg-teal-900/30" : "bg-teal-100/40"}`} />
      <div className={`fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 animate-pulse delay-700 ${dm ? "bg-indigo-900/30" : "bg-indigo-100/40"}`} />

      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT: Input */}
        <div className="space-y-6">
          <div className="text-left animate-in slide-in-from-left-4 duration-500">
            <h2 className={`text-4xl font-black mb-3 tracking-tight ${dm ? "text-white" : "text-slate-900"}`}>{t.header_check}</h2>
            <p className={`text-lg leading-relaxed ${dm ? "text-slate-400" : "text-slate-500"}`}>{t.header_desc}</p>
            <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border ${dm ? "bg-teal-900/30 border-teal-800" : "bg-teal-50 border-teal-100"}`}>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <p className={`text-xs font-bold ${dm ? "text-teal-400" : "text-teal-700"}`}>{t.logged_in} {u?.email || u?.phoneNumber}</p>
            </div>
          </div>

          <div className={`backdrop-blur-md rounded-[2rem] shadow-xl overflow-hidden border transition-all hover:shadow-2xl ${dm ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-white"}`}>
            {/* Tab bar */}
            <div className={`flex p-2 gap-1 m-2 rounded-2xl overflow-x-auto ${dm ? "bg-slate-800/50" : "bg-slate-100/50"}`}>
              {tabs.map(tab => (
                <button key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
                  className={`flex-1 py-3 px-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 whitespace-nowrap relative overflow-hidden min-w-[60px] ${activeTab === tab.id ? (dm ? "bg-slate-700 text-white shadow-lg" : `bg-white shadow-md text-${tab.color}-600`) : (dm ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50")}`}>
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-${tab.color}-500`} />}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 min-h-[400px]">
              {tabContent[activeTab]}
            </div>
          </div>

          <HistoryPanel />

          {error && (
            <div className={`p-4 border rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-lg ${dm ? "bg-rose-900/30 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
              <div className={`${dm ? "bg-rose-800/50" : "bg-rose-100"} p-2 rounded-full`}><AlertTriangle className="w-5 h-5" /></div>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT: Results */}
        <div className="relative h-full">
          <ResultPanel />
        </div>
      </main>

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
