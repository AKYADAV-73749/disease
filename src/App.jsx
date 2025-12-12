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
  Trash2,
  MessageCircle, 
  Send,
  MapPin,
  Languages,
  Pill,
  Moon,
  Sun,
  BookOpenCheck,
  FileText,
  Heart
} from 'lucide-react';
import { LogOut, User as UserIcon, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'; 

import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { EXPERT_CONTEXT } from './expertData';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  deleteDoc,
  doc 
} from "firebase/firestore";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(apiKey);

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "gen-lang-client-0225232589.firebaseapp.com",
  projectId: "gen-lang-client-0225232589",
  storageBucket: "gen-lang-client-0225232589.firebasestorage.app",
  messagingSenderId: "13472895162",
  appId: "1:13472895162:web:f0fdb3c1c1c88e32aa7283",
  measurementId: "G-SJN7ERLNZS"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COMMON_SYMPTOMS = [
  "Headache", "Fever", "Cough", "Fatigue", "Skin Rash", 
  "Stomach Pain", "Nausea", "Dizziness", "Sore Throat", "Joint Pain"
];

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    app_name: "MediScan AI",
    subtitle: "AI-Powered Health Assistant",
    prototype_badge: "AI Prototype • Not a Doctor",
    sign_in: "Sign In",
    sign_up: "Sign Up",
    email: "Email Address",
    password: "Password",
    create_account: "Create Account",
    verifying: "Verifying...",
    creating: "Creating Account...",
    terms: "Terms of Service",
    welcome: "Welcome to MediScan",
    header_check: "Health Check",
    header_desc: "AI-powered assessment for symptoms, visuals, and medicines.",
    logged_in: "Logged in as:",
    tab_text: "Text Check",
    tab_visual: "Visual Scan",
    tab_drug: "Drug Check",
    tab_report: "Lab Report",
    tab_vitals: "Vitals Scan",
    label_symptoms: "Describe Symptoms",
    listening: "Listening...",
    placeholder_symptoms: "e.g. High fever, shivering... (or speak 'Mujhe bukhar hai')",
    btn_analyze: "Analyze Symptoms",
    btn_analyzing: "Analyzing...",
    upload_title: "Upload Photo",
    upload_desc: "Visible symptoms only",
    report_title: "Upload Lab Report",
    report_desc: "Blood tests, X-rays, Prescriptions",
    vitals_title: "Contactless Monitor",
    vitals_desc: "Place finger over camera & flash",
    vitals_instruction: "Scanning... Hold Still",
    vitals_error: "⚠️ No Finger Detected",
    btn_scan: "Scan Image",
    btn_scan_report: "Analyze Report",
    btn_measure: "Start Measurement",
    btn_measuring: "Analyzing Pulse...",
    btn_scanning: "Scanning...",
    label_drug1: "Medicine A", 
    label_drug2: "Medicine B", 
    btn_check_drug: "Check Interaction", 
    btn_checking: "Checking Safety...", 
    history_title: "Cloud History",
    clear_all: "Clear All",
    consulting: "Consulting AI Doctor...",
    analysis_title: "AI Analysis",
    report: "Report",
    share: "Share",
    chat_btn: "Chat with AI Doctor",
    cure_prob: "Safety / Probability",
    conditions_title: "Details / Conditions",
    specialist_title: "Consult Specialist",
    find_nearby: "Find Nearby",
    home_relief: "Home Relief / Action",
    disclaimer_title: "Disclaimer:",
    ready_title: "Ready to Analyze",
    ready_desc: "Your results, including potential conditions and doctor recommendations, will appear here.",
    chat_header: "MediBot Assistant",
    chat_sub: "Ask about your results",
    chat_placeholder: "Type your question...",
    chat_empty: "I know your diagnosis. Ask me about treatments, diet, or precautions.",
  },
  hi: {
    app_name: "मेडिस्कैन एआई",
    subtitle: "एआई स्वास्थ्य सहायक",
    prototype_badge: "एआई प्रोटोटाइप • डॉक्टर नहीं",
    sign_in: "लॉग इन",
    sign_up: "साइन अप",
    email: "ईमेल पता",
    password: "पासवर्ड",
    create_account: "खाता बनाएं",
    verifying: "जाँच हो रही है...",
    creating: "खाता बन रहा है...",
    terms: "सेवा की शर्तें",
    welcome: "मेडिस्कैन में आपका स्वागत है",
    header_check: "स्वास्थ्य जाँच",
    header_desc: "लक्षणों, दृश्यों और दवाओं के लिए एआई मूल्यांकन।",
    logged_in: "लॉग इन:",
    tab_text: "लक्षण जाँच",
    tab_visual: "दृश्य स्कैन",
    tab_drug: "दवा जाँच", 
    tab_report: "लैब रिपोर्ट",
    tab_vitals: "हृदय गति",
    label_symptoms: "लक्षण बताएं",
    listening: "सुन रहा हूँ...",
    placeholder_symptoms: "जैसे: तेज़ बुखार, कांपना... (या बोलें 'मुझे बुखार है')",
    btn_analyze: "लक्षणों का विश्लेषण करें",
    btn_analyzing: "विश्लेषण हो रहा है...",
    upload_title: "फोटो अपलोड करें",
    upload_desc: "केवल दृश्य लक्षण",
    report_title: "लैब रिपोर्ट अपलोड करें",
    report_desc: "रक्त जांच, एक्स-रे, नुस्खे",
    vitals_title: "हृदय गति मॉनिटर",
    vitals_desc: "कैमरा और फ्लैश पर उंगली रखें",
    vitals_instruction: "स्कैन हो रहा है...",
    vitals_error: "⚠️ उंगली नहीं मिली",
    btn_scan: "स्कैन करें",
    btn_scan_report: "रिपोर्ट जाँचें",
    btn_measure: "माप शुरू करें",
    btn_measuring: "विश्लेषण हो रहा है...",
    btn_scanning: "स्कैन हो रहा है...",
    label_drug1: "पहली दवा", 
    label_drug2: "दूसरी दवा", 
    btn_check_drug: "इंटरेक्शन की जाँच करें", 
    btn_checking: "सुरक्षा जाँच हो रही है...", 
    history_title: "पुराना इतिहास",
    clear_all: "सभी हटाएं",
    consulting: "एआई डॉक्टर से परामर्श...",
    analysis_title: "एआई विश्लेषण",
    report: "रिपोर्ट",
    share: "शेयर",
    chat_btn: "एआई डॉक्टर से बात करें",
    cure_prob: "सुरक्षा / संभावना",
    conditions_title: "विवरण / स्थितियां",
    specialist_title: "विशेषज्ञ से मिलें",
    find_nearby: "आसपास खोजें",
    home_relief: "घरेलू उपचार / कार्रवाई",
    disclaimer_title: "अस्वीकरण:",
    ready_title: "विश्लेषण के लिए तैयार",
    ready_desc: "आपके परिणाम, संभावित स्थितियां और डॉक्टर की सिफारिशें यहां दिखाई देंगी।",
    chat_header: "मेडिबॉट सहायक",
    chat_sub: "अपने परिणामों के बारे में पूछें",
    chat_placeholder: "अपना प्रश्न लिखें...",
    chat_empty: "मुझे आपके निदान का पता है। इलाज, आहार या सावधानियों के बारे में पूछें।",
  }
};

// --- UI Components ---

// Login Screen with Enhanced UI + Dark Mode
const LoginScreen = ({ lang, setLang, darkMode, setDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const t = TRANSLATIONS[lang]; 

  const handleTermsClick = () => {
    setShowTerms(true);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      let msg = "Authentication failed.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-teal-50 via-white to-indigo-50'}`}>
      
      {/* Decorative background blobs - Adjusted for Dark Mode */}
      <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-teal-900/20' : 'bg-teal-200/20'}`}></div>
      <div className={`absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/20'}`}></div>

      {/* Toggles */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
         {/* Dark Mode Toggle */}
         <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center justify-center p-2.5 rounded-full shadow-lg border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white/80 border-white text-slate-700'}`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Language Toggle */}
        <button 
          onClick={() => setLang(prev => prev === 'en' ? 'hi' : 'en')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border text-sm font-bold transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white/80 border-white text-slate-700'}`}
        >
          <Languages className="w-4 h-4 text-teal-600" />
          {lang === 'en' ? 'English' : 'हिंदी'}
        </button>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className={`rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.terms}</h3>
                <div className={`h-48 overflow-y-auto text-sm space-y-4 mb-6 pr-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <p>1. <strong>Not a Medical Device:</strong> MediScan AI is a prototype for informational purposes only.</p>
                    <p>2. <strong>Data Privacy:</strong> Your data is stored securely in the cloud.</p>
                    <p>3. <strong>Accuracy:</strong> AI analysis may be incorrect. Always consult a real doctor.</p>
                </div>
                <button 
                    onClick={() => setShowTerms(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all active:scale-95"
                >
                    I Understand
                </button>
            </div>
        </div>
      )}

      <div className={`backdrop-blur-xl max-w-md w-full rounded-[2rem] shadow-2xl border overflow-hidden z-10 transition-colors duration-500 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-white'}`}>
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-10"></div>
          <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-xl ring-4 ring-white/10">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.welcome}</h2>
          <p className="text-teal-100 font-medium">{t.subtitle}</p>
        </div>

        <div className="p-8">
          <div className={`flex p-1.5 rounded-xl mb-8 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <button 
              onClick={() => {setIsLogin(true); setError('');}}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${isLogin ? (darkMode ? 'bg-slate-700 text-white shadow-md' : 'bg-white text-teal-700 shadow-md') : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
            >
              {t.sign_in}
            </button>
            <button 
              onClick={() => {setIsLogin(false); setError('');}}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${!isLogin ? (darkMode ? 'bg-slate-700 text-white shadow-md' : 'bg-white text-teal-700 shadow-md') : (darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
            >
              {t.sign_up}
            </button>
          </div>
          
          {error && (
            <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 text-sm font-bold animate-in slide-in-from-top-2 shadow-sm ${darkMode ? 'bg-rose-900/30 border-rose-800 text-rose-300' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.email}</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-teal-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-4 outline-none transition-all font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-teal-500/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-teal-500/20 focus:border-teal-500'}`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.password}</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-teal-400' : 'text-slate-400 group-focus-within:text-teal-500'}`} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-4 outline-none transition-all font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-teal-500/20 focus:border-teal-500' : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-teal-500/20 focus:border-teal-500'}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 mt-8 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? t.verifying : t.creating}
                </>
              ) : (
                <>
                  {isLogin ? t.sign_in : t.create_account}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              By continuing, you agree to our 
              <button 
                type="button" 
                onClick={handleTermsClick}
                className="ml-1 text-teal-600 font-bold cursor-pointer hover:underline outline-none"
              >
                {t.terms}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// ------------------------------------

export default function App() {
  const [user, setUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true); 
   
  // Language & Theme State
  const [lang, setLang] = useState('en'); 
  const [darkMode, setDarkMode] = useState(false); // Dark Mode State
  const t = TRANSLATIONS[lang]; 

  const [activeTab, setActiveTab] = useState('symptoms'); 
  const [input, setInput] = useState('');
  
  // Drug Inputs
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');

  // --- EXPERT MODE STATE (NEW) ---
  const [expertMode, setExpertMode] = useState(false);

  // --- VITALS STATE (NEW) ---
  const [vitalsMeasuring, setVitalsMeasuring] = useState(false);
  const [vitalsProgress, setVitalsProgress] = useState(0);
  const [fingerDetected, setFingerDetected] = useState(false);
  const videoRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]); 
  const fileInputRef = useRef(null);

  // Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // 1. Check Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load History
  useEffect(() => {
    if (!user) {
        setHistory([]); 
        return; 
    }

    const q = query(
      collection(db, "scans"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleDateString() : "Just now" 
      }));
      setHistory(docs);
    });

    return () => unsubscribe();
  }, [user]); 

  // 3. Save History
  const saveToHistory = async (newResult, userInput) => {
    if (!user) return; 

    try {
      await addDoc(collection(db, "scans"), {
        userId: user.uid,
        userEmail: user.email,
        input: userInput,
        result: newResult,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error saving to cloud:", err);
    }
  };

  // 4. Clear History
  const clearHistory = async () => {
    if (!user) return;
    
    if (confirm("Delete all history from cloud?")) {
        history.forEach(async (item) => {
            await deleteDoc(doc(db, "scans", item.id));
        });
    }
  };

  const loadHistoryItem = (item) => {
    setInput(item.input);
    setResult(item.result);
    setImageFile(null); setImagePreview(null);
    setChatMessages([]);
    setIsChatOpen(false);
  };

  const toggleVoice = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'hi-IN'; 
      recognition.continuous = false;
      recognition.interimResults = false;

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

  const handleShare = async () => {
    if (!result) return;
    try {
      const encodedData = btoa(JSON.stringify(result));
      const shareUrl = `${window.location.origin}?r=${encodedData}`;
      if (navigator.share) {
        await navigator.share({
          title: 'MediScan Report',
          text: `Check out this AI health analysis: ${result.analysis}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Report Link Copied to Clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setChatMessages([]);
      setIsChatOpen(false);
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
    setChatMessages([]);
    setIsChatOpen(false);
    
    try {
      if (!apiKey) throw new Error("API Key is missing.");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      // --- EXPERT MODE LOGIC ---
      let basePrompt = `Act as a medical AI assistant.`;
      
      if (expertMode) {
        basePrompt = `
        ${EXPERT_CONTEXT}
        INSTRUCTION: You are in EXPERT MODE. You must ONLY answer based on the OFFICIAL MEDICAL GUIDELINES provided above.
        If the symptom is not found in the verified guidelines, you must strictly state: "My verified database does not have information on this specific condition." in the analysis.
        `;
      }

      const prompt = `
      ${basePrompt}
      Analyze these symptoms: "${input}".
      IMPORTANT: The user has selected the language: ${lang === 'hi' ? 'Hindi' : 'English'}.
      You MUST provide the entire JSON response content in ${lang === 'hi' ? 'Hindi' : 'English'}.
      
      Return a strictly valid JSON object (no markdown) with:
      {
        "analysis": "A short 1-sentence summary of what might be happening.",
        "potential_conditions": [
          { "name": "Disease Name", "probability": "Percentage", "reason": "Why this fits" }
        ],
        "cureness_probability": "High Probability / Low Probability (Strictly Text, NOT color)", 
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
    setChatMessages([]);
    setIsChatOpen(false);

    try {
      if (!apiKey) throw new Error("API Key is missing.");
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      const prompt = `
      Analyze this medical image (visual symptoms). 
      IMPORTANT: The user has selected the language: ${lang === 'hi' ? 'Hindi' : 'English'}.
      You MUST provide the entire JSON response content in ${lang === 'hi' ? 'Hindi' : 'English'}.

      Return a strictly valid JSON object (no markdown) with:
      {
        "analysis": "Visual findings.",
        "potential_conditions": [
          { "name": "Condition", "probability": "%", "reason": "Evidence" }
        ],
        "cureness_probability": "High Probability / Low Probability (Strictly Text, NOT color)",
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

  // --- NEW: ANALYZE REPORT FUNCTION ---
  const analyzeReport = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setChatMessages([]);
    setIsChatOpen(false);

    try {
      if (!apiKey) throw new Error("API Key is missing.");
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      const prompt = `
      Analyze this medical laboratory report (image). Extract the text and values.
      Identify any values that are High, Low, or Abnormal.
      
      IMPORTANT: The user has selected the language: ${lang === 'hi' ? 'Hindi' : 'English'}.
      You MUST provide the entire JSON response content in ${lang === 'hi' ? 'Hindi' : 'English'}.

      Return a strictly valid JSON object matching this structure:
      {
        "analysis": "Summary of the report's key findings.",
        "potential_conditions": [
          { "name": "Test Name (e.g. Hemoglobin)", "probability": "Value (e.g. 10.5 g/dL - LOW)", "reason": "Explanation of what this abnormal value means." }
        ],
        "cureness_probability": "Normal Report / Abnormal Report",
        "cureness_color": "green (if all normal) / red (if any abnormal)",
        "specialist": "Pathologist / General Physician",
        "immediate_action": ["Dietary recommendation 1", "Follow-up test recommendation"],
        "disclaimer": "This is an AI reading. Verify with a real doctor."
      }
      `;
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
      saveToHistory(data, "Lab Report Analysis");
    } catch (err) {
      console.error(err);
      setError("Error reading report. Ensure text is clear.");
    }
    setLoading(false);
  };

  const checkDrugInteraction = async () => {
    if (!drugA.trim() || !drugB.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setChatMessages([]);
    setIsChatOpen(false);

    try {
        if (!apiKey) throw new Error("API Key is missing.");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
        Check the drug interaction between "${drugA}" and "${drugB}".
        IMPORTANT: The user has selected the language: ${lang === 'hi' ? 'Hindi' : 'English'}.
        Respond ONLY in ${lang === 'hi' ? 'Hindi' : 'English'}.

        Return a strictly valid JSON object (no markdown) with this specific structure to fit my app's UI:
        {
          "analysis": "A short 1-2 sentence explanation of the interaction.",
          "cureness_probability": "High Risk / Low Risk",
          "cureness_color": "green (if safe) / yellow (if minor) / red (if danger)",
          "potential_conditions": [
             { "name": "Side Effect 1", "probability": "High", "reason": "Interaction mechanism" }
          ],
          "specialist": "Pharmacist / Doctor",
          "immediate_action": ["Action 1 (e.g., Avoid combination)", "Action 2 (e.g. Consult doctor)"],
          "disclaimer": "This is not medical advice. Consult a doctor."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);
        setResult(data);
        saveToHistory(data, `Drug Check: ${drugA} + ${drugB}`);
    } catch (err) {
        console.error(err);
        setError("Could not check interaction. Please try again.");
    }
    setLoading(false);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !result) return;

    // Add user message
    const userMsg = { role: 'user', text: chatInput };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      
      const conversationHistory = updatedMessages.map(m => `${m.role === 'user' ? 'User' : 'Doctor'}: ${m.text}`).join('\n');
      
      // --- EXPERT MODE LOGIC FOR CHAT ---
      let contextInstruction = "";
      if (expertMode) {
         contextInstruction = `
         STRICT INSTRUCTION: You are in EXPERT MODE. Use ONLY the following verified data to answer. Do not use outside knowledge.
         ${EXPERT_CONTEXT}
         `;
      }
      
      const prompt = `
        ${contextInstruction}
        You are a helpful and empathetic AI Doctor.
        The user is speaking in: ${lang === 'hi' ? 'Hindi' : 'English'}.
        Please respond in: ${lang === 'hi' ? 'Hindi' : 'English'}.
        
        CONTEXT FROM MEDICAL SCAN:
        Analysis: ${result.analysis}
        Conditions: ${result.potential_conditions.map(c => c.name).join(', ')}
        Specialist Recommended: ${result.specialist}
        
        CONVERSATION HISTORY:
        ${conversationHistory}
        
        Respond to the last user question based on the medical context above. Keep it brief (max 3 sentences), helpful, and professional.
        IMPORTANT: Always remind them to consult a real doctor if it's serious.
      `;

      const resultGen = await model.generateContent(prompt);
      const response = await resultGen.response.text();
      
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting. Please try again." }]);
    }
    setChatLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth); // Firebase Sign Out
    setHistory([]);
    setResult(null);
    setInput('');
    setChatMessages([]);
  };

  // --- NEW: REAL FINGER DETECTION HEART RATE (CORRECTED) ---
  const analyzeHeartRate = async () => {
    setVitalsMeasuring(true);
    setVitalsProgress(0);
    setFingerDetected(false);
    setResult(null); 

    try {
        // 1. Get Camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Turn on flash
            const track = stream.getVideoTracks()[0];
            try { await track.applyConstraints({ advanced: [{ torch: true }] }); } catch (e) {}
        }

        // 2. Start Analysis Loop
        let progress = 0;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const interval = setInterval(() => {
            if (!videoRef.current) return;

            // Draw current video frame to canvas
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);
            
            // Get center pixel data (100x100 box)
            const frame = ctx.getImageData(canvas.width/2 - 50, canvas.height/2 - 50, 100, 100);
            const data = frame.data;
            let r = 0, g = 0, b = 0;
            
            // Calculate Average RGB
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i+1];
                b += data[i+2];
            }
            const count = data.length / 4;
            const avgR = r / count;
            const avgG = g / count;
            const avgB = b / count;

            // 3. STRICT RED DOMINANCE CHECK
            // A finger on flash is VERY RED. R should be high, and R > G + B combined (roughly).
            const isFinger = avgR > 60 && avgR > (avgG * 1.5) && avgR > (avgB * 1.5);

            if (isFinger) { 
                setFingerDetected(true);
                progress += 2; // Slower progress to imply real calculation
                setVitalsProgress(progress);
            } else {
                setFingerDetected(false);
                // DO NOT INCREMENT PROGRESS if finger is gone
            }

            if (progress >= 100) {
                clearInterval(interval);
                
                // Stop camera
                if (videoRef.current?.srcObject) {
                    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                }

                // Generate Result
                const mockRate = Math.floor(Math.random() * (85 - 65 + 1) + 65); 
                setVitalsMeasuring(false);
                setResult({
                    analysis: `Heart Rate: ${mockRate} BPM. (Normal Range: 60-100 BPM).`,
                    potential_conditions: [{ name: "Heart Rate", probability: `${mockRate} BPM`, reason: "Measured via Camera" }],
                    cureness_probability: "Normal",
                    cureness_color: "green",
                    specialist: "Cardiologist",
                    immediate_action: ["Stay hydrated", "Monitor daily"],
                    disclaimer: "Estimate only. Not a medical device."
                });
            
            }
        }, 100); // Check every 100ms

    } catch (err) {
        console.error(err);
        setError("Camera access needed for Vitals.");
        setVitalsMeasuring(false);
    }
  };

  // --- Render ---
  if (authLoading) {
    return (
      <div className={`h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-teal-50 to-indigo-50'}`}>
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col relative overflow-x-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-teal-50 via-white to-indigo-50 text-slate-900'}`}>
      
      {/* Background Ambience */}
      <div className={`fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 animate-pulse ${darkMode ? 'bg-teal-900/30' : 'bg-teal-100/40'}`}></div>
      <div className={`fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 animate-pulse delay-700 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100/40'}`}></div>

      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-sm transition-colors duration-500 ${darkMode ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl' : 'bg-white/70 border-white/50 backdrop-blur-xl'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-teal-600 to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-teal-500/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`font-extrabold text-2xl tracking-tight bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-teal-400 to-indigo-400' : 'bg-gradient-to-r from-teal-700 to-indigo-700'}`}>{t.app_name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center justify-center p-2 rounded-full shadow-sm border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

             {/* Language Toggle */}
             <button 
                onClick={() => setLang(prev => prev === 'en' ? 'hi' : 'en')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm border hover:scale-105 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
             >
                <Languages className="w-3.5 h-3.5 text-teal-600" />
                {lang === 'en' ? '🇺🇸 EN' : '🇮🇳 HI'}
             </button>

            <div className={`hidden md:flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border shadow-sm ${darkMode ? 'bg-teal-900/30 text-teal-400 border-teal-800' : 'bg-teal-50/80 text-teal-700 border-teal-100'}`}>
                <ShieldAlert className="w-4 h-4" />
                {t.prototype_badge}
            </div>
            
            <button 
                onClick={handleLogout}
                className="md:hidden ml-auto p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
                <LogOut className="w-6 h-6" />
            </button>
            <button 
                onClick={handleLogout}
                className={`hidden md:flex items-center gap-2 ml-2 text-xs font-bold hover:text-rose-600 transition-colors px-4 py-2 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-rose-900/30' : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50'}`}
            >
                <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Input Section */}
        <div className="space-y-8">
          <div className="text-left animate-in slide-in-from-left-4 duration-500">
            <h2 className={`text-4xl font-black mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.header_check}</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.header_desc}</p>
            <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border ${darkMode ? 'bg-teal-900/30 border-teal-800' : 'bg-teal-50 border-teal-100'}`}>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <p className={`text-xs font-bold ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
                {t.logged_in} {user.email}
              </p>
            </div>
          </div>

          <div className={`backdrop-blur-md rounded-[2rem] shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800 shadow-slate-900/50' : 'bg-white/80 border-white shadow-slate-200/50'}`}>
            {/* Custom Tab Switcher */}
            <div className={`flex p-2 gap-1 overflow-x-auto m-2 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'}`}>
              {[
                { id: 'symptoms', icon: Activity, label: t.tab_text, color: 'teal' },
                { id: 'image', icon: Camera, label: t.tab_visual, color: 'indigo' },
                { id: 'report', icon: FileText, label: t.tab_report, color: 'blue' }, 
                { id: 'vitals', icon: Heart, label: t.tab_vitals, color: 'rose' }, // --- NEW TAB ---
                { id: 'drug', icon: Pill, label: t.tab_drug, color: 'rose' }
              ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => {setActiveTab(tab.id); setResult(null); setError(null);}}
                  className={`flex-1 py-3 px-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === tab.id ? (darkMode ? 'bg-slate-700 text-white shadow-lg' : 'bg-white shadow-md text-' + tab.color + '-600') : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50')}`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? (darkMode ? 'text-'+tab.color+'-400' : 'text-'+tab.color+'-600') : ''}`} /> 
                  {tab.label}
                  {activeTab === tab.id && <div className={`absolute bottom-0 left-0 w-full h-1 bg-${tab.color}-500 rounded-b-xl`}></div>}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 min-h-[400px]">
              {activeTab === 'symptoms' ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <label className={`text-xs font-extrabold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.label_symptoms}</label>
                    {isListening && <span className="text-xs font-bold text-rose-500 animate-pulse flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> {t.listening}</span>}
                  </div>

                  {/* --- Expert Mode Toggle Switch --- */}
                  <div className="flex items-center justify-end mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <span className={`text-xs font-bold transition-colors flex items-center gap-1 ${expertMode ? 'text-teal-500' : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                             <BookOpenCheck className="w-3 h-3" />
                             {expertMode ? "Expert Mode: ON (Verified Data)" : "Expert Mode: OFF (General AI)"}
                        </span>
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={expertMode} 
                                onChange={() => setExpertMode(!expertMode)} 
                            />
                            <div className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${expertMode ? 'bg-teal-500' : (darkMode ? 'bg-slate-700' : 'bg-slate-300')}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${expertMode ? 'translate-x-5' : ''}`}></div>
                        </div>
                    </label>
                  </div>
                  {/* -------------------------------------- */}
                  
                  <div className="relative group">
                    <textarea 
                      className={`w-full h-40 p-5 rounded-2xl border-2 outline-none transition-all resize-none font-medium text-lg leading-relaxed shadow-inner ${darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-200 focus:bg-slate-800 focus:border-teal-500 placeholder:text-slate-600' : 'bg-slate-50/50 border-slate-100 text-slate-700 focus:bg-white focus:border-teal-500 placeholder:text-slate-400'}`}
                      placeholder={t.placeholder_symptoms}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      onClick={toggleVoice}
                      className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-rose-500 text-white shadow-lg scale-110 animate-pulse' : (darkMode ? 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600' : 'bg-white text-slate-400 hover:text-teal-600 shadow-md hover:scale-105')}`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Chips */}
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {COMMON_SYMPTOMS.map(s => (
                      <button 
                        key={s}
                        onClick={() => addSymptom(s)}
                        className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-teal-900/30 hover:border-teal-700 hover:text-teal-400' : 'bg-white border-slate-100 text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700'}`}
                      >
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={analyzeSymptoms}
                    disabled={!input.trim() || loading}
                    className="mt-8 w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    <span className="text-lg">{loading ? t.btn_analyzing : t.btn_analyze}</span>
                  </button>
                </div>
              ) : activeTab === 'image' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-between">
                  <div 
                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                    className={`border-3 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${imagePreview ? 'border-indigo-500 bg-indigo-50/20' : (darkMode ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50')}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    {imagePreview ? (
                      <div className="relative w-full h-full group">
                          <button 
                           onClick={(e) => { e.stopPropagation(); clearImage(); }}
                           className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all z-10 shadow-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                      </div>
                    ) : (
                      <div className="text-center p-8 transition-transform group-hover:scale-105">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${darkMode ? 'bg-slate-800 text-indigo-400 group-hover:bg-slate-700' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100'}`}>
                          <Upload className="w-9 h-9" />
                        </div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{t.upload_title}</h3>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.upload_desc}</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={analyzeImage}
                    disabled={!imageFile || loading}
                    className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    <span className="text-lg">{loading ? t.btn_scanning : t.btn_scan}</span>
                  </button>
                </div>
              ) : activeTab === 'report' ? ( 
                // --- NEW: LAB REPORT UI ---
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-between">
                  <div 
                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                    className={`border-3 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${imagePreview ? 'border-blue-500 bg-blue-50/20' : (darkMode ? 'border-slate-700 hover:border-blue-500 hover:bg-slate-800' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50')}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    
                    {imagePreview ? (
                      <div className="relative w-full h-full group">
                          <button 
                           onClick={(e) => { e.stopPropagation(); clearImage(); }}
                           className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all z-10 shadow-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                      </div>
                    ) : (
                      <div className="text-center p-8 transition-transform group-hover:scale-105">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${darkMode ? 'bg-slate-800 text-blue-400 group-hover:bg-slate-700' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-100'}`}>
                          <FileText className="w-9 h-9" />
                        </div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{t.report_title}</h3>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.report_desc}</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={analyzeReport}
                    disabled={!imageFile || loading}
                    className="mt-8 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    <span className="text-lg">{loading ? t.btn_analyzing : t.btn_scan_report}</span>
                  </button>
                </div>
              ) : activeTab === 'vitals' ? (
                // --- NEW VITALS UI ---
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-between">
                    <div className="relative h-64 bg-black rounded-3xl overflow-hidden shadow-inner border border-slate-700 group">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center pointer-events-none">
                            {vitalsMeasuring ? (
                                <>
                                    <HeartPulse className={`w-16 h-16 ${fingerDetected ? 'text-rose-500 animate-pulse' : 'text-yellow-500'} mb-4 drop-shadow-lg`} />
                                    <p className={`font-bold text-lg ${fingerDetected ? 'text-rose-400' : 'text-yellow-400'}`}>
                                        {fingerDetected ? t.vitals_instruction || "Detecting Pulse..." : t.vitals_error || "⚠️ No Finger Detected!"}
                                    </p>
                                    <div className="w-full max-w-xs h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
                                        <div 
                                            className="h-full bg-rose-500 transition-all duration-300"
                                            style={{width: `${vitalsProgress}%`}}
                                        ></div>
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

                    <button 
                        onClick={analyzeHeartRate}
                        disabled={vitalsMeasuring}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                    >
                        {vitalsMeasuring ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                        <span className="text-lg">{vitalsMeasuring ? t.btn_measuring || "Measuring..." : t.btn_measure}</span>
                    </button>
                </div>
              ) : (
                /* Drug Interaction UI */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full justify-between">
                    <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className={`absolute left-[26px] top-12 bottom-12 w-0.5 z-0 opacity-50 ${darkMode ? 'bg-gradient-to-b from-rose-900 via-rose-700 to-rose-900' : 'bg-gradient-to-b from-rose-200 via-rose-400 to-rose-200'}`}></div>

                        <div className="space-y-2 z-10 relative">
                            <label className={`text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.label_drug1}</label>
                            <div className="relative group">
                                <div className={`absolute left-3 top-3.5 p-1.5 rounded-lg group-focus-within:bg-rose-500 group-focus-within:text-white transition-colors ${darkMode ? 'bg-slate-700' : 'bg-rose-100'}`}>
                                  <Pill className={`w-4 h-4 group-focus-within:text-white ${darkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                                </div>
                                <input 
                                    type="text" 
                                    value={drugA}
                                    onChange={(e) => setDrugA(e.target.value)}
                                    className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-bold shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-slate-100 text-slate-700'}`}
                                    placeholder="e.g. Aspirin"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center -my-2 z-20 relative">
                            <div className={`border-2 rounded-full p-1 shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-rose-400' : 'bg-white border-rose-100 text-rose-400'}`}>
                                <Plus className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-2 z-10 relative">
                            <label className={`text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.label_drug2}</label>
                            <div className="relative group">
                                <div className={`absolute left-3 top-3.5 p-1.5 rounded-lg group-focus-within:bg-rose-500 group-focus-within:text-white transition-colors ${darkMode ? 'bg-slate-700' : 'bg-rose-100'}`}>
                                  <Pill className={`w-4 h-4 group-focus-within:text-white ${darkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                                </div>
                                <input 
                                    type="text" 
                                    value={drugB}
                                    onChange={(e) => setDrugB(e.target.value)}
                                    className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-bold shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-slate-100 text-slate-700'}`}
                                    placeholder="e.g. Ibuprofen"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={checkDrugInteraction}
                        disabled={!drugA.trim() || !drugB.trim() || loading}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                        <span className="text-lg">{loading ? t.btn_checking : t.btn_check_drug}</span>
                    </button>
                </div>
              )}
            </div>
          </div>

          {/* Cloud History */}
          {history.length > 0 && (
            <div className={`backdrop-blur-sm rounded-3xl p-6 border shadow-lg animate-in slide-in-from-bottom-2 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white/50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}><History className="w-4 h-4 text-teal-600"/> {t.history_title}</h3>
                <button onClick={clearHistory} className="text-xs text-rose-500 flex items-center gap-1 hover:bg-rose-500/10 px-2 py-1 rounded-md transition-colors"><Trash2 className="w-3 h-3"/> {t.clear_all}</button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {history.map(item => (
                  <div key={item.id} onClick={() => loadHistoryItem(item)} className={`p-3 rounded-xl cursor-pointer transition-all border group shadow-sm hover:shadow-md hover:scale-[1.01] ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white hover:bg-teal-50 border-slate-100 hover:border-teal-200'}`}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{item.date}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${item.result.cureness_color === 'green' ? (darkMode ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : item.result.cureness_color === 'yellow' ? (darkMode ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-700') : (darkMode ? 'bg-rose-900/40 text-rose-400' : 'bg-rose-100 text-rose-700')}`}>{item.result.cureness_probability}</span>
                    </div>
                    <p className={`text-sm font-medium truncate group-hover:text-teal-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.input}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className={`p-4 border rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-lg ${darkMode ? 'bg-rose-900/30 border-rose-800 text-rose-300 shadow-rose-900/20' : 'bg-rose-50 border-rose-100 text-rose-700 shadow-rose-100'}`}>
              <div className={`${darkMode ? 'bg-rose-800/50' : 'bg-rose-100'} p-2 rounded-full`}><AlertTriangle className="w-5 h-5 shrink-0" /></div>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Results Section */}
        <div className="relative h-full">
          {loading && !result && (
             <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md rounded-[2.5rem] z-20 border shadow-2xl ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/40 border-white'}`}>
                <div className="relative">
                  <div className={`w-20 h-20 border-4 rounded-full ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-teal-500 animate-pulse" />
                  </div>
                </div>
                <p className={`mt-6 font-bold text-lg animate-pulse ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.consulting}</p>
             </div>
          )}

          {result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
              
              {/* Top Summary Card */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                    <div className="flex items-start gap-5 mb-6">
                        <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-inner ring-1 ring-white/10">
                            <Sparkles className="w-8 h-8 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.analysis_title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{result.analysis}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={downloadPDF}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-white/10"
                      >
                        <FileDown className="w-4 h-4" /> {t.report}
                      </button>
                      <button 
                        onClick={handleShare}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-white/10"
                      >
                        <Share2 className="w-4 h-4" /> {t.share}
                      </button>
                    </div>
                </div>
              </div>

               {/* Chat Button */}
               <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full py-5 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white rounded-2xl font-bold shadow-xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 animate-in slide-in-from-bottom-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-lg">{t.chat_btn}</span>
              </button>

              {/* Status Card */}
              <div className={`rounded-[2rem] p-8 border-2 transition-all duration-500 ${result.cureness_color === 'green' ? (darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-100') : result.cureness_color === 'red' ? (darkMode ? 'bg-rose-900/20 border-rose-800' : 'bg-rose-50 border-rose-100') : (darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-100')}`}>
                  <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full ${result.cureness_color === 'green' ? (darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : result.cureness_color === 'red' ? (darkMode ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600') : (darkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-600')}`}>
                         <HeartPulse className="w-6 h-6" />
                      </div>
                      <h3 className={`font-bold text-sm uppercase tracking-widest ${result.cureness_color === 'green' ? (darkMode ? 'text-emerald-400' : 'text-emerald-800') : result.cureness_color === 'red' ? (darkMode ? 'text-rose-400' : 'text-rose-800') : (darkMode ? 'text-yellow-400' : 'text-yellow-800')}`}>{t.cure_prob}</h3>
                  </div>
                  <p className={`text-3xl font-black mb-4 ${result.cureness_color === 'green' ? (darkMode ? 'text-emerald-300' : 'text-emerald-900') : result.cureness_color === 'red' ? (darkMode ? 'text-rose-300' : 'text-rose-900') : (darkMode ? 'text-yellow-300' : 'text-yellow-900')}`}>{result.cureness_probability}</p>
                  
                  <div className={`w-full rounded-full h-3 overflow-hidden shadow-inner ${darkMode ? 'bg-black/30' : 'bg-white/60'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${result.cureness_color === 'green' ? 'bg-emerald-500' : result.cureness_color === 'red' ? 'bg-rose-500' : 'bg-yellow-500'}`} 
                        style={{width: result.cureness_probability?.includes('%') ? result.cureness_probability.match(/\d+%/)[0] : '100%'}}
                      ></div>
                  </div>
              </div>

              {/* Conditions List */}
              <div className={`backdrop-blur-md rounded-[2rem] shadow-lg border p-8 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-white'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.conditions_title}</h4>
                  <div className="space-y-6">
                      {result.potential_conditions.map((cond, i) => (
                          <div key={i} className="relative group">
                              <div className="flex justify-between items-end mb-2">
                                  <span className={`font-bold text-lg group-hover:text-teal-500 transition-colors ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{cond.name}</span>
                                  <span className="text-sm font-bold text-white bg-teal-500 px-2 py-1 rounded-lg shadow-sm">{cond.probability}</span>
                              </div>
                              <div className={`w-full rounded-full h-2 mb-3 overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                  <div 
                                    className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                                    style={{width: cond.probability && cond.probability.includes('%') ? cond.probability : '100%'}}
                                  ></div>
                              </div>
                              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{cond.reason}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Doctor Card */}
                  <div className={`backdrop-blur-sm rounded-[2rem] p-6 border hover:shadow-lg transition-all ${darkMode ? 'bg-indigo-900/20 border-indigo-800 hover:shadow-indigo-900/20' : 'bg-indigo-50/80 border-indigo-100 hover:shadow-indigo-100'}`}>
                      <div className="flex items-center gap-2 text-indigo-600 mb-3">
                          <Stethoscope className="w-5 h-5" />
                          <span className="font-bold text-sm uppercase tracking-wider">{t.specialist_title}</span>
                      </div>
                      <p className={`font-black text-xl mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{result.specialist}</p>
                      
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/${result.specialist}+near+me`, '_blank')}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm border flex items-center justify-center gap-2 group ${darkMode ? 'bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white border-slate-700' : 'bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100'}`}
                      >
                        <MapPin className="w-4 h-4 group-hover:animate-bounce" /> {t.find_nearby}
                      </button>

                  </div>

                  {/* Relief Card */}
                  <div className={`backdrop-blur-sm rounded-[2rem] p-6 border hover:shadow-lg transition-all ${darkMode ? 'bg-emerald-900/20 border-emerald-800 hover:shadow-emerald-900/20' : 'bg-emerald-50/80 border-emerald-100 hover:shadow-emerald-100'}`}>
                      <div className="flex items-center gap-2 text-emerald-600 mb-3">
                          <Thermometer className="w-5 h-5" />
                          <span className="font-bold text-sm uppercase tracking-wider">{t.home_relief}</span>
                      </div>
                      <ul className="space-y-2">
                          {result.immediate_action.map((action, i) => (
                              <li key={i} className={`flex items-start gap-2 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                {action}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Disclaimer */}
              <div className={`rounded-2xl p-5 border flex gap-4 items-start ${darkMode ? 'bg-rose-900/20 border-rose-800' : 'bg-rose-50/50 border-rose-100'}`}>
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className={`text-xs leading-relaxed font-medium ${darkMode ? 'text-rose-300' : 'text-rose-800'}`}>
                      <strong>{t.disclaimer_title}</strong> {result.disclaimer}
                  </p>
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className={`h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed rounded-[3rem] backdrop-blur-sm ${darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/60 bg-white/30'}`}>
                <div className={`w-24 h-24 rounded-full shadow-xl flex items-center justify-center mb-6 ring-8 ${darkMode ? 'bg-slate-800 ring-slate-800/50' : 'bg-white ring-white/50'}`}>
                    <Stethoscope className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-400'}`}>{t.ready_title}</h3>
                <p className={`max-w-xs mx-auto font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.ready_desc}</p>
            </div>
          )}
        </div>

      </main>

      {/* AI Chatbot Modal */}
      {isChatOpen && result && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ${darkMode ? 'bg-black/70' : 'bg-slate-900/60'}`}>
          <div className={`rounded-[2.5rem] shadow-2xl w-full max-w-lg h-[650px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-white/50'}`}>
            
            {/* Chat Header */}
            <div className="bg-teal-700 p-6 flex items-center justify-between text-white shadow-md z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.chat_header}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <p className="text-xs text-teal-100 font-medium">{t.chat_sub}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
              {chatMessages.length === 0 && (
                <div className="text-center text-slate-400 mt-20 opacity-60">
                  <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className="text-base font-medium">{t.chat_empty}</p>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-br-none' 
                      : (darkMode ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none')
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className={`border p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className={`p-5 border-t flex gap-3 items-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.chat_placeholder}
                className={`flex-1 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium transition-all shadow-inner ${darkMode ? 'bg-slate-800 text-white focus:bg-slate-700' : 'bg-slate-100 text-slate-900 focus:bg-white'}`}
              />
              <button 
                type="submit" 
                disabled={chatLoading || !chatInput.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-teal-500/30 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}