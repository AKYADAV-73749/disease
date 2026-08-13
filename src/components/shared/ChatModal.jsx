// src/components/shared/ChatModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { BrainCircuit, X, MessageCircle, Send } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useGemini } from "../../hooks/useGemini";

export default function ChatModal() {
  const { t, darkMode, isChatOpen, setIsChatOpen, result, chatMessages, setChatMessages } = useApp();
  const { sendChatMessage } = useGemini();
  const [chatInput,   setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const dm = darkMode;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen || !result) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userText = chatInput;
    setChatInput("");
    setChatLoading(true);
    const reply = await sendChatMessage(userText, result, chatMessages, setChatMessages);
    setChatMessages(prev => [...prev, { role: "ai", text: reply }]);
    setChatLoading(false);
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ${dm ? "bg-black/70" : "bg-slate-900/60"}`}>
      <div className={`rounded-[2.5rem] shadow-2xl w-full max-w-lg h-[650px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border ${dm ? "bg-slate-900 border-slate-700" : "bg-white border-white/50"}`}>
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
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === "user" ? "bg-teal-600 text-white rounded-br-none" : (dm ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none")}`}>
                {msg.text}
              </div>
            </div>
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
        <form onSubmit={handleSubmit} className={`p-5 border-t flex gap-3 items-center ${dm ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={t.chat_placeholder}
            className={`flex-1 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium transition-all shadow-inner ${dm ? "bg-slate-800 text-white focus:bg-slate-700" : "bg-slate-100 text-slate-900 focus:bg-white"}`} />
          <button type="submit" disabled={chatLoading || !chatInput.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-teal-500/30 active:scale-95">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
