// src/components/tabs/VitalsTab.jsx
import React from "react";
import { Activity, Heart, HeartPulse, Loader2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useVitals } from "../../hooks/useVitals";

export default function VitalsTab() {
  const { t, darkMode } = useApp();
  const { analyzeHeartRate, vitalsMeasuring, vitalsProgress, fingerDetected, videoRef } = useVitals();
  const dm = darkMode;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="relative h-64 bg-black rounded-3xl overflow-hidden shadow-inner border border-slate-700">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center pointer-events-none">
          {vitalsMeasuring ? (
            <>
              <HeartPulse className={`w-16 h-16 mb-4 drop-shadow-lg ${fingerDetected ? "text-rose-500 animate-pulse" : "text-yellow-500"}`} />
              <p className={`font-bold text-lg ${fingerDetected ? "text-rose-400" : "text-yellow-400"}`}>
                {fingerDetected ? t.vitals_instruction : t.vitals_error}
              </p>
              <div className="w-full max-w-xs h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${vitalsProgress}%` }} />
              </div>
              <p className="text-xs text-rose-300 mt-2 font-mono">{vitalsProgress}%</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full border-4 border-rose-500 flex items-center justify-center mb-4 bg-rose-500/20 backdrop-blur-sm animate-pulse">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-bold text-xl">{t.vitals_title}</h3>
              <p className="text-sm opacity-80 mt-1 max-w-[200px]">{t.vitals_desc}</p>
            </>
          )}
        </div>
      </div>
      <button onClick={analyzeHeartRate} disabled={vitalsMeasuring}
        className="mt-8 w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
        {vitalsMeasuring ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />}
        <span className="text-lg">{vitalsMeasuring ? t.btn_measuring : t.btn_measure}</span>
      </button>
    </div>
  );
}
