import React, { useState } from 'react';
import { 
  Settings, 
  FolderOpen, 
  ShieldCheck, 
  Zap, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Globe, 
  BellRing,
  Laptop
} from 'lucide-react';

interface SettingsProps {
  isAudioOn: boolean;
  setIsAudioOn: (on: boolean) => void;
}

export default function SettingsView({
  isAudioOn,
  setIsAudioOn
}: SettingsProps) {
  const [downloadFolder, setDownloadFolder] = useState('E:\\SteamLibrary\\steamapps\\common\\Euro Truck Simulator 2\\mod');
  const [gameFolder, setGameFolder] = useState('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Euro Truck Simulator 2');
  const [steamFolder, setSteamFolder] = useState('C:\\Program Files (x86)\\Steam\\steam.exe');
  
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [perfMode, setPerfMode] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('English (US)');
  const [cacheSize, setCacheSize] = useState('324.5 MB');

  const handlePurgeCache = () => {
    alert('Clearing local image metadata and temporary unpack bundles...');
    setCacheSize('0.0 MB');
    alert('Cache purged successfully! Reclaimed 324.5 MB of solid state storage.');
  };

  const handleBrowsePath = (field: string) => {
    alert(`Browse folder dialog mock for: ${field}. Path updated successfully.`);
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in">
      
      {/* 1. Title segment */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-5 rounded-2xl border border-[#232F4C] backdrop-blur-md">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#12CFCE] uppercase font-bold">Preferences Panel</span>
          <h2 className="text-lg font-sans font-black text-[#FFFFFF] tracking-tight">Launcher & Directory System Settings</h2>
          <p className="text-xs text-[#94A3B8]">
            Customize directory endpoints, performance prioritization scripts, and auto-update behaviors.
          </p>
        </div>
      </div>

      {/* 2. Main split list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Folders, Auto Update, Performance (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Section A: Paths & Folders */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <FolderOpen className="w-4 h-4 text-[#12CFCE]" />
              Directory Folder Paths
            </span>

            {/* Path 1: Download Mod folder */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">Mod Directory Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={downloadFolder}
                  onChange={(e) => setDownloadFolder(e.target.value)}
                  className="flex-1 bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none font-mono"
                />
                <button 
                  onClick={() => handleBrowsePath('Mod folder')}
                  className="px-3 py-2 bg-[#1B2945] hover:bg-[#232F4C] border border-[#232F4C] text-[#12CFCE] hover:text-[#FFFFFF] text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Path 2: ETS2 installation path */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">ETS2 Game Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gameFolder}
                  onChange={(e) => setGameFolder(e.target.value)}
                  className="flex-1 bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none font-mono"
                />
                <button 
                  onClick={() => handleBrowsePath('ETS2 game path')}
                  className="px-3 py-2 bg-[#1B2945] hover:bg-[#232F4C] border border-[#232F4C] text-[#12CFCE] hover:text-[#FFFFFF] text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer"
                >
                  Browse
                </button>
              </div>
            </div>

            {/* Path 3: Steam Path */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#94A3B8] uppercase block">Steam Executable Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={steamFolder}
                  onChange={(e) => setSteamFolder(e.target.value)}
                  className="flex-1 bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none font-mono"
                />
                <button 
                  onClick={() => handleBrowsePath('Steam path')}
                  className="px-3 py-2 bg-[#1B2945] hover:bg-[#232F4C] border border-[#232F4C] text-[#12CFCE] hover:text-[#FFFFFF] text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          {/* Section B: Toggles and behavior */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <Laptop className="w-4 h-4 text-[#12CFCE]" />
              Launcher Mechanics & Updates
            </span>

            <div className="space-y-4">
              {/* Toggle 1: Auto Update */}
              <div className="flex items-center justify-between p-3 bg-[#151D30] border border-[#232F4C] rounded-xl text-xs">
                <div>
                  <h4 className="font-bold text-[#FFFFFF]">Automatic Mod Syncing</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Pushes automatic updates to active modifications when developers release new patch iterations.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoUpdate}
                  onChange={() => setAutoUpdate(!autoUpdate)}
                  className="w-9 h-5 bg-[#0B0F19] rounded-full border border-[#232F4C] cursor-pointer accent-[#12CFCE]"
                />
              </div>

              {/* Toggle 2: Audio/Voice feedback (synthesizer) */}
              <div className="flex items-center justify-between p-3 bg-[#151D30] border border-[#232F4C] rounded-xl text-xs">
                <div>
                  <h4 className="font-bold text-[#FFFFFF]">Speech Synthesis Voice Feedback</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Emits high-fidelity speech descriptions on critical operations (downloads, launches, payment checks).
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={isAudioOn}
                  onChange={() => setIsAudioOn(!isAudioOn)}
                  className="w-9 h-5 bg-[#0B0F19] rounded-full border border-[#232F4C] cursor-pointer accent-[#12CFCE]"
                />
              </div>

              {/* Toggle 3: Performance Mode */}
              <div className="flex items-center justify-between p-3 bg-[#151D30] border border-[#12CFCE]/30 rounded-xl text-xs bg-[#12CFCE]/5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-[#FFFFFF]">High Performance Gaming Mode</h4>
                    <span className="text-[8px] font-mono font-black text-[#0B0F19] bg-[#12CFCE] px-1.5 py-0.2 rounded uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                    Suspends non-essential background diagnostic threads and CDN tickers while ETS2 is running to secure maximum frame rate priority.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={perfMode}
                  onChange={() => setPerfMode(!perfMode)}
                  className="w-9 h-5 bg-[#0B0F19] rounded-full border border-[#232F4C] cursor-pointer accent-[#12CFCE]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Language, Cache, and Hardware summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Language selection card */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-3.5">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <Globe className="w-4 h-4 text-[#12CFCE]" />
              Language Options
            </span>

            <div className="space-y-2 text-xs">
              {['English (US)', 'Deutsch (German)', 'Français (French)', 'Polski (Polish)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLanguage(lang)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    currentLanguage === lang
                      ? 'bg-[#12CFCE]/10 text-[#FFFFFF] border border-[#12CFCE]/30'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF] border border-transparent'
                  }`}
                >
                  <span>{lang}</span>
                  {currentLanguage === lang && (
                    <CheckCircle className="w-3.5 h-3.5 text-[#12CFCE]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Storage cache purger card */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <Trash2 className="w-4 h-4 text-[#EF4444]" />
              Local Cache Purger
            </span>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8] font-mono">UNPACK CACHE:</span>
                <span className="text-[#FFFFFF] font-mono font-bold">{cacheSize}</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                Purging clears historical zip extracts, old thumbnails, and old invoice manifest maps. Recommended if running tight on solid state space.
              </p>
              <button
                onClick={handlePurgeCache}
                disabled={cacheSize === '0.0 MB'}
                className={`w-full py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-transparent text-[#EF4444] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  cacheSize === '0.0 MB' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge Unpack Cache</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
