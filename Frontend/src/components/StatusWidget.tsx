import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Wifi, 
  Cpu, 
  Layers3, 
  ShieldCheck,
  CircleDot
} from 'lucide-react';
import { DownloadItem } from '../types';

interface StatusWidgetProps {
  downloads: DownloadItem[];
}

export default function StatusWidget({ downloads }: StatusWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeDownloads = downloads.filter(d => d.status === 'downloading').length;

  return (
    <div 
      id="floating-status-widget"
      className="fixed bottom-4 right-4 z-40 select-none font-mono"
    >
      {isExpanded ? (
        /* EXPANDED PANEL VIEW */
        <div className="bg-[#151D30]/95 border border-[#12CFCE]/30 p-3.5 rounded-2xl w-56 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header toggler bar */}
          <div 
            onClick={() => setIsExpanded(false)}
            className="flex items-center justify-between border-b border-[#232F4C] pb-2 mb-2 cursor-pointer text-[10px] font-bold text-[#FFFFFF]"
          >
            <span className="flex items-center gap-1.5 text-[#12CFCE] font-sans">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              DIAGNOSTICS MONITOR
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#FFFFFF]" />
          </div>

          {/* Indicators list */}
          <div className="space-y-2 text-[10px]">
            {/* Status 1: Steam Connection */}
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">STEAM HUB:</span>
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                ONLINE
              </span>
            </div>

            {/* Status 2: Internet ping */}
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">INTERNET:</span>
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <Wifi className="w-3 h-3 text-[#10B981]" />
                STABLE
              </span>
            </div>

            {/* Status 3: MME Status */}
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">MME ENGINE:</span>
              <span className="text-[#12CFCE] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#12CFCE]" />
                SECURE
              </span>
            </div>

            {/* Status 4: Download queue length */}
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">DL QUEUE:</span>
              <span className="text-[#FFFFFF] font-bold">
                {activeDownloads} STREAMS
              </span>
            </div>

            {/* Status 5: RAM allocated */}
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">RAM USAGE:</span>
              <span className="text-[#12CFCE] font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                284.5 MB
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* MINIMIZED PILL TRIGGER */
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-[#151D30]/90 hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE]/50 py-1.5 px-3.5 rounded-full flex items-center gap-2.5 text-[10px] text-[#FFFFFF] shadow-lg hover:shadow-[0_0_12px_rgba(18,207,206,0.2)] transition-all cursor-pointer font-sans font-bold"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12CFCE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12CFCE]"></span>
          </span>
          <span className="font-mono">MME ACTIVE</span>
          <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        </button>
      )}
    </div>
  );
}
