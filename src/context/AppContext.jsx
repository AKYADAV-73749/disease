// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection, query, where, onSnapshot, orderBy,
  addDoc, serverTimestamp, deleteDoc, doc
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { jsPDF } from "jspdf";
import { TRANSLATIONS } from "../constants/translations";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("disease_detector_lang") || "en";
  });
  const darkMode = true;
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [history,     setHistory]     = useState([]);
  const [expertMode,  setExpertMode]  = useState(false);
  const [isChatOpen,  setIsChatOpen]  = useState(false);
  const [chatMessages,setChatMessages]= useState([]);
  const [activeTab,   setActiveTab]   = useState("symptoms");
  const [healthProfile, setHealthProfile] = useState(null);

  const t = TRANSLATIONS[lang];

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("disease_detector_lang", lang);
    document.documentElement.classList.add("dark");
  }, [lang]);

  // Load history
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    const q = query(
      collection(db, "scans"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().createdAt?.toDate().toLocaleDateString() ?? "Just now"
      })));
    });
    return unsub;
  }, [user]);

  const saveToHistory = async (newResult, userInput) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "scans"), {
        userId: user.uid, userEmail: user.email,
        input: userInput, result: newResult,
        createdAt: serverTimestamp()
      });
    } catch (e) { console.error(e); }
  };

  const clearHistory = async () => {
    if (!user) return;
    if (!window.confirm("Delete all history from cloud?")) return;
    await Promise.all(history.map(item => deleteDoc(doc(db, "scans", item.id))));
  };

  const loadHistoryItem = (item) => {
    setResult(item.result);
    setIsChatOpen(false);
    setChatMessages([]);
    setActiveTab("symptoms");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setHistory([]);
    setResult(null);
    setChatMessages([]);
    setHealthProfile(null);
  };

  const downloadPDF = () => {
    if (!result) return;
    const pdfdoc = new jsPDF();
    const margin = 20; let y = 20;
    pdfdoc.setFontSize(22); pdfdoc.setTextColor(13, 148, 136);
    pdfdoc.text("MediScan AI Report", margin, y); y += 10;
    pdfdoc.setFontSize(10); pdfdoc.setTextColor(100);
    pdfdoc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y); y += 15;
    if (healthProfile?.name) {
      pdfdoc.setFontSize(11); pdfdoc.setTextColor(50);
      pdfdoc.text(`Patient: ${healthProfile.name}, Age: ${healthProfile.age}, Blood: ${healthProfile.bloodGroup}`, margin, y); y += 10;
    }
    pdfdoc.setDrawColor(200); pdfdoc.line(margin, y, 190, y); y += 12;
    pdfdoc.setFontSize(14); pdfdoc.setTextColor(0);
    pdfdoc.text("AI Analysis:", margin, y); y += 7;
    pdfdoc.setFontSize(11); pdfdoc.setTextColor(80);
    const split = pdfdoc.splitTextToSize(result.analysis, 170);
    pdfdoc.text(split, margin, y); y += split.length * 7 + 10;
    pdfdoc.setFontSize(14); pdfdoc.setTextColor(0);
    pdfdoc.text("Potential Conditions:", margin, y); y += 10;
    result.potential_conditions.forEach(c => {
      pdfdoc.setFontSize(12); pdfdoc.setTextColor(0);
      pdfdoc.text(`• ${c.name} (${c.probability})`, margin + 5, y); y += 6;
      pdfdoc.setFontSize(10); pdfdoc.setTextColor(100);
      const r = pdfdoc.splitTextToSize(c.reason, 160);
      pdfdoc.text(r, margin + 10, y); y += r.length * 5 + 6;
    });
    pdfdoc.setFontSize(8); pdfdoc.setTextColor(200, 0, 0);
    pdfdoc.text("DISCLAIMER: AI Prototype. Not a medical diagnosis.", margin, 280);
    pdfdoc.save("mediscan_report.pdf");
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      const encoded = btoa(JSON.stringify(result));
      const url = `${window.location.origin}?r=${encoded}`;
      if (navigator.share) {
        await navigator.share({ title: "MediScan Report", text: result.analysis, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Report Link Copied!");
      }
    } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{
      user, authLoading, lang, setLang, darkMode, t,
      result, setResult, loading, setLoading, error, setError,
      history, saveToHistory, clearHistory, loadHistoryItem,
      expertMode, setExpertMode,
      isChatOpen, setIsChatOpen,
      chatMessages, setChatMessages,
      activeTab, setActiveTab,
      healthProfile, setHealthProfile,
      handleLogout, downloadPDF, handleShare
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
