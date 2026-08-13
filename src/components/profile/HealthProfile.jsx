// src/components/profile/HealthProfile.jsx
import React from "react";
import { User, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useHealthProfile } from "../../hooks/useHealthProfile";
import { BLOOD_GROUPS, CHRONIC_CONDITIONS } from "../../constants/symptoms";

export default function HealthProfile() {
  const { t, darkMode, lang } = useApp();
  const { profile, updateField, toggleCondition, saveProfile, saving, saved, dirty } = useHealthProfile();
  const dm = darkMode;

  const inputClass = `w-full px-4 py-3 border rounded-xl focus:ring-4 outline-none transition-all font-medium text-sm ${dm ? "bg-slate-800 border-slate-700 text-white focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-teal-500 placeholder:text-slate-400"}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${dm ? "text-slate-500" : "text-slate-400"}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${dm ? "text-white" : "text-slate-800"}`}>
            <User className="w-5 h-5 text-teal-600" />{t.profile_title}
          </h3>
          <p className={`text-xs mt-1 ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.profile_subtitle}</p>
        </div>
        {dirty && !saved && (
          <span className={`text-xs font-bold flex items-center gap-1 ${dm ? "text-yellow-400" : "text-yellow-600"}`}>
            <AlertCircle className="w-3 h-3" />{t.profile_unsaved}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.profile_name}</label>
          <input type="text" value={profile.name} onChange={e => updateField("name", e.target.value)}
            placeholder={t.profile_placeholder_name} className={inputClass} />
        </div>

        {/* Age */}
        <div>
          <label className={labelClass}>{t.profile_age}</label>
          <input type="number" value={profile.age} onChange={e => updateField("age", e.target.value)}
            placeholder={t.profile_placeholder_age} className={inputClass} min="1" max="120" />
        </div>

        {/* Gender */}
        <div>
          <label className={labelClass}>{t.profile_gender}</label>
          <select value={profile.gender} onChange={e => updateField("gender", e.target.value)} className={inputClass}>
            <option value="">Select...</option>
            <option value="Male">{t.gender_male}</option>
            <option value="Female">{t.gender_female}</option>
            <option value="Other">{t.gender_other}</option>
          </select>
        </div>

        {/* Blood Group */}
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.profile_blood}</label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg} onClick={() => updateField("bloodGroup", bg)}
                className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${profile.bloodGroup === bg ? "bg-teal-600 text-white border-teal-600" : (dm ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-600" : "bg-white border-slate-200 text-slate-600 hover:border-teal-400")}`}>
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.profile_allergies}</label>
          <input type="text" value={profile.allergies} onChange={e => updateField("allergies", e.target.value)}
            placeholder={t.profile_placeholder_allergies} className={inputClass} />
        </div>

        {/* Chronic Conditions */}
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.profile_chronic}</label>
          <div className="flex flex-wrap gap-2">
            {CHRONIC_CONDITIONS.map(({ key, label_en, label_hi }) => {
              const active = (profile.chronicConditions || []).includes(key);
              return (
                <button key={key} onClick={() => toggleCondition(key)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${active ? "bg-rose-600 text-white border-rose-600" : (dm ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-rose-500" : "bg-white border-slate-200 text-slate-600 hover:border-rose-300")}`}>
                  {lang === "hi" ? label_hi : label_en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Medications */}
        <div className="sm:col-span-2">
          <label className={labelClass}>{t.profile_meds}</label>
          <textarea rows={3} value={profile.medications} onChange={e => updateField("medications", e.target.value)}
            placeholder={t.profile_placeholder_meds}
            className={`${inputClass} resize-none`} />
        </div>
      </div>

      <button onClick={saveProfile} disabled={saving}
        className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-70 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
        {saving ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.profile_saving}</>
        ) : saved ? (
          <><CheckCircle2 className="w-5 h-5" />{t.profile_saved}</>
        ) : (
          <><Save className="w-5 h-5" />{t.profile_save}</>
        )}
      </button>
    </div>
  );
}
