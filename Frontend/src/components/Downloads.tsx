import React from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  X, 
  CheckCircle, 
  History, 
  RefreshCcw, 
  Info,
  Layers3
} from 'lucide-react';
import { DownloadItem } from '../types';

interface DownloadsProps {
  downloads: DownloadItem[];
  onPauseResumeDownload: (id: string) => void;
  onCancelDownload: (id: string) => void;
  onRestartDownload: (id: string) => void;
  clearCompletedDownloads: () => void;
}

export default function Downloads({
  downloads,
  onPauseResumeDownload,
  onCancelDownload,
  onRestartDownload,
  clearCompletedDownloads
}: DownloadsProps) {
  const activeDownloads = downloads.filter(d => d.status === 'downloading' || d.status === 'paused' || d.status === 'queued');
  const finishedDownloads = downloads.filter(d => d.status === 'completed' || d.status === 'cancelled');

  return (
    <div id="downloads-view" className="space-y-6 animate-fade-in">
      
      {/* 1. Stats and global controls row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-5 rounded-2xl border border-[#232F4C] backdrop-blur-md">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#12CFCE] uppercase font-bold">Network Manager</span>
          <h2 className="text-lg font-sans font-black text-[#FFFFFF] tracking-tight">Active Transmit Queue & Mod Updates</h2>
          <p className="text-xs text-[#94A3B8] max-w-xl">
            ModMarket allocates dynamic CDN routing channels to maximize Euro truck assembly file retrieval speed.
          </p>
        </div>

        {finishedDownloads.length > 0 && (
          <button
            onClick={clearCompletedDownloads}
            className="px-4 py-2 bg-[#1B2945] hover:bg-[#232F4C] border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Clear Complete Logs
          </button>
        )}
      </div>

      {/* 2. Main content block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Transmits Queue (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block px-1">
            Active Download Jobs ({activeDownloads.length})
          </span>

          {activeDownloads.length === 0 ? (
            <div className="text-center py-16 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <span className="text-3xl block">📡</span>
              <p className="text-sm font-bold text-[#FFFFFF] mt-2">All download streams are silent</p>
              <p className="text-xs text-[#94A3B8] mt-1">Acquire and trigger downloads from the custom Storefront</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeDownloads.map((job) => (
                <div 
                  key={job.id}
                  className="bg-[#151D30]/60 border border-[#232F4C] p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
                >
                  {/* Subtle pulsing glow for active download */}
                  {job.status === 'downloading' && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#12CFCE] shadow-[0_0_8px_#12CFCE]" />
                  )}

                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-cover bg-center rounded-lg border border-[#232F4C] shrink-0" style={{ backgroundImage: `url('${job.thumbnail}')` }} referrerPolicy="no-referrer" />
                    
                    {/* Text stats */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-[#FFFFFF] truncate pr-2">{job.title}</h4>
                        <span className="text-xs font-mono font-bold text-[#12CFCE]">{job.progress.toFixed(0)}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[#0B0F19] rounded-full overflow-hidden border border-[#232F4C] mb-2">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            job.status === 'paused' ? 'bg-[#94A3B8]' : 'bg-[#12CFCE]'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#94A3B8] font-mono">
                        <span>Status: <strong className={job.status === 'downloading' ? 'text-[#12CFCE]' : 'text-amber-500'}>{job.status.toUpperCase()}</strong></span>
                        {job.status === 'downloading' && (
                          <>
                            <span>Speed: <strong className="text-[#FFFFFF]">{job.speed}</strong></span>
                            <span>Remaining: <strong className="text-[#FFFFFF]">{job.remainingTime}</strong></span>
                          </>
                        )}
                        <span>Size: <strong className="text-[#FFFFFF]">{job.downloadedSize} / {job.totalSize}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Pause/Resume/Cancel) */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onPauseResumeDownload(job.id)}
                      className={`p-2 border rounded-lg transition-all cursor-pointer ${
                        job.status === 'paused'
                          ? 'bg-[#12CFCE]/10 border-[#12CFCE]/40 text-[#12CFCE] hover:bg-[#12CFCE]/20'
                          : 'bg-[#151D30] border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF] hover:border-[#12CFCE]'
                      }`}
                      title={job.status === 'paused' ? 'Resume download' : 'Pause download'}
                    >
                      {job.status === 'paused' ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={() => onCancelDownload(job.id)}
                      className="p-2 bg-[#151D30] hover:bg-[#EF4444]/10 border border-[#232F4C] hover:border-[#EF4444]/50 text-[#94A3B8] hover:text-[#EF4444] rounded-lg transition-all cursor-pointer"
                      title="Cancel download stream"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Finished Downloads Block */}
          <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block pt-4 px-1">
            Historical Completed & Cancelled Downloads ({finishedDownloads.length})
          </span>

          {finishedDownloads.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#94A3B8] border border-dashed border-[#232F4C] rounded-2xl">
              No complete stream log records
            </div>
          ) : (
            <div className="space-y-2">
              {finishedDownloads.map((job) => (
                <div 
                  key={job.id}
                  className="bg-[#151D30]/30 border border-[#232F4C] p-3.5 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {job.status === 'completed' ? (
                      <CheckCircle className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
                    ) : (
                      <X className="w-4.5 h-4.5 text-[#EF4444] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#FFFFFF] truncate pr-2">{job.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#94A3B8] mt-0.5">
                        <span>Size: <strong className="text-[#FFFFFF]">{job.totalSize}</strong></span>
                        <span>Stream state: <strong className={job.status === 'completed' ? 'text-[#10B981]' : 'text-red-400'}>{job.status.toUpperCase()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {job.status === 'cancelled' && (
                    <button
                      onClick={() => onRestartDownload(job.id)}
                      className="p-1.5 bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-[#94A3B8] hover:text-[#FFFFFF] rounded-lg transition-all"
                      title="Restart file retrieval"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Network Diagnostics Informative Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-5 rounded-2xl backdrop-blur-md space-y-4">
            <span className="font-sans font-black text-[#FFFFFF] text-sm tracking-tight flex items-center gap-1.5 border-b border-[#232F4C] pb-2 mb-1">
              <History className="w-4 h-4 text-[#12CFCE]" />
              CDN Network Config
            </span>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-[11px] border-b border-[#232F4C] pb-1.5">
                <span className="text-[#94A3B8]">CDN SERVER ROUTE:</span>
                <span className="text-[#FFFFFF] font-mono font-bold">FR_PARIS_METRO_09</span>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-[#232F4C] pb-1.5">
                <span className="text-[#94A3B8]">CONCURRENT CHANNELS:</span>
                <span className="text-[#12CFCE] font-mono font-bold">03 STREAMS (AUTO)</span>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-[#232F4C] pb-1.5">
                <span className="text-[#94A3B8]">BANDWIDTH LIMIT:</span>
                <span className="text-[#10B981] font-mono font-bold">UNLIMITED (VIP)</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#94A3B8]">PACKET VALIDITY check:</span>
                <span className="text-[#10B981] font-mono font-bold">AUTO SHAKE_OK</span>
              </div>
            </div>

            <div className="p-3 bg-[#151D30]/60 border border-[#232F4C] rounded-xl text-[10px] leading-relaxed text-[#94A3B8]">
              <span className="font-bold text-[#FFFFFF] flex items-center gap-1 mb-1 text-[11px]">
                <Info className="w-3.5 h-3.5 text-[#12CFCE]" />
                Auto-Verification Engine:
              </span>
              Once a .scs file stream hits 100%, ModMarket automatically unpacks, scans CRC checksum hashes, and drops the asset into your active ETS2 document profiles directory without requiring any manual ZIP extracts.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
