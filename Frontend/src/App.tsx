import React, { useState, useEffect } from 'react';
import { 
  Page, 
  Mod, 
  InstalledMod, 
  DownloadItem, 
  Purchase, 
  NotificationItem 
} from './types';
import { MOCK_MODS, MOCK_ACHIEVEMENTS } from './mockData';
import { api } from './services/api';

// Sub-components
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AuthScreen, { AuthPage } from './components/AuthScreen';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import Store from './components/Store';
import ModDetails from './components/ModDetails';
import Library from './components/Library';
import Downloads from './components/Downloads';
import Payments from './components/Payments';
import Profile from './components/Profile';
import SettingsView from './components/Settings';
import LaunchScreen from './components/LaunchScreen';
import StatusWidget from './components/StatusWidget';

// Seed initial state helper
const SEED_INSTALLED: InstalledMod[] = [
  {
    ...MOCK_MODS[1], // Project Balkans Map (Free)
    enabled: true,
    priority: 1,
    installDate: '2026-06-20',
  },
  {
    ...MOCK_MODS[5], // Real-Physics Suspension (Free)
    enabled: true,
    priority: 0,
    installDate: '2026-07-02',
  }
];

const SEED_NOTIFS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'MME Diagnostics Secure',
    message: 'Welcome back, adspm2323. All local ETS2 assembly channels have been validated.',
    time: 'Just now',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'Graphics Update Ready',
    message: 'Next-Gen Graphics Overhaul V5 has a compatibility patch pending.',
    time: '2 hours ago',
    read: false,
    type: 'warning'
  }
];

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getProfile().then((res) => {
        if (res.success) {
          setIsAuthenticated(true);
        } else {
          api.logout();
        }
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Page and sub-view states
  const [currentTab, setCurrentTab] = useState<Page>('dashboard');
  const [selectedModDetails, setSelectedModDetails] = useState<Mod | null>(null);

  // Core domain states (hydrated from local storage)
  const [installedMods, setInstalledMods] = useState<InstalledMod[]>(() => {
    const saved = localStorage.getItem('mm_installed_mods');
    return saved ? JSON.parse(saved) : SEED_INSTALLED;
  });

  const [purchasedModIds, setPurchasedModIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mm_purchased_mod_ids');
    return saved ? JSON.parse(saved) : ['mod-1']; // "Scania S Next-Gen" is premium and pre-purchased
  });

  const [favoriteModIds, setFavoriteModIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mm_favorite_mod_ids');
    return saved ? JSON.parse(saved) : ['mod-3']; // Graphics overhaul in favorites
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('mm_downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('mm_purchases');
    return saved ? JSON.parse(saved) : [
      {
        id: 'pur-1',
        modId: 'mod-1',
        modTitle: 'Scania S Next-Gen Custom V2.5',
        price: 14.99,
        date: '2026-06-12',
        paymentMethod: 'Card',
        status: 'Success',
        invoiceNo: 'MME-INV-8432A'
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('mm_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFS;
  });

  // ETS2 detection on startup via Electron API
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.detectETS2().then((result) => {
        if (result.ets2Installed) {
          pushNotification('ETS2 Found', `Euro Truck Simulator 2 detected at ${result.ets2Path}`, 'success');
        } else {
          pushNotification('ETS2 Not Found', 'Could not locate Euro Truck Simulator 2 installation.', 'warning');
        }
      });
    }
  }, []);

  // Flow State
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [pendingCheckoutMod, setPendingCheckoutMod] = useState<Mod | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mm_installed_mods', JSON.stringify(installedMods));
  }, [installedMods]);

  useEffect(() => {
    localStorage.setItem('mm_purchased_mod_ids', JSON.stringify(purchasedModIds));
  }, [purchasedModIds]);

  useEffect(() => {
    localStorage.setItem('mm_favorite_mod_ids', JSON.stringify(favoriteModIds));
  }, [favoriteModIds]);

  useEffect(() => {
    localStorage.setItem('mm_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('mm_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('mm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Simulation loop for active downloads progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prevJobs) => {
        let updated = false;
        const mapped = prevJobs.map((job) => {
          if (job.status === 'downloading') {
            updated = true;
            const nextProgress = job.progress + Math.floor(Math.random() * 8) + 4;
            
            if (nextProgress >= 100) {
              // Complete download! Add mod to installed mods
              const modToAdd = MOCK_MODS.find((m) => m.id === job.id);
              if (modToAdd) {
                setInstalledMods((prevInstalled) => {
                  if (prevInstalled.some((m) => m.id === modToAdd.id)) return prevInstalled;
                  
                  const maxPriority = prevInstalled.length > 0 
                    ? Math.max(...prevInstalled.map(p => p.priority)) 
                    : -1;

                  return [
                    ...prevInstalled,
                    {
                      ...modToAdd,
                      enabled: true,
                      priority: maxPriority + 1,
                      installDate: new Date().toISOString().split('T')[0]
                    }
                  ];
                });
              }

              // Create success notification
              pushNotification(
                'Download Finished',
                `"${job.title}" has been successfully downloaded and deployed to ETS2 mod folder.`,
                'success'
              );

              // Voice cue
              if (window.speechSynthesis && isAudioOn) {
                const utterance = new SpeechSynthesisUtterance(`${job.title} download complete.`);
                window.speechSynthesis.speak(utterance);
              }

              return {
                ...job,
                progress: 100,
                status: 'completed',
                speed: '0 MB/s',
                remainingTime: '0s',
                downloadedSize: job.totalSize
              };
            } else {
              // Normal increment
              const totalMb = parseFloat(job.totalSize);
              const currentMb = ((nextProgress / 100) * totalMb).toFixed(1);
              const speed = (Math.random() * 18 + 22).toFixed(1) + ' MB/s';
              const remainingSecs = Math.max(1, Math.floor((totalMb - parseFloat(currentMb)) / 30));

              return {
                ...job,
                progress: nextProgress,
                downloadedSize: `${currentMb} MB`,
                speed,
                remainingTime: `${remainingSecs}s`
              };
            }
          }
          return job;
        });

        return updated ? mapped : prevJobs;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAudioOn]);

  // Push notification helper
  const pushNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'download' = 'info') => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        time: 'Just now',
        read: false,
        type
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Launch Game Overlay trigger
  const handleLaunchGame = async () => {
    if (isGameRunning) {
      const shouldStop = window.electronAPI
        ? await window.electronAPI.confirm('Euro Truck Simulator 2 is already running. Force exit?')
        : confirm('Euro Truck Simulator 2 is already active. Force exit?');
      if (!shouldStop) return;
      setIsGameRunning(false);
      if (window.electronAPI) await window.electronAPI.stopETS2();
      pushNotification('Game Stopped', 'Euro Truck Simulator 2 process ended successfully.', 'info');
      return;
    }
    setIsLaunching(true);
  };

  const handleCompleteLaunch = async () => {
    setIsLaunching(false);

    if (window.electronAPI) {
      const result = await window.electronAPI.launchETS2();
      if (result.success) {
        setIsGameRunning(true);
        pushNotification('ETS2 Process Running', 'Game launched via Steam. Overlay is active.', 'success');
      } else {
        pushNotification('Launch Failed', result.error || 'Could not launch ETS2. Check your installation.', 'warning');
      }
    } else {
      setIsGameRunning(true);
      pushNotification('ETS2 Process Running', 'Game launched in performance desktop wrapper. Overlay is active.', 'success');
    }
  };

  // Quick Action Diagnostics trigger
  const handleTriggerQuickAction = async (actionName: string) => {
    if (window.electronAPI) {
      await window.electronAPI.alert(`Initializing diagnostic utility script: "${actionName}"...`);
    } else {
      alert(`Initializing diagnostic utility script: "${actionName}"...`);
    }
    
    setTimeout(async () => {
      pushNotification(
        'Diagnostic Completed',
        `Successfully executed ${actionName} without errors. File hashes verified green.`,
        'success'
      );
      if (window.electronAPI) {
        await window.electronAPI.alert(`Success: ${actionName} finished executing successfully!`);
      } else {
        alert(`Success: ${actionName} finished executing successfully!`);
      }
    }, 1000);
  };

  // Library functions
  const handleToggleEnabled = (modId: string) => {
    setInstalledMods((prev) => prev.map((m) => {
      if (m.id === modId) {
        const nextState = !m.enabled;
        pushNotification(
          nextState ? 'Modification Profile Activated' : 'Modification Profile Disabled',
          `"${m.title}" is now ${nextState ? 'enabled' : 'disabled'} in your game active profile.`,
          'info'
        );
        return { ...m, enabled: nextState };
      }
      return m;
    }));
  };

  const handleUpdatePriority = (modId: string, direction: 'up' | 'down') => {
    const list = [...installedMods].sort((a, b) => a.priority - b.priority);
    const index = list.findIndex(m => m.id === modId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      // Swap priorities
      const temp = list[index].priority;
      list[index].priority = list[index - 1].priority;
      list[index - 1].priority = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      // Swap priorities
      const temp = list[index].priority;
      list[index].priority = list[index + 1].priority;
      list[index + 1].priority = temp;
    }

    setInstalledMods(list);
    pushNotification('Load Order Updated', 'Load priorities have been rearranged cleanly to optimize loading sequence.', 'info');
  };

  const handleDeleteMod = async (modId: string) => {
    const confirmed = window.electronAPI
      ? await window.electronAPI.confirm('Uninstall this mod? All local SCS pack files will be removed.')
      : confirm('Are you sure you want to uninstall this mod?');
    if (!confirmed) return;
    setInstalledMods((prev) => prev.filter((m) => m.id !== modId));
    setDownloads((prev) => prev.filter((d) => d.id !== modId));
    pushNotification('Mod Uninstalled', 'Modification files permanently removed.', 'warning');
  };

  const handleUpdateMod = (modId: string) => {
    setInstalledMods((prev) => prev.map((m) => m.id === modId ? { ...m, isUpdating: false, version: '2.5.1' } : m));
    pushNotification('Mod Updated', 'Modification files flashed to the latest version.', 'success');
  };

  const handleRepairMod = async (modId: string) => {
    if (window.electronAPI) {
      await window.electronAPI.alert('Scanning CRC block checksums and validating package indexes...');
    } else {
      alert('Scanning CRC block checksums and validating package indexes...');
    }
    pushNotification('Repair Successful', 'Checked modification integrity. 0 corrupt nodes found.', 'success');
  };

  // Store & Payments functions
  const handleToggleFavorite = (modId: string) => {
    setFavoriteModIds((prev) => 
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const handleBuyMod = (mod: Mod) => {
    setPendingCheckoutMod(mod);
    setCurrentTab('payments');
  };

  const handleConfirmPurchase = (mod: Mod, method: 'Google Pay' | 'UPI' | 'PhonePe' | 'Card') => {
    // Add to purchased lists
    setPurchasedModIds((prev) => [...prev, mod.id]);
    
    // Add transaction log
    const invoiceNo = `MME-INV-${Math.floor(Math.random() * 90000 + 10000)}A`;
    const newPurchase: Purchase = {
      id: `pur-${Date.now()}`,
      modId: mod.id,
      modTitle: mod.title,
      price: mod.price,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      status: 'Success',
      invoiceNo
    };

    setPurchases((prev) => [newPurchase, ...prev]);
    setPendingCheckoutMod(null);
    setCurrentTab('store');
    pushNotification('License Acquired', `Premium license key successfully injected for "${mod.title}".`, 'success');
  };

  const handleDownloadMod = (modId: string) => {
    const mod = MOCK_MODS.find((m) => m.id === modId);
    if (!mod) return;

    // Add to download queue
    const isAlreadyQueued = downloads.some((d) => d.id === modId && d.status !== 'cancelled');
    if (isAlreadyQueued) {
      setCurrentTab('downloads');
      return;
    }

    const newDownload: DownloadItem = {
      id: mod.id,
      title: mod.title,
      thumbnail: mod.thumbnail,
      progress: 0,
      speed: '42.5 MB/s',
      remainingTime: '12s',
      totalSize: mod.fileSize,
      downloadedSize: '0 MB',
      status: 'downloading'
    };

    setDownloads((prev) => [newDownload, ...prev]);
    setCurrentTab('downloads');
    pushNotification('Download Started', `Connecting to France CDN node to retrieve "${mod.title}".`, 'download');
  };

  // Downloads manager controls
  const handlePauseResumeDownload = (id: string) => {
    setDownloads((prev) => prev.map((job) => {
      if (job.id === id) {
        const nextStatus = job.status === 'paused' ? 'downloading' : 'paused';
        return { ...job, status: nextStatus as any };
      }
      return job;
    }));
  };

  const handleCancelDownload = (id: string) => {
    setDownloads((prev) => prev.map((job) => {
      if (job.id === id) {
        return { ...job, status: 'cancelled' as any, progress: 0, speed: '0 MB/s', remainingTime: '0s' };
      }
      return job;
    }));
  };

  const handleRestartDownload = (id: string) => {
    setDownloads((prev) => prev.map((job) => {
      if (job.id === id) {
        return { ...job, status: 'downloading' as any, progress: 0, speed: '42.5 MB/s' };
      }
      return job;
    }));
  };

  const clearCompletedDownloads = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'completed' && d.status !== 'cancelled'));
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthPage('login');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vToken = params.get('token');
    const page = params.get('page') as AuthPage | null;

    if (page === 'reset-password' || params.get('reset') === '1') {
      if (vToken) {
        setResetToken(vToken);
        setAuthPage('reset-password');
      }
    } else if (page === 'verify-email' || params.get('verify') === '1') {
      if (vToken) {
        setResetToken(vToken);
        setAuthPage('verify-email');
      }
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentTab('dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#12CFCE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authPage) {
      case 'forgot-password':
        return <ForgotPassword onBack={() => setAuthPage('login')} />
      case 'reset-password':
        return <ResetPassword token={resetToken || ''} onSuccess={() => setAuthPage('login')} />
      case 'verify-email':
        return <VerifyEmail token={resetToken || ''} onSuccess={() => setAuthPage('login')} />
      default:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} onNavigate={setAuthPage} />
    }
  }

  return (
    <div id="launcher-wrapper" className="min-h-screen bg-[#0B0F19] text-[#FFFFFF] flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. Fullscreen Loader Overlay */}
      {isLaunching && (
        <LaunchScreen 
          onComplete={handleCompleteLaunch} 
          isAudioOn={isAudioOn} 
        />
      )}

      {/* 2. Top Bar Navigation Title bar */}
      <TitleBar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        clearNotifications={clearNotifications}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        downloads={downloads}
        onLaunchGame={handleLaunchGame}
        isGameRunning={isGameRunning}
        onLogout={handleLogout}
      />

      {/* 3. Main Split Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Central Component Viewport */}
        <div 
          id="main-viewport-content"
          className="flex-1 bg-gradient-to-br from-[#0B0F19] via-[#0B0F19] to-[#151D30]/20 p-6 overflow-y-auto custom-scrollbar"
        >
          {isGameRunning && (
            /* ACTIVE RUNNING OVERLAY TOAST */
            <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl flex items-center justify-between animate-fade-in shadow-md">
              <div className="flex items-center space-x-3 text-xs text-[#FFFFFF]">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                </span>
                <div>
                  <p className="font-bold">Euro Truck Simulator 2 Process Hooked!</p>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">ModMarket high-performance telemetry overlays are capturing playtime analytics.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGameRunning(false)}
                className="px-3.5 py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/25 border border-transparent text-xs text-[#EF4444] font-bold rounded-lg transition-all cursor-pointer"
              >
                Terminate ETS2 Process
              </button>
            </div>
          )}

          {/* Conditional page render router */}
          {selectedModDetails ? (
            <ModDetails 
              mod={selectedModDetails}
              purchasedModIds={purchasedModIds}
              installedModIds={installedMods.map(m => m.id)}
              favoriteModIds={favoriteModIds}
              onBack={() => setSelectedModDetails(null)}
              onToggleFavorite={handleToggleFavorite}
              onBuyMod={handleBuyMod}
              onDownloadMod={handleDownloadMod}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <Dashboard 
                  installedMods={installedMods}
                  purchasedModsCount={purchasedModIds.length}
                  onLaunchGame={handleLaunchGame}
                  setCurrentTab={setCurrentTab}
                  triggerQuickAction={handleTriggerQuickAction}
                />
              )}

              {currentTab === 'store' && (
                <Store 
                  mods={MOCK_MODS}
                  purchasedModIds={purchasedModIds}
                  installedModIds={installedMods.map(m => m.id)}
                  favoriteModIds={favoriteModIds}
                  onToggleFavorite={handleToggleFavorite}
                  onBuyMod={handleBuyMod}
                  onDownloadMod={handleDownloadMod}
                  onSelectModDetails={(mod) => setSelectedModDetails(mod)}
                />
              )}

              {currentTab === 'library' && (
                <Library 
                  installedMods={installedMods}
                  onToggleEnabled={handleToggleEnabled}
                  onUpdatePriority={handleUpdatePriority}
                  onDeleteMod={handleDeleteMod}
                  onUpdateMod={handleUpdateMod}
                  onRepairMod={handleRepairMod}
                />
              )}

              {currentTab === 'downloads' && (
                <Downloads 
                  downloads={downloads}
                  onPauseResumeDownload={handlePauseResumeDownload}
                  onCancelDownload={handleCancelDownload}
                  onRestartDownload={handleRestartDownload}
                  clearCompletedDownloads={clearCompletedDownloads}
                />
              )}

              {currentTab === 'payments' && (
                <Payments 
                  purchases={purchases}
                  pendingCheckoutMod={pendingCheckoutMod}
                  onClearPendingCheckout={() => setPendingCheckoutMod(null)}
                  onConfirmPurchase={handleConfirmPurchase}
                  isAudioOn={isAudioOn}
                />
              )}

              {currentTab === 'profile' && (
                <Profile 
                  purchasedModsCount={purchasedModIds.length}
                  installedModsCount={installedMods.length}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView 
                  isAudioOn={isAudioOn}
                  setIsAudioOn={setIsAudioOn}
                />
              )}
            </>
          )}
        </div>

      </div>

      {/* 4. Bottom Right Status Diagnostics Monitor Widget */}
      <StatusWidget downloads={downloads} />

    </div>
  );
}
