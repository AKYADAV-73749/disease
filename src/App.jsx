import React, { useState, useRef, useEffect } from 'react';
import { 
  Stethoscope, 
  Upload, 
  AlertTriangle, 
  Activity, 
  BrainCircuit, 
  ShieldAlert, 
  Loader2,
  Camera,
  X,
  Sparkles,
  Thermometer,
  Plus,
  ChevronRight,
  HeartPulse,
  FileDown,
  Mic,       
  Share2,    
  History,   
  Trash2     
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(apiKey);

const COMMON_SYMPTOMS = [
  "Headache", "Fever", "Cough", "Fatigue", "Skin Rash", 
  "Stomach Pain", "Nausea", "Dizziness", "Sore Throat", "Joint Pain"
];

export default function App() {
  const [activeTab, setActiveTab] = useState('symptoms'); 
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]); 
  const fileInputRef = useRef(null);

  // --- UPDATED: Load History AND Shared Report ---
  useEffect(() => {
    // 1. Load History
    const saved = localStorage.getItem('mediscan_history');
    if (saved) setHistory(JSON.parse(saved));

    // 2. Check for Shared Link Data
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('r'); // 'r' stands for report
    
    if (sharedData) {
      try {
        // Decode the Base64 string back into JSON
        const decoded = JSON.parse(atob(sharedData));
        setResult(decoded);
        setInput("Shared Report View"); // Indicator that this is a shared view
      } catch (err) {
        console.error("Failed to load shared report", err);
      }
    }
  }, []);

  // --- Helper: Save History ---
  const saveToHistory = (newResult, userInput) => {
    const newItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      input: userInput,
      result: newResult
    };
    const updated = [newItem, ...history].slice(0, 3);
    setHistory(updated);
    localStorage.setItem('mediscan_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('mediscan_history');
  };

  const loadHistoryItem = (item) => {
    setInput(item.input);
    setResult(item.result);
    setImageFile(null); setImagePreview(null);
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${text}` : text);
      };
      recognition.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  // --- UPDATED: Smart Share Function ---
  const handleShare = async () => {
    if (!result) return;

    try {
      // 1. Convert result to a compressed string (Base64)
      const encodedData = btoa(JSON.stringify(result));
      
      // 2. Create the unique URL
      const shareUrl = `${window.location.origin}?r=${encodedData}`;

      if (navigator.share) {
        // Mobile: Open native share menu
        await navigator.share({
          title: 'MediScan Report',
          text: `Check out this AI health analysis: ${result.analysis}`,
          url: shareUrl
        });
      } else {
        // Desktop: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("Report Link Copied to Clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // --- Existing Handlers ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  }

  const addSymptom = (symptom) => {
    if (input.includes(symptom)) return;
    const newInput = input ? `${input}, ${symptom}` : symptom;
    setInput(newInput);
  };

  const downloadPDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 20;

    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); 
    doc.text("MediScan AI Report", margin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    doc.setDrawColor(200);
    doc.line(margin, yPos, 190, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("AI Analysis Summary:", margin, yPos);
    yPos += 7;
    doc.setFontSize(11);
    doc.setTextColor(80);
    const splitAnalysis = doc.splitTextToSize(result.analysis, 170);
    doc.text(splitAnalysis, margin, yPos);
    yPos += (splitAnalysis.length * 7) + 10;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Potential Conditions:", margin, yPos);
    yPos += 10;

    result.potential_conditions.forEach((cond) => {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`• ${cond.name} (${cond.probability})`, margin + 5, yPos);
        yPos += 6;
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        const splitReason = doc.splitTextToSize(cond.reason, 160);
        doc.text(splitReason, margin + 10, yPos);
        yPos += (splitReason.length * 5) + 8;
    });

    yPos = 280; 
    doc.setFontSize(8);
    doc.setTextColor(200, 0, 0); 
    doc.text("DISCLAIMER: AI Prototype. Not a medical diagnosis.", margin, yPos);

    doc.save("mediscan_report.pdf");
  };

  const analyzeSymptoms = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      if (!apiKey) throw new Error("API Key is missing.");

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
      Act as a medical AI assistant. Analyze these symptoms: "${input}".
      Return a strictly valid JSON object (no markdown) with:
      {
        "analysis": "A short 1-sentence summary.",
        "potential_conditions": [
          { "name": "Disease Name", "probability": "Percentage", "reason": "Why this fits" }
        ],
        "cureness_probability": "Likelihood of cure",
        "cureness_color": "green/yellow/red",
        "specialist": "Doctor type",
        "immediate_action": ["Action 1", "Action 2"],
        "disclaimer": "Standard medical disclaimer."
      }
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanText);
      
      setResult(data);
      saveToHistory(data, input);

    } catch (err) {
      console.error(err);
      setError("Could not analyze symptoms. Please try again.");
    }
    setLoading(false);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      if (!apiKey) throw new Error("API Key is missing.");

      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
      Analyze this medical image. 
      Return a strictly valid JSON object (no markdown) with:
      {
        "analysis": "Visual findings.",
        "potential_conditions": [
          { "name": "Condition", "probability": "%", "reason": "Evidence" }
        ],
        "cureness_probability": "Cure Likelihood",
        "cureness_color": "green/yellow/red",
        "specialist": "Specialist",
        "immediate_action": ["Action 1"],
        "disclaimer": "Disclaimer text."
      }`;
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanText);

      setResult(data);
      saveToHistory(data, "Image Analysis");

    } catch (err) {
      console.error(err);
      setError("Error analyzing image. Ensure the image is clear.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-100">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">MediScan AI</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
            <ShieldAlert className="w-4 h-4" />
            AI Prototype • Not a Doctor
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Input Section */}
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Health Check</h2>
            <p className="text-slate-500">AI-powered assessment for symptoms and visual conditions.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="flex p-2 bg-slate-50/50">
              <button 
                onClick={() => {setActiveTab('symptoms'); setResult(null); setError(null);}}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'symptoms' ? 'bg-white text-teal-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Activity className="w-4 h-4" /> Text Check
              </button>
              <button 
                onClick={() => {setActiveTab('image'); setResult(null); setError(null);}}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Camera className="w-4 h-4" /> Visual Scan
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'symptoms' ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Describe Symptoms</label>
                    {isListening && <span className="text-xs font-bold text-rose-500 animate-pulse flex items-center gap-1">● Listening...</span>}
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none placeholder:text-slate-400 text-slate-700 font-medium pr-12"
                      placeholder="e.g. High fever, shivering, and headache..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    {/* Voice Button */}
                    <button 
                      onClick={toggleVoice}
                      className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isListening ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {COMMON_SYMPTOMS.map(s => (
                      <button 
                        key={s}
                        onClick={() => addSymptom(s)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={analyzeSymptoms}
                    disabled={!input.trim() || loading}
                    className="mt-6 w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-200/50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                    {loading ? "Analyzing..." : "Analyze Symptoms"}
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div 
                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${imagePreview ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                         <button 
                          onClick={(e) => { e.stopPropagation(); clearImage(); }}
                          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                         >
                           <X className="w-4 h-4" />
                         </button>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Upload Photo</h3>
                        <p className="text-slate-400 text-sm mt-1">Visible symptoms only</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={analyzeImage}
                    disabled={!imageFile || loading}
                    className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                    {loading ? "Scanning..." : "Scan Image"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* NEW: History List */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2"><History className="w-4 h-4"/> Recent Scans</h3>
                <button onClick={clearHistory} className="text-xs text-rose-500 flex items-center gap-1 hover:underline"><Trash2 className="w-3 h-3"/> Clear</button>
              </div>
              <div className="space-y-2">
                {history.map(item => (
                  <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 bg-slate-50 hover:bg-teal-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-teal-100 group">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{item.date}</span>
                      <span className={`font-bold ${item.result.cureness_color === 'green' ? 'text-teal-600' : 'text-rose-500'}`}>{item.result.cureness_probability}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate">{item.input}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-rose-100 border border-rose-200 rounded-2xl text-rose-700 flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Results Section */}
        <div className="relative">
          {loading && !result && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl z-10">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Consulting AI Doctor...</p>
             </div>
          )}

          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Top Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">AI Analysis</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{result.analysis}</p>
                    </div>
                </div>
                {/* PDF & Share Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={downloadPDF}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <FileDown className="w-4 h-4" /> Report
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>

              {/* Cure Probability Card */}
              <div className={`rounded-3xl p-6 border ${result.cureness_color === 'green' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : result.cureness_color === 'red' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-yellow-50 border-yellow-200 text-yellow-900'}`}>
                  <div className="flex items-center gap-2 mb-2">
                      <HeartPulse className="w-5 h-5" />
                      <h3 className="font-bold text-sm uppercase tracking-wider">Probability of Cure</h3>
                  </div>
                  <p className="text-2xl font-extrabold mb-1">{result.cureness_probability}</p>
                  <div className="w-full bg-white/50 rounded-full h-2 mt-2">
                      <div className={`h-full rounded-full ${result.cureness_color === 'green' ? 'bg-emerald-500' : result.cureness_color === 'red' ? 'bg-rose-500' : 'bg-yellow-500'}`} style={{width: result.cureness_probability?.includes('%') ? result.cureness_probability.match(/\d+%/)[0] : '50%'}}></div>
                  </div>
              </div>

              {/* Disease Probabilities */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Potential Conditions</h4>
                  <div className="space-y-4">
                      {result.potential_conditions.map((cond, i) => (
                          <div key={i} className="relative">
                              <div className="flex justify-between items-end mb-1">
                                  <span className="font-bold text-slate-800">{cond.name}</span>
                                  <span className="text-sm font-bold text-teal-600">{cond.probability}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-teal-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                    style={{width: cond.probability}}
                                  ></div>
                              </div>
                              <p className="text-xs text-slate-500">{cond.reason}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Recommendation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Doctor Suggestion */}
                  <div className="bg-indigo-50 rounded-3xl p-5 border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 mb-2">
                          <Stethoscope className="w-5 h-5" />
                          <span className="font-bold text-sm">Consult Specialist</span>
                      </div>
                      <p className="text-indigo-900 font-bold text-lg">{result.specialist}</p>
                  </div>

                  {/* Immediate Actions */}
                  <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 mb-2">
                          <Thermometer className="w-5 h-5" />
                          <span className="font-bold text-sm">Home Relief</span>
                      </div>
                      <ul className="text-sm text-emerald-900 font-medium space-y-1 list-disc list-inside">
                          {result.immediate_action.map((action, i) => (
                              <li key={i}>{action}</li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <p className="text-xs text-rose-800 leading-relaxed">
                      <strong>Disclaimer:</strong> {result.disclaimer}
                  </p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Stethoscope className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Ready to Analyze</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Your results, including potential conditions and doctor recommendations, will appear here.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}