import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Settings, 
  Minus, 
  Square, 
  X, 
  User, 
  CircleDot, 
  LayoutDashboard,
  ShoppingBag,
  Library,
  Download,
  CreditCard,
  Truck,
  Gamepad2,
  LogIn,
  LogOut
} from 'lucide-react';
import { NotificationItem, Page, DownloadItem } from '../types';

interface TitleBarProps {
  currentTab: Page;
  setCurrentTab: (tab: Page) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  isAudioOn: boolean;
  setIsAudioOn: (on: boolean) => void;
  downloads: DownloadItem[];
  onLaunchGame: () => void;
  isGameRunning: boolean;
  onLogout: () => void;
}

export default function TitleBar({
  currentTab,
  setCurrentTab,
  notifications,
  markNotificationAsRead,
  clearNotifications,
  isAudioOn,
  setIsAudioOn,
  downloads,
  onLaunchGame,
  isGameRunning,
  onLogout,
}: TitleBarProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleControlClick = (action: string) => {
    const speech = window.speechSynthesis;
    if (speech && isAudioOn) {
      const utterance = new SpeechSynthesisUtterance(`${action} action triggered on ModMarket Launcher`);
      utterance.rate = 1.1;
      speech.speak(utterance);
    }
    if (action === 'Close') {
      if (window.electronAPI) {
        window.electronAPI.confirm('Are you sure you want to exit ModMarket Launcher v2? This will suspend all background mod downloads.').then((confirmed) => {
          if (confirmed) window.electronAPI.closeWindow();
        });
      } else {
        if (confirm('Are you sure you want to exit ModMarket Launcher v2?')) window.close();
      }
    } else if (action === 'Minimize') {
      window.electronAPI ? window.electronAPI.minimizeWindow() : alert('Minimize');
    } else if (action === 'Maximize') {
      window.electronAPI ? window.electronAPI.maximizeWindow() : alert('Maximize');
    }
  };

  const handleTabClick = (tabId: Page, label: string) => {
    setCurrentTab(tabId);
    if (window.speechSynthesis && isAudioOn) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Navigating to ${label}`);
        utterance.rate = 1.3;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis failed', e);
      }
    }
  };

  return (
    <div 
      id="titlebar-container"
      className="h-14 bg-[#0B0F19]/90 border-b border-[#232F4C] px-3 sm:px-4 flex items-center justify-between select-none relative z-50 backdrop-blur-md"
    >
      {/* Left: Logo and Status Indicator */}
      <div className="flex items-center space-x-2.5 shrink-0 cursor-pointer" onClick={() => handleTabClick('dashboard', 'Dashboard')}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0B0F19] border border-[#12CFCE]/20 shadow-[0_0_10px_rgba(18,207,206,0.15)]">
          <Gamepad2 className="w-5 h-5 text-[#12CFCE]" />
        </div>
        <span className="font-sans font-black text-[#FFFFFF] tracking-tight text-lg flex items-center">
          Mod<span className="text-[#12CFCE]">Market</span>
        </span>
      </div>

      {/* Middle: Beautiful, Responsive & Flexible Navigation Bar matching the screenshot */}
      <div className="flex items-center space-x-1 sm:space-x-2 mx-2 sm:mx-4 md:mx-6 overflow-x-auto no-scrollbar py-1 shrink-1 max-w-[280px] xs:max-w-[340px] sm:max-w-md md:max-w-xl lg:max-w-2xl px-1 scroll-smooth">
        {[
          { id: 'dashboard' as Page, label: 'Home', icon: Gamepad2 },
          { id: 'store' as Page, label: 'Store', icon: ShoppingBag },
          { id: 'library' as Page, label: 'Library', icon: Library },
          { 
            id: 'downloads' as Page, 
            label: 'Downloads', 
            icon: Download,
            badge: downloads.filter(d => d.status === 'downloading').length || undefined
          },
          { id: 'payments' as Page, label: 'Payments', icon: CreditCard },
          { id: 'settings' as Page, label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id, item.label)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer relative shrink-0 group ${
                isActive 
                  ? 'bg-[#152238] text-[#12CFCE] border border-[#12CFCE]/80 shadow-[0_0_12px_rgba(18,207,206,0.2)]' 
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] border border-transparent hover:bg-[#1B2945]/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#12CFCE]' : 'text-[#94A3B8] group-hover:text-[#FFFFFF]'}`} />
              <span className="hidden sm:inline">{item.label}</span>
              
              {/* Dynamic Badge */}
              {item.badge && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#12CFCE] text-[#0B0F19] text-[9px] font-black font-mono shadow-[0_0_8px_rgba(18,207,206,0.4)] ml-1">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right: User profile, Notifications, Settings, Controls */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Sleek Launch Button styled exactly like 'Sign In' in the screenshot */}
        <button
          onClick={onLaunchGame}
          disabled={isGameRunning}
          className={`group flex items-center space-x-2 py-2 px-5 rounded-lg font-extrabold text-xs tracking-wide transition-all duration-300 cursor-pointer ${
            isGameRunning
              ? 'bg-[#151D30] border border-[#232F4C] text-[#94A3B8] cursor-not-allowed'
              : 'bg-[#12CFCE] text-[#0B0F19] hover:bg-[#12CFCE]/90 hover:shadow-[0_0_15px_rgba(18,207,206,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
          }`}
        >
          {isGameRunning ? (
            <>
              <span className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent border-[#94A3B8] animate-spin"></span>
              <span>RUNNING</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span>LAUNCH</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className={`p-2 rounded-lg border transition-all duration-200 relative ${
              showNotifDropdown 
                ? 'border-[#12CFCE] bg-[#12CFCE]/10 text-[#FFFFFF]' 
                : 'border-[#232F4C] bg-[#151D30] text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#12CFCE]/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-[#FFFFFF] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#151D30]/95 border border-[#232F4C] rounded-xl shadow-2xl backdrop-blur-xl p-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between border-b border-[#232F4C] pb-2 mb-2">
                <span className="text-xs font-bold text-[#FFFFFF] font-sans">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] text-[#12CFCE] hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                  <button 
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-[10px] text-[#94A3B8] hover:text-[#FFFFFF]"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#94A3B8]">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        notif.read 
                          ? 'bg-[#151D30]/30 border-transparent text-[#94A3B8]' 
                          : 'bg-[#1B2945]/50 border-[#12CFCE]/20 text-[#FFFFFF] hover:border-[#12CFCE]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold truncate pr-2">{notif.title}</span>
                        <span className="text-[9px] text-[#94A3B8] shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed mt-0.5 text-[#94A3B8]">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div 
          onClick={() => setCurrentTab('profile')}
          className="flex items-center space-x-2 bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE]/40 py-1 px-2.5 rounded-lg cursor-pointer transition-all duration-200"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#12CFCE] to-[#10B981] flex items-center justify-center shadow-inner">
            <User className="w-3.5 h-3.5 text-[#FFFFFF]" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#FFFFFF]">Driver</span>
            <span className="text-[9px] text-[#94A3B8]">Pro Driver</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="p-2 rounded-lg border border-[#232F4C] bg-[#151D30] text-[#94A3B8] hover:text-[#EF4444] hover:border-red-500/50 transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Quick Settings Icon */}
        <button
          onClick={() => setCurrentTab('settings')}
          className={`p-2 rounded-lg border transition-all duration-200 ${
            currentTab === 'settings' 
              ? 'border-[#12CFCE] bg-[#12CFCE]/10 text-[#FFFFFF]' 
              : 'border-[#232F4C] bg-[#151D30] text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#12CFCE]/50'
          }`}
          title="Launcher Settings"
        >
          <Settings className="w-4 h-4 animate-hover-spin" />
        </button>

        {/* Desktop Native Window Controls */}
        <div className="flex items-center border-l border-[#232F4C] pl-2 space-x-1">
          <button 
            onClick={() => handleControlClick('Minimize')}
            className="p-1 text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945] rounded transition-all duration-150"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleControlClick('Maximize')}
            className="p-1 text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945] rounded transition-all duration-150"
            title="Maximize"
          >
            <Square className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleControlClick('Close')}
            className="p-1 text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-red-500/80 rounded transition-all duration-150"
            title="Close Launcher"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
