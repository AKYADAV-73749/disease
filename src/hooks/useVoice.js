// src/hooks/useVoice.js
import { useState } from "react";

// Store globally to prevent browser garbage collection mid-speech or mid-recording
let currentUtterance = null;
let currentRecognition = null;

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleVoice = (onResult, langCode = "en-US") => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }
    
    if (isListening && currentRecognition) {
      currentRecognition.stop();
      setIsListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    currentRecognition = new SR();
    currentRecognition.lang = langCode;
    currentRecognition.continuous = false;
    currentRecognition.interimResults = false;
    
    currentRecognition.onstart = () => setIsListening(true);
    currentRecognition.onend   = () => setIsListening(false);
    
    currentRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        alert("Microphone access is blocked! Please allow microphone permissions in your browser settings to use voice typing.");
      }
    };

    currentRecognition.onresult = (e) => {
      if (e.results && e.results[0] && e.results[0][0]) {
        const text = e.results[0][0].transcript;
        onResult(text);
      }
    };
    
    try {
      currentRecognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
    }
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
