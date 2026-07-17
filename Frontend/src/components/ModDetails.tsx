import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Download, 
  Star, 
  Heart, 
  CheckCircle,
  FileText,
  Layers,
  ShieldCheck,
  ShieldAlert,
  User,
  Calendar,
  Layers3,
  FlameKindling
} from 'lucide-react';
import { Mod } from '../types';

interface ModDetailsProps {
  mod: Mod;
  purchasedModIds: string[];
  installedModIds: string[];
  favoriteModIds: string[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onBuyMod: (mod: Mod) => void;
  onDownloadMod: (modId: string) => void;
}

export default function ModDetails({
  mod,
  purchasedModIds,
  installedModIds,
  favoriteModIds,
  onBack,
  onToggleFavorite,
  onBuyMod,
  onDownloadMod
}: ModDetailsProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  
  const isOwned = !mod.isPremium || purchasedModIds.includes(mod.id);
  const isDownloaded = installedModIds.includes(mod.id);
  const isFavorite = favoriteModIds.includes(mod.id);

  // Total reviews count
  const totalStars = Object.values(mod.ratingBreakdown).reduce((acc, curr) => acc + curr, 0);

  return (
    <div id="mod-details-view" className="space-y-6 animate-fade-in">
      
      {/* 1. Back and Title Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#151D30]/80 border border-[#232F4C] hover:border-[#12CFCE]/50 text-xs text-[#94A3B8] hover:text-[#FFFFFF] rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>

        <div className="flex items-center space-x-2">
          {mod.isPremium ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-black uppercase text-[#0B0F19] bg-[#12CFCE] px-2.5 py-1 rounded">
              <Crown className="w-3.5 h-3.5 fill-current" />
              Premium Mod
            </span>
          ) : (
            <span className="text-[10px] font-mono font-black uppercase text-[#FFFFFF] bg-[#10B981] px-2.5 py-1 rounded">
              Free Mod
            </span>
          )}
          <span className="text-[10px] font-mono text-[#FFFFFF] bg-[#151D30] border border-[#232F4C] px-2.5 py-1 rounded">
            Version {mod.version}
          </span>
        </div>
      </div>

      {/* 2. Main content split layout: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gallery & Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Screenshot Display */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl overflow-hidden p-2 backdrop-blur-md">
            <div className="relative h-96 bg-cover bg-center rounded-xl overflow-hidden transition-all duration-300" style={{ backgroundImage: `url('${mod.screenshots[activeScreenIndex] || mod.thumbnail}')` }} referrerPolicy="no-referrer">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-40" />
            </div>

            {/* Screenshots Thumbnails Strip */}
            {mod.screenshots.length > 1 && (
              <div className="flex gap-2 mt-2 px-1">
                {mod.screenshots.map((screen, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`w-24 h-14 rounded-lg border bg-cover bg-center transition-all ${
                      activeScreenIndex === idx
                        ? 'border-[#12CFCE] scale-95 shadow-[0_0_8px_rgba(18,207,206,0.3)]'
                        : 'border-[#232F4C] opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundImage: `url('${screen}')` }}
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description and Key Highlights */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div>
              <h1 className="text-2xl font-sans font-black text-[#FFFFFF] tracking-tight">
                {mod.title}
              </h1>
              <p className="text-xs text-[#12CFCE] mt-1 font-mono">
                DEVELOPED BY {mod.author.toUpperCase()} • RELEASED {mod.releaseDate}
              </p>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {mod.description}
            </p>

            <div className="border-t border-[#232F4C] pt-4">
              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-3">
                Key Features & Customizations
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {mod.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#FFFFFF]">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Column: Specifications & Pricing (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Pricing & Action Card */}
          <div className="bg-gradient-to-b from-[#151D30] to-[#1B2945]/40 border border-[#12CFCE]/30 rounded-2xl p-5 shadow-[0_0_24px_rgba(18,207,206,0.05)]">
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">AQUIRING LICENSE</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-sans font-black text-[#FFFFFF]">
                {mod.isPremium ? `$${mod.price}` : 'FREE'}
              </span>
              {mod.isPremium && (
                <span className="text-[10px] text-[#94A3B8] font-mono">one-time seat purchase</span>
              )}
            </div>

            <div className="space-y-2.5 mt-5">
              {mod.isPremium && !isOwned ? (
                <button
                  onClick={() => onBuyMod(mod)}
                  className="w-full py-3 bg-gradient-to-r from-[#12CFCE] to-[#10B981] text-[#0B0F19] hover:text-[#FFFFFF] font-black text-sm uppercase rounded-xl tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_16px_rgba(18,207,206,0.2)] hover:shadow-[0_0_24px_rgba(18,207,206,0.4)] cursor-pointer"
                >
                  Buy Mod Now
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isDownloaded) {
                      onDownloadMod(mod.id);
                    }
                  }}
                  disabled={isDownloaded}
                  className={`w-full py-3 text-sm font-black uppercase rounded-xl tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isDownloaded
                      ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] disabled:opacity-100 cursor-default'
                      : 'bg-[#151D30] hover:bg-[#1B2945] border border-[#12CFCE]/50 text-[#12CFCE] hover:text-[#FFFFFF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready In Library</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Assets</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => onToggleFavorite(mod.id)}
                className={`w-full py-2 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-[#EF4444]'
                    : 'bg-[#151D30]/60 border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#12CFCE]/30'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2">
              Technical Specifications
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-mono text-[10px]">FILE SIZE</span>
                <p className="text-[#FFFFFF] font-bold">{mod.fileSize}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-mono text-[10px]">VERSION</span>
                <p className="text-[#FFFFFF] font-bold">{mod.version}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-mono text-[10px]">COMPATIBILITY</span>
                <p className="text-[#12CFCE] font-bold">{mod.compatibility}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-mono text-[10px]">DOWNLOADS</span>
                <p className="text-[#FFFFFF] font-bold">{mod.downloads.toLocaleString()}</p>
              </div>
            </div>

            {/* DLC requirements */}
            <div className="space-y-2 border-t border-[#232F4C] pt-3">
              <span className="text-[#94A3B8] font-mono text-[10px] block">REQUIRED DLCs</span>
              {mod.requiredDLC.length === 0 ? (
                <span className="text-xs text-[#10B981] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  No DLC Required
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {mod.requiredDLC.map((dlc, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-[#FFFFFF] bg-[#1B2945] px-2 py-0.5 rounded border border-[#232F4C]">
                      {dlc}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dependencies */}
            <div className="space-y-2 border-t border-[#232F4C] pt-3">
              <span className="text-[#94A3B8] font-mono text-[10px] block">DEPENDENCIES</span>
              {mod.dependencies.length === 0 ? (
                <span className="text-xs text-[#10B981] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Self-contained Mod
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {mod.dependencies.map((dep, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {dep}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2">
              Reviews Rating Breakdown
            </span>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-sans font-black text-[#FFFFFF]">
                {mod.rating.toFixed(2)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(mod.rating) 
                          ? 'text-[#F59E0B] fill-current' 
                          : 'text-[#232F4C]'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#94A3B8] mt-0.5">
                  Based on {totalStars} verified drivers
                </span>
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-1.5 pt-2">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count = mod.ratingBreakdown[stars];
                const pct = totalStars > 0 ? (count / totalStars) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                    <span className="w-12 text-right pr-2 font-mono">{stars} Star</span>
                    <div className="flex-1 h-2 bg-[#151D30] rounded-full overflow-hidden mx-2 border border-[#232F4C]">
                      <div 
                        className="h-full bg-[#12CFCE] rounded-full" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <span className="w-10 text-left pl-2 text-xs font-mono text-[#FFFFFF]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
