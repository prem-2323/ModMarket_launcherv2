import React from 'react';
import { 
  CheckCircle, 
  Cpu, 
  Database, 
  Folder, 
  HardDrive, 
  History, 
  Info, 
  Layers, 
  Newspaper, 
  Play, 
  RefreshCcw, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Truck, 
  Wrench 
} from 'lucide-react';
import { Mod, InstalledMod, Page } from '../types';
import { MOCK_NEWS, MOCK_RECENT_ACTIVITY } from '../mockData';

interface DashboardProps {
  installedMods: InstalledMod[];
  purchasedModsCount: number;
  onLaunchGame: () => void;
  setCurrentTab: (tab: Page) => void;
  triggerQuickAction: (action: string) => void;
}

export default function Dashboard({
  installedMods,
  purchasedModsCount,
  onLaunchGame,
  setCurrentTab,
  triggerQuickAction
}: DashboardProps) {
  const enabledCount = installedMods.filter(m => m.enabled).length;
  const pendingUpdates = installedMods.filter(m => m.isUpdating).length;

  return (
    <div id="dashboard-view" className="space-y-6 animate-fade-in">
      {/* 1. Large ETS2 Banner Area */}
      <div 
        className="relative h-64 rounded-2xl overflow-hidden border border-[#232F4C] bg-cover bg-center shadow-[0_4px_24px_rgba(0,0,0,0.4)] group"
        style={{ 
          backgroundImage: `linear-gradient(to right, #0B0F19 20%, rgba(11, 15, 25, 0.4) 60%, rgba(18, 207, 206, 0.1) 100%), url('https://images.unsplash.com/photo-1518659276927-5da44177455e?auto=format&fit=crop&w=1200&q=80')` 
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

        {/* Content Container */}
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between p-6 md:p-8 max-w-xl z-10">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#12CFCE] uppercase font-bold bg-[#12CFCE]/10 border border-[#12CFCE]/30 px-2.5 py-1 rounded-full">
              Featured Game
            </span>
            <h1 className="text-3xl md:text-4xl font-sans font-black text-[#FFFFFF] tracking-tight mt-3 drop-shadow-md">
              Euro Truck Simulator 2
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Experience maximum trucking realism in Europe with custom lowbeds, detailed heavy-haul cargo, and bespoke graphics packages.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-4">
            <div className="flex items-center gap-1.5 text-xs text-[#FFFFFF]">
              <span className="font-mono text-[#94A3B8]">Version:</span>
              <span className="font-bold bg-[#1B2945] px-2 py-0.5 rounded border border-[#232F4C]">v1.52.1s</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#FFFFFF]">
              <span className="font-mono text-[#94A3B8]">Launcher:</span>
              <span className="font-bold text-[#12CFCE] bg-[#12CFCE]/10 px-2 py-0.5 rounded border border-[#12CFCE]/20">v2.4.8 (Stable)</span>
            </div>
          </div>
        </div>

        {/* Floating System Connection Status List (Right Overlay) */}
        <div className="absolute top-6 right-6 hidden lg:flex flex-col space-y-2 bg-[#151D30]/90 border border-[#232F4C] p-4 rounded-xl backdrop-blur-md">
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase tracking-widest border-b border-[#232F4C] pb-1.5 mb-1">
            Diagnostic Status
          </span>
          <div className="flex items-center gap-2 text-xs text-[#FFFFFF]">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            <span>ETS2 Installed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#FFFFFF]">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            <span>Steam Connected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#FFFFFF]">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            <span>Mod Folder Found</span>
          </div>
        </div>

        {/* Large Glowing Launch ETS2 overlay trigger */}
        <div className="absolute bottom-6 right-6 z-10">
          <button 
            onClick={onLaunchGame}
            className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#12CFCE] to-[#10B981] hover:from-[#10B981] hover:to-[#12CFCE] text-[#0B0F19] hover:text-[#FFFFFF] font-black text-sm uppercase rounded-xl tracking-wider transition-all duration-300 transform hover:scale-[1.03] shadow-[0_0_24px_rgba(18,207,206,0.4)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>Launch Game</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Installed Mods */}
        <div 
          onClick={() => setCurrentTab('library')}
          className="bg-[#151D30]/60 hover:bg-[#1B2945]/40 border border-[#232F4C] hover:border-[#12CFCE]/40 p-4 rounded-2xl cursor-pointer transition-all duration-300 group shadow-md"
        >
          <div className="flex items-center justify-between text-[#94A3B8] group-hover:text-[#12CFCE] mb-2">
            <span className="text-xs font-mono font-medium">Installed Mods</span>
            <Folder className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">{installedMods.length}</p>
          <span className="text-[10px] text-[#10B981] font-mono font-semibold">
            {enabledCount} active in profile
          </span>
        </div>

        {/* Card 2: Purchased Mods */}
        <div 
          onClick={() => setCurrentTab('store')}
          className="bg-[#151D30]/60 hover:bg-[#1B2945]/40 border border-[#232F4C] hover:border-[#12CFCE]/40 p-4 rounded-2xl cursor-pointer transition-all duration-300 group shadow-md"
        >
          <div className="flex items-center justify-between text-[#94A3B8] group-hover:text-[#12CFCE] mb-2">
            <span className="text-xs font-mono font-medium">Purchased Mods</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">{purchasedModsCount}</p>
          <span className="text-[10px] text-[#12CFCE] font-mono font-semibold">
            Store synchronization OK
          </span>
        </div>

        {/* Card 3: Downloaded Mods */}
        <div 
          onClick={() => setCurrentTab('library')}
          className="bg-[#151D30]/60 hover:bg-[#1B2945]/40 border border-[#232F4C] hover:border-[#12CFCE]/40 p-4 rounded-2xl cursor-pointer transition-all duration-300 group shadow-md"
        >
          <div className="flex items-center justify-between text-[#94A3B8] group-hover:text-[#12CFCE] mb-2">
            <span className="text-xs font-mono font-medium">Downloaded Mods</span>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">{installedMods.length}</p>
          <span className="text-[10px] text-[#94A3B8] font-mono">
            Buffered local assets
          </span>
        </div>

        {/* Card 4: Pending Updates */}
        <div 
          onClick={() => setCurrentTab('downloads')}
          className="bg-[#151D30]/60 hover:bg-[#1B2945]/40 border border-[#232F4C] hover:border-[#12CFCE]/40 p-4 rounded-2xl cursor-pointer transition-all duration-300 group shadow-md"
        >
          <div className="flex items-center justify-between text-[#94A3B8] group-hover:text-[#12CFCE] mb-2">
            <span className="text-xs font-mono font-medium">Pending Updates</span>
            <RefreshCcw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">{pendingUpdates}</p>
          <span className={`text-[10px] font-mono font-semibold ${pendingUpdates > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
            {pendingUpdates > 0 ? `${pendingUpdates} update ready` : 'All mods up to date'}
          </span>
        </div>

        {/* Card 5: Available Storage */}
        <div className="bg-[#151D30]/60 border border-[#232F4C] p-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-xs font-mono font-medium">Available Storage</span>
            <HardDrive className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">420.4 GB</p>
          <span className="text-[10px] text-[#94A3B8] font-mono">
            Drive E:\ (Solid State Drive)
          </span>
        </div>

        {/* Card 6: Launcher Version */}
        <div 
          onClick={() => setCurrentTab('settings')}
          className="bg-[#151D30]/60 hover:bg-[#1B2945]/40 border border-[#232F4C] p-4 rounded-2xl cursor-pointer shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center justify-between text-[#94A3B8] group-hover:text-[#12CFCE] mb-2">
            <span className="text-xs font-mono font-medium">Launcher Version</span>
            <Info className="w-4 h-4" />
          </div>
          <p className="text-2xl font-sans font-black text-[#FFFFFF]">v2.4.8</p>
          <span className="text-[10px] text-[#10B981] font-mono font-semibold">
            Latest official build
          </span>
        </div>
      </div>

      {/* 3. Launcher History & Logs Section */}
      <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans font-black text-[#FFFFFF] text-lg tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#12CFCE]" />
            Launcher History & Logs
          </span>
          <span className="text-xs text-[#94A3B8] font-mono">
            Session time: 4h 12m
          </span>
        </div>

        <div className="space-y-2.5">
          {MOCK_RECENT_ACTIVITY.map((act) => (
            <div 
              key={act.id} 
              className="flex items-center justify-between p-3 bg-[#151D30]/80 border border-[#232F4C] rounded-xl text-xs hover:bg-[#1B2945]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  act.type === 'download' ? 'bg-[#12CFCE]' :
                  act.type === 'payment' ? 'bg-[#F59E0B]' :
                  act.type === 'success' ? 'bg-[#10B981]' : 'bg-[#94A3B8]'
                }`} />
                <span className="text-[#FFFFFF] font-medium">{act.text}</span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
