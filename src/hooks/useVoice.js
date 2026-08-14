// src/hooks/useVoice.js
import { useState } from "react";

// Store utterance globally to prevent browser garbage collection mid-speech
let currentUtterance = null;

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleVoice = (onResult, langCode = "en-US") => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend   = () => setIsListening(false);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    recognition.start();
  };

  const speak = (text, langCode = "en-US") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (targetVoice) currentUtterance.voice = targetVoice;

    currentUtterance.onstart = () => setIsSpeaking(true);
    currentUtterance.onend = () => setIsSpeaking(false);
    currentUtterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(currentUtterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { isListening, isSpeaking, toggleVoice, speak, stopSpeaking };
}
