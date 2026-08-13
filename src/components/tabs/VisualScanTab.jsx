// src/components/tabs/VisualScanTab.jsx
import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";

export default function VisualScanTab() {
  const { t, darkMode, loading } = useApp();
  const { analyzeImage } = useGemini();
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dm = darkMode;

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); };

  return (
    <div className="h-full flex flex-col justify-between">
      <div onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${imagePreview ? "border-indigo-500 bg-indigo-50/20" : (dm ? "border-slate-700 hover:border-indigo-500 hover:bg-slate-800" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50")}`}>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
        {imagePreview ? (
          <div className="relative w-full h-full group">
            <button onClick={(e) => { e.stopPropagation(); clearImage(); }}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all z-10 shadow-lg">
              <X className="w-5 h-5" />
            </button>
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
          </div>
        ) : (
          <div className="text-center p-8 transition-transform group-hover:scale-105">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${dm ? "bg-slate-800 text-indigo-400 group-hover:bg-slate-700" : "bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100"}`}>
              <Upload className="w-9 h-9" />
            </div>
            <h3 className={`text-xl font-bold ${dm ? "text-slate-200" : "text-slate-700"}`}>{t.upload_title}</h3>
            <p className={`text-sm mt-2 ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.upload_desc}</p>
          </div>
        )}
      </div>
      <button onClick={() => analyzeImage(imageFile)} disabled={!imageFile || loading}
        className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />}
        <span className="text-lg">{loading ? t.btn_scanning : t.btn_scan}</span>
      </button>
    </div>
  );
}
