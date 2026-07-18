import React from 'react';
import { 
  User, 
  Trophy, 
  Truck, 
  MapPin, 
  Clock, 
  Award, 
  Calendar, 
  CheckCircle, 
  FileCheck,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MOCK_ACHIEVEMENTS } from '../mockData';

interface ProfileProps {
  purchasedModsCount: number;
  installedModsCount: number;
}

export default function Profile({
  purchasedModsCount,
  installedModsCount
}: ProfileProps) {
  // Stats block
  const stats = [
    { label: 'PLAYTIME', value: '1,424 HOURS', icon: Clock, color: 'text-[#12CFCE]' },
    { label: 'DELIVERIES COMPLETED', value: '842 RUNS', icon: Truck, color: 'text-[#10B981]' },
    { label: 'COMPANIES OWNED', value: '12 CENTERS', icon: MapPin, color: 'text-[#F59E0B]' },
    { label: 'STEAM PROFILE', value: 'VERIFIED', icon: ShieldCheck, color: 'text-[#10B981]' },
  ];

  const badges = [
    { title: 'Scania Enthusiast', desc: 'Driven 100,000 km in a Scania cabin', icon: Award, rarity: 'EPIC' },
    { title: 'Map Cartographer', desc: 'Explored 100% of Project Balkans', icon: MapPin, rarity: 'RARE' },
    { title: 'Night Owl Hauler', desc: 'Completed 50 deliveries at midnight', icon: Clock, rarity: 'COMMON' },
    { title: 'Zero Damage Club', desc: 'Deliver 10 consecutive shipments without damage', icon: ShieldCheck, rarity: 'LEGENDARY' },
  ];

  return (
    <div id="profile-view" className="space-y-6 animate-fade-in">
      
      {/* 1. Header Profile Banner Card */}
      <div 
        className="relative h-48 rounded-2xl overflow-hidden border border-[#232F4C] bg-cover bg-center shadow-lg"
        style={{ 
          backgroundImage: `linear-gradient(to right, #0B0F19 40%, rgba(11, 15, 25, 0.4) 80%), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80')` 
        }}
      >
        <div className="absolute inset-y-0 left-0 flex items-center p-6 md:p-8 space-x-5 z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#12CFCE] to-[#10B981] p-0.5 shadow-[0_0_16px_rgba(18,207,206,0.25)] shrink-0">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <User className="w-10 h-10 text-[#12CFCE]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-sans font-black text-[#FFFFFF] tracking-tight">adspm2323</h2>
              <span className="text-[10px] font-mono text-[#0B0F19] bg-[#12CFCE] px-2 py-0.5 rounded-full font-black uppercase shadow">
                Pro Trucker
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">adspm2323@gmail.com</p>
            <p className="text-[11px] text-[#12CFCE] font-mono mt-1">MEMBER SINCE AUGUST 2024</p>
          </div>
        </div>
      </div>

      {/* 2. Grid split profile segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stats & Achievements (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main stats block cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} className="bg-[#151D30]/60 border border-[#232F4C] p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider">{st.label}</span>
                    <Icon className={`w-4 h-4 ${st.color}`} />
                  </div>
                  <p className="text-sm font-sans font-black text-[#FFFFFF] tracking-tight">{st.value}</p>
                </div>
              );
            })}
          </div>

          {/* Gamified Achievements progressions list */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#232F4C] pb-2 mb-1">
              <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                Driver Badges & Achievements
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                {MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length} / {MOCK_ACHIEVEMENTS.length} UNLOCKED
              </span>
            </div>

            <div className="space-y-3.5">
              {MOCK_ACHIEVEMENTS.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-4 bg-[#151D30]/80 border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    ach.unlocked 
                      ? 'border-[#232F4C]/80 bg-[#151D30]/80 shadow-[0_2px_12px_rgba(16,185,129,0.03)]' 
                      : 'border-[#232F4C] opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      ach.unlocked ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#1B2945] text-[#94A3B8]'
                    }`}>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#FFFFFF]">{ach.title}</h4>
                      <p className="text-[11px] text-[#94A3B8] leading-normal mt-0.5">{ach.description}</p>
                      
                      {/* Optional progress indicator */}
                      {!ach.unlocked && ach.maxProgress && ach.currentProgress !== undefined && (
                        <div className="mt-2.5 max-w-md">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] mb-1">
                            <span>Progress</span>
                            <span>{ach.currentProgress.toLocaleString()} / {ach.maxProgress.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#0B0F19] rounded-full overflow-hidden border border-[#232F4C]">
                            <div 
                              className="h-full bg-[#12CFCE] rounded-full" 
                              style={{ width: `${(ach.currentProgress / ach.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded ${
                    ach.unlocked 
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                      : 'bg-[#151D30] text-[#94A3B8] border border-[#232F4C]'
                  }`}>
                    {ach.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Driver Badges and items (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <Award className="w-4 h-4 text-[#12CFCE]" />
              Driver Ribbons
            </span>

            <div className="space-y-3.5">
              {badges.map((badge, idx) => (
                <div key={idx} className="p-3 bg-[#151D30] border border-[#232F4C] rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-[#1B2945] rounded-lg text-[#12CFCE] shrink-0">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#FFFFFF]">{badge.title}</h4>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        badge.rarity === 'LEGENDARY' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                        badge.rarity === 'EPIC' ? 'bg-[#12CFCE]/15 text-[#12CFCE] border border-[#12CFCE]/30' :
                        badge.rarity === 'RARE' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        'bg-gray-500/15 text-gray-400'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] leading-normal">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
