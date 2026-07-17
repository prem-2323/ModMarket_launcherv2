import React, { useState } from 'react';
import { 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Power, 
  FolderOpen, 
  Trash2, 
  Wrench, 
  RefreshCcw, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowUpDown
} from 'lucide-react';
import { InstalledMod } from '../types';

interface LibraryProps {
  installedMods: InstalledMod[];
  onToggleEnabled: (modId: string) => void;
  onUpdatePriority: (modId: string, direction: 'up' | 'down') => void;
  onDeleteMod: (modId: string) => void;
  onUpdateMod: (modId: string) => void;
  onRepairMod: (modId: string) => void;
}

export default function Library({
  installedMods,
  onToggleEnabled,
  onUpdatePriority,
  onDeleteMod,
  onUpdateMod,
  onRepairMod
}: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort installed mods by priority ascending (priority 0 is highest)
  const sortedMods = [...installedMods].sort((a, b) => a.priority - b.priority);

  const filteredMods = sortedMods.filter((mod) =>
    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenFolder = (modTitle: string) => {
    alert(`Opened folder Explorer path:\nC:\\Users\\adspm2323\\Documents\\Euro Truck Simulator 2\\mod\\${modTitle.replace(/\s+/g, '_')}`);
  };

  return (
    <div id="library-view" className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Info Banner & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-5 rounded-2xl border border-[#232F4C] backdrop-blur-md">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#12CFCE] uppercase font-bold">Mod Load Order Manager</span>
          <h2 className="text-lg font-sans font-black text-[#FFFFFF] tracking-tight">Installed Trucking Modification Profiles</h2>
          <p className="text-[11px] text-[#94A3B8] max-w-xl leading-relaxed">
            <span className="text-[#F59E0B] font-semibold">Priority Warning:</span> Map expansions must load at the <span className="text-[#12CFCE] font-bold">bottom (lower priority numbers)</span>. Chassis physics and custom V8 sound files must load at the <span className="text-[#12CFCE] font-bold">top (higher priority numbers)</span> to prevent overriding default assets.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search installed mods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151D30]/80 border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>
      </div>

      {/* 2. Grid Container with Priority Control Side Assist panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main List Column (9 Cols) */}
        <div className="lg:col-span-9 space-y-3">
          {filteredMods.length === 0 ? (
            <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <span className="text-2xl block">📦</span>
              <p className="text-sm font-bold text-[#FFFFFF] mt-2">No modifications currently installed</p>
              <p className="text-xs text-[#94A3B8] mt-1">Visit the Store to download map packs or graphic modifications</p>
            </div>
          ) : (
            filteredMods.map((mod, index) => {
              const isFirst = index === 0;
              const isLast = index === filteredMods.length - 1;

              return (
                <div
                  key={mod.id}
                  className={`group relative overflow-hidden bg-[#151D30]/60 hover:bg-[#1B2945]/30 border transition-all duration-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    mod.enabled 
                      ? 'border-[#232F4C] hover:border-[#12CFCE]/50 shadow-[0_2px_12px_rgba(18,207,206,0.03)]' 
                      : 'border-[#232F4C]/50 opacity-60'
                  }`}
                >
                  {/* Glowing left highlight if enabled */}
                  {mod.enabled && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#12CFCE]/80 shadow-[0_0_8px_#12CFCE]" />
                  )}

                  {/* Left section: Thumbnail, Priority badge, Title, Specs */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    
                    {/* Priority Badge Indicator */}
                    <div className="flex flex-col items-center justify-center bg-[#151D30] border border-[#232F4C] px-2.5 py-1.5 rounded-lg shrink-0">
                      <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Pri</span>
                      <span className="text-sm font-sans font-black text-[#12CFCE]">#{mod.priority + 1}</span>
                    </div>

                    {/* Image */}
                    <div className="w-16 h-12 bg-cover bg-center rounded-lg border border-[#232F4C] shrink-0 hidden sm:block" style={{ backgroundImage: `url('${mod.thumbnail}')` }} referrerPolicy="no-referrer" />

                    {/* Title & Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-sans font-bold text-sm text-[#FFFFFF] truncate">
                          {mod.title}
                        </h3>
                        <span className="text-[9px] font-mono text-[#94A3B8] bg-[#151D30] border border-[#232F4C] px-1.5 py-0.2 rounded uppercase shrink-0">
                          {mod.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#94A3B8] font-mono mt-1">
                        <span>Ver: <strong className="text-[#FFFFFF]">{mod.version}</strong></span>
                        <span>Size: <strong className="text-[#FFFFFF]">{mod.fileSize}</strong></span>
                        <span>Installed: <strong className="text-[#FFFFFF]">{mod.installDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right section: Control Actions (Enable/Disable, Priority Shift, Utilities) */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                    
                    {/* Priority Shifter Buttons */}
                    <div className="flex items-center bg-[#151D30] border border-[#232F4C] rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdatePriority(mod.id, 'up')}
                        disabled={isFirst}
                        className={`p-1.5 rounded-md transition-all ${
                          isFirst 
                            ? 'text-[#232F4C] cursor-not-allowed' 
                            : 'text-[#94A3B8] hover:text-[#12CFCE] hover:bg-[#1B2945]/50'
                        }`}
                        title="Increase load priority (Load earlier)"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="h-4 w-[1px] bg-[#232F4C]" />
                      <button
                        onClick={() => onUpdatePriority(mod.id, 'down')}
                        disabled={isLast}
                        className={`p-1.5 rounded-md transition-all ${
                          isLast 
                            ? 'text-[#232F4C] cursor-not-allowed' 
                            : 'text-[#94A3B8] hover:text-[#12CFCE] hover:bg-[#1B2945]/50'
                        }`}
                        title="Decrease load priority (Load later)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Enable / Disable Power Button Toggle */}
                    <button
                      onClick={() => onToggleEnabled(mod.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-300 cursor-pointer border ${
                        mod.enabled
                          ? 'bg-[#12CFCE]/10 border-[#12CFCE]/50 text-[#12CFCE] hover:bg-[#12CFCE]/20'
                          : 'bg-[#151D30] border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
                      }`}
                      title={mod.enabled ? "Deactivate modification profile" : "Activate modification profile"}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{mod.enabled ? 'ACTIVE' : 'INACTIVE'}</span>
                    </button>

                    {/* Action Dropdown/Buttons (Open Folder, Repair, Update, Delete) */}
                    <div className="flex items-center space-x-1.5">
                      {mod.isUpdating && (
                        <button
                          onClick={() => onUpdateMod(mod.id)}
                          className="p-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 hover:border-[#F59E0B] text-[#F59E0B] rounded-lg transition-all animate-pulse"
                          title="Update pending! Click to flash files"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleOpenFolder(mod.title)}
                        className="p-1.5 bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF] rounded-lg transition-all"
                        title="Explore Mod Files"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRepairMod(mod.id)}
                        className="p-1.5 bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] text-[#94A3B8] hover:text-[#10B981] rounded-lg transition-all"
                        title="Verify integrity of files"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteMod(mod.id)}
                        className="p-1.5 bg-[#151D30] hover:bg-red-500/10 border border-[#232F4C] hover:border-red-500/50 text-[#94A3B8] hover:text-red-500 rounded-lg transition-all"
                        title="Uninstall from ETS2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Informative Assist Sidebar Panel (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-4 rounded-2xl backdrop-blur-md space-y-3.5">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <ArrowUpDown className="w-4 h-4 text-[#12CFCE]" />
              Load Order Rules
            </span>

            <div className="space-y-3 text-xs leading-normal">
              <div className="p-2.5 bg-[#12CFCE]/5 border border-[#12CFCE]/20 rounded-xl space-y-1">
                <span className="font-bold text-[#FFFFFF]">1. Global Fixes:</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Keep visual lighting profiles and crash overrides at the absolute highest priority.
                </p>
              </div>

              <div className="p-2.5 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl space-y-1">
                <span className="font-bold text-[#FFFFFF]">2. Custom Cabinets:</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Scania and Volvo custom bodies must load next to overwrite native truck visual maps.
                </p>
              </div>

              <div className="p-2.5 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl space-y-1">
                <span className="font-bold text-[#FFFFFF]">3. Sounds & Tires:</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Sound boards and physics dynamics load beneath custom cabinets.
                </p>
              </div>

              <div className="p-2.5 bg-[#151D30] border border-[#232F4C] rounded-xl space-y-1">
                <span className="font-bold text-[#FFFFFF]">4. Map Expansions:</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Balkan map, ProMods, and custom cities load at the bottom (last priority values).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
