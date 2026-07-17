import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Zap, Layers3, Activity } from 'lucide-react';

interface LaunchScreenProps {
  onComplete: () => void;
  isAudioOn: boolean;
}

export default function LaunchScreen({ onComplete, isAudioOn }: LaunchScreenProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    { text: 'Checking ETS2 installation integrity...', icon: ShieldCheck, color: 'text-[#10B981]' },
    { text: 'Scanning mod dependencies & assemblies...', icon: Layers3, color: 'text-[#12CFCE]' },
    { text: 'Analyzing manifest load order conflicts...', icon: Activity, color: 'text-[#F59E0B]' },
    { text: 'Injecting customized cabin assets & audio files...', icon: Zap, color: 'text-[#12CFCE]' },
    { text: 'Starting Euro Truck Simulator 2 in virtual overlay...', icon: Truck, color: 'text-[#10B981]' }
  ];

  // Increment progress bar and stages sequentially
  useEffect(() => {
    // Stage updates every 1.5s
    const stageInterval = setInterval(() => {
      setStage((prev) => {
        if (prev < stages.length - 1) {
          // Speak stage if audio is active
          if (window.speechSynthesis && isAudioOn) {
            const utterance = new SpeechSynthesisUtterance(stages[prev + 1].text);
            utterance.rate = 1.15;
            window.speechSynthesis.speak(utterance);
          }
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    // Progress updates every 80ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(progressInterval);
          clearInterval(stageInterval);
          // Briefly let complete show
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
      });
    }, 75);

    // Initial speak
    if (window.speechSynthesis && isAudioOn) {
      const utterance = new SpeechSynthesisUtterance(stages[0].text);
      utterance.rate = 1.15;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete, isAudioOn]);

  const CurrentIcon = stages[stage].icon;

  return (
    <div 
      id="launch-overlay"
      className="fixed inset-0 bg-[#0B0F19] z-[999] flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300"
    >
      {/* Immersive starfield ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,207,206,0.12),transparent_70%)]" />

      {/* Main launch visual container */}
      <div className="relative max-w-lg w-full space-y-10 z-10">
        
        {/* Title / Logo Header */}
        <div className="space-y-1.5 animate-pulse">
          <h1 className="text-4xl font-sans font-black tracking-widest text-[#FFFFFF] drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            MODMARKET <span className="text-[#12CFCE]">LAUNCHER v2</span>
          </h1>
          <p className="text-xs tracking-widest text-[#94A3B8] font-mono uppercase">EURO TRUCK SIMULATOR 2 CLIENT BOOT</p>
        </div>

        {/* Dynamic Truck Riding Road Track Animation */}
        <div className="relative h-24 bg-[#151D30]/60 border border-[#232F4C] rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl p-4">
          
          {/* Moving highway markings */}
          <div className="absolute left-0 right-0 h-1 border-t border-dashed border-[#232F4C]/80 top-1/2 -translate-y-1/2 animate-shimmer" style={{ backgroundSize: '20px' }} />

          {/* Scrolling scenic neon stars/lights in background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#12CFCE]/5 to-transparent animate-pulse" />

          {/* Truck Icon translating smoothly */}
          <div 
            className="absolute flex flex-col items-center transition-all duration-300"
            style={{ left: `${Math.min(progress, 88)}%` }}
          >
            <div className="relative">
              <Truck className="w-12 h-12 text-[#12CFCE] drop-shadow-[0_0_12px_rgba(18,207,206,0.6)] animate-bounce" />
              {/* Wheel dust particle sparks */}
              <span className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-[#10B981] animate-ping opacity-60" />
              <span className="absolute -bottom-1 -right-2 w-2 h-2 rounded-full bg-[#12CFCE] animate-ping opacity-60" />
            </div>
            <span className="text-[9px] font-mono font-bold text-[#FFFFFF] bg-[#0B0F19] px-1.5 py-0.2 rounded border border-[#12CFCE]/30 mt-1 uppercase">
              SCANIA S
            </span>
          </div>
        </div>

        {/* Current Loading Stage Texts */}
        <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md flex items-center space-x-4 text-left max-w-md mx-auto">
          <div className={`p-3 rounded-xl bg-[#0B0F19] border border-[#232F4C] ${stages[stage].color}`}>
            <CurrentIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase tracking-widest block">
              DIAGNOSTICS SEQUENCE ({stage + 1}/{stages.length})
            </span>
            <p className="text-xs font-bold text-[#FFFFFF] leading-snug mt-1 truncate">
              {stages[stage].text}
            </p>
          </div>
        </div>

        {/* Overall Progress Loading Bar */}
        <div className="space-y-2.5 max-w-md mx-auto">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#94A3B8]">BOOT PROGRESS</span>
            <span className="text-[#12CFCE] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-[#151D30] rounded-full border border-[#232F4C] overflow-hidden p-[2px] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#12CFCE] to-[#10B981] rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(18,207,206,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
