import React, { useState, useRef, useEffect } from "react";
import { BrainCircuit, X, MessageCircle, Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";

export default function ChatModal() {
  const { t, darkMode, isChatOpen, setIsChatOpen, result, chatMessages, setChatMessages } = useApp();
  const { sendChatMessage } = useGemini();
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const dm = darkMode;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);
    await sendChatMessage(msg);
    setChatLoading(false);
  };

  return (
    <AnimatePresence>
      {isChatOpen && result && (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className={`absolute inset-0 backdrop-blur-sm transition-opacity ${dm ? "bg-black/70" : "bg-slate-900/60"}`}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className={`relative rounded-[2.5rem] shadow-2xl w-full max-w-lg h-[650px] flex flex-col overflow-hidden border ${dm ? "bg-slate-900 border-slate-700" : "bg-white border-white/50"}`}
          >
            {/* Header */}
            <div className="bg-teal-700 p-6 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.chat_header}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-xs text-teal-100 font-medium">{t.chat_sub}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2.5 hover:bg-white/20 rounded-full transition-colors active:scale-90">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${dm ? "bg-slate-950" : "bg-slate-50"}`}>
              {chatMessages.length === 0 && (
                <div className="text-center text-slate-400 mt-20 opacity-60">
                  <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${dm ? "text-slate-700" : "text-slate-300"}`} />
                  <p className="text-base font-medium">{t.chat_empty}</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === "user" ? "bg-teal-600 text-white rounded-br-none" : (dm ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none")}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className={`border p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center ${dm ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-4 border-t ${dm ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className={`flex items-center gap-3 p-2 rounded-2xl border ${dm ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  placeholder={t.chat_ph}
                  className={`flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium ${dm ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`} />
                <button type="submit" disabled={!chatInput.trim() || chatLoading}
                  className={`p-3 rounded-xl transition-all ${!chatInput.trim() || chatLoading ? (dm ? "bg-slate-800 text-slate-600" : "bg-slate-200 text-slate-400") : "bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-95"}`}>
                  {chatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
