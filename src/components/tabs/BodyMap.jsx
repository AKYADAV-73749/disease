import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Activity, ShieldCheck } from "lucide-react";

export default function BodyMap({ onRegionClick }) {
  const { darkMode, lang } = useApp();
  const dm = darkMode;
  const containerRef = useRef(null);
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max rotation is 15 degrees
    const rotateY = (x / (rect.width / 2)) * 15;
    const rotateX = -(y / (rect.height / 2)) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 }); // Reset on leave
  };

  // Percentage based hitboxes for a 1:1 square image
  const regions = [
    { id: "head", label: { en: "Headache", hi: "सिरदर्द" }, style: { top: "5%", left: "40%", width: "20%", height: "15%" } },
    { id: "chest", label: { en: "Chest Pain", hi: "छाती में दर्द" }, style: { top: "20%", left: "35%", width: "30%", height: "20%" } },
    { id: "stomach", label: { en: "Stomach Pain", hi: "पेट दर्द" }, style: { top: "40%", left: "35%", width: "30%", height: "15%" } },
    { id: "leftArm", label: { en: "Joint Pain (Arm)", hi: "हाथ में दर्द" }, style: { top: "25%", left: "65%", width: "20%", height: "30%" } },
    { id: "rightArm", label: { en: "Joint Pain (Arm)", hi: "हाथ में दर्द" }, style: { top: "25%", left: "15%", width: "20%", height: "30%" } },
    { id: "leftLeg", label: { en: "Muscle Cramps", hi: "मांसपेशियों में ऐंठन" }, style: { top: "55%", left: "50%", width: "15%", height: "40%" } },
    { id: "rightLeg", label: { en: "Muscle Cramps", hi: "मांसपेशियों में ऐंठन" }, style: { top: "55%", left: "35%", width: "15%", height: "40%" } }
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 mt-6 border-t border-slate-700/50">
      <p className={`text-xs font-bold uppercase tracking-widest mb-6 ${dm ? "text-slate-400" : "text-slate-500"}`}>
        {lang === "hi" ? "लक्षण चुनने के लिए शरीर पर टैप करें" : "Tap Body Regions to Add Symptoms"}
      </p>
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => handleMouseMove(e.touches[0])}
        onTouchEnd={handleMouseLeave}
        className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(13,148,136,0.2)] bg-[#050505] border border-teal-900/50"
        style={{ perspective: "1000px" }}
      >
        {/* Hologram Chamber (3D transform wrapper) */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transformStyle: "preserve-3d" }}
        >
          {/* Background Grid Floor (Rotated to lay flat) */}
          <div 
            className="absolute bottom-[-50%] left-[-50%] right-[-50%] h-[150%] bg-[linear-gradient(rgba(45,212,191,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.2)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 blur-[1px]" 
            style={{ transform: "rotateX(75deg) translateZ(-100px) translateY(25%)" }}
          />
          
          {/* Back Wall Glow */}
          <div className="absolute inset-0 bg-teal-500/10 blur-3xl" style={{ transform: "translateZ(-50px)" }} />

          {/* The Body Image */}
          <img 
            src="/medical_body.jpg" 
            alt="Medical Body Scan" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
            draggable={false}
            style={{ transform: "translateZ(10px)" }}
          />
          
          {/* Scanner Line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-scan" 
            style={{ transform: "translateZ(30px)" }}
          />

          {/* HUD Overlays (Floating) */}
          <div 
            className="absolute top-4 left-4 px-2 py-1 bg-teal-900/40 border border-teal-500/40 rounded backdrop-blur-sm flex items-center gap-1.5"
            style={{ transform: "translateZ(40px)" }}
          >
            <Activity className="w-3 h-3 text-teal-400 animate-pulse" />
            <span className="text-[9px] text-teal-400 font-mono tracking-widest">VITALS: STABLE</span>
          </div>
          <div 
            className="absolute top-4 right-4 px-2 py-1 bg-teal-900/40 border border-teal-500/40 rounded backdrop-blur-sm flex items-center gap-1.5"
            style={{ transform: "translateZ(40px)" }}
          >
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span className="text-[9px] text-teal-400 font-mono tracking-widest">SCAN ACTIVE</span>
          </div>

          {/* Invisible Clickable Zones (Lifted above the image for clickability) */}
          <div className="absolute inset-0" style={{ transform: "translateZ(50px)" }}>
            {regions.map((region) => (
              <div
                key={region.id}
                className="absolute cursor-pointer group"
                style={region.style}
                onClick={() => onRegionClick(region.label)}
              >
                {/* Hover Indicator */}
                <div className="w-full h-full rounded-full border border-teal-400/0 group-hover:border-teal-400/80 group-hover:bg-teal-400/10 transition-all duration-300 shadow-[0_0_15px_rgba(45,212,191,0)] group-hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-[0.8] group-hover:scale-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
