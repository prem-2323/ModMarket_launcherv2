import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Library, 
  Download, 
  CreditCard, 
  User, 
  Settings, 
  Play, 
  CheckCircle,
  Truck,
  Heart,
  Shield
} from 'lucide-react';
import { Page, DownloadItem } from '../types';

interface SidebarProps {
  currentTab: Page;
  setCurrentTab: (tab: Page) => void;
  downloads: DownloadItem[];
  onLaunchGame: () => void;
  isGameRunning: boolean;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  downloads,
  onLaunchGame,
  isGameRunning
}: SidebarProps) {
  const activeDownloadsCount = downloads.filter(d => d.status === 'downloading').length;

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store' as Page, label: 'Store', icon: ShoppingBag },
    { id: 'library' as Page, label: 'Library', icon: Library },
    { 
      id: 'downloads' as Page, 
      label: 'Downloads', 
      icon: Download,
      badge: activeDownloadsCount > 0 ? `${activeDownloadsCount}` : undefined
    },
    { id: 'payments' as Page, label: 'Payments', icon: CreditCard },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'favorites' as Page, label: 'Wishlist', icon: Heart },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
    { id: 'admin' as Page, label: 'Admin', icon: Shield },
  ];

  return (
    <div 
      id="sidebar-container"
      className="w-64 bg-[#0B0F19] border-r border-[#232F4C] flex flex-col justify-between select-none relative"
    >
      {/* Sidebar Navigation */}
      <div className="flex flex-col pt-6 px-3 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
        <span className="px-3 text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase mb-2">Navigation</span>
        
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                isActive 
                  ? 'bg-[#151D30] text-[#FFFFFF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945]/30'
              }`}
            >
              {/* Cyan glowing left indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-[#12CFCE] shadow-[0_0_12px_#12CFCE,0_0_4px_#12CFCE]" />
              )}

              <div className="flex items-center space-x-3">
                <IconComponent 
                  className={`w-4.5 h-4.5 transition-all duration-300 ${
                    isActive 
                      ? 'text-[#12CFCE] drop-shadow-[0_0_4px_rgba(18,207,206,0.5)]' 
                      : 'text-[#94A3B8] group-hover:text-[#12CFCE]'
                  }`} 
                />
                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              </div>

              {/* Status Indicator/Badge */}
              {item.badge && (
                <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-[#12CFCE]/10 border border-[#12CFCE]/30 text-[#12CFCE] text-[10px] font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Launcher Profile Quick Status & Launch ETS2 Button */}
      <div className="p-4 border-t border-[#232F4C] bg-[#151D30]/30 space-y-3">
        {/* Connection health */}
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] px-1">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            MME SECURE
          </span>
          <span className="text-[#10B981] font-bold">READY</span>
        </div>

        {/* Large launch button */}
        <button
          onClick={onLaunchGame}
          disabled={isGameRunning}
          className={`w-full group relative overflow-hidden py-3 px-4 rounded-xl font-extrabold text-sm tracking-wider uppercase transition-all duration-500 cursor-pointer ${
            isGameRunning
              ? 'bg-gradient-to-r from-[#1B2945] to-[#232F4C] border border-[#232F4C] text-[#94A3B8] cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#12CFCE] to-[#10B981] text-[#0B0F19] hover:text-[#FFFFFF] shadow-[0_0_20px_rgba(18,207,206,0.3)] hover:shadow-[0_0_30px_rgba(18,207,206,0.6)] transform hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {/* Neon scan-line highlight overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF]/25 to-transparent -translate-x-full group-hover:animate-shimmer" />

          <div className="flex items-center justify-center space-x-2">
            {isGameRunning ? (
              <>
                <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-t-transparent border-[#94A3B8] animate-spin"></span>
                <span>RUNNING...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-sans font-black">LAUNCH ETS2</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
