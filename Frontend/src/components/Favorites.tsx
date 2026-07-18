import React, { useState, useEffect } from 'react';
import {
  Heart,
  Star,
  Download,
  Crown,
  CheckCircle,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Trash2,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Mod } from '../types';
import { modApi } from '../services/modApi';

interface FavoritesProps {
  favoriteModIds: string[];
  purchasedModIds: string[];
  installedModIds: string[];
  onToggleFavorite: (id: string) => void;
  onBuyMod: (mod: Mod) => void;
  onDownloadMod: (modId: string) => void;
  onSelectModDetails: (mod: Mod) => void;
}

export default function Favorites({
  favoriteModIds,
  purchasedModIds,
  installedModIds,
  onToggleFavorite,
  onBuyMod,
  onDownloadMod,
  onSelectModDetails
}: FavoritesProps) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (favoriteModIds.length === 0) {
      setMods([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    Promise.all(
      favoriteModIds.map(id => modApi.getModById(id).then(r => r.mod).catch(() => null))
    ).then((results) => {
      setMods(results.filter(Boolean) as Mod[]);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load favorites');
      setLoading(false);
    });
  }, [favoriteModIds]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#EF4444]/10 rounded-lg">
          <Heart className="w-5 h-5 text-[#EF4444] fill-current" />
        </div>
        <div>
          <h1 className="text-lg font-black text-[#FFFFFF]">My Wishlist</h1>
          <p className="text-xs text-[#94A3B8] font-mono">{favoriteModIds.length} mods saved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
          <Loader2 className="w-8 h-8 text-[#12CFCE] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
          <AlertCircle className="w-8 h-8 text-[#EF4444] mx-auto" />
          <p className="text-sm font-bold text-[#FFFFFF] mt-2">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-xs font-semibold rounded-lg text-[#12CFCE] transition-all">Retry</button>
        </div>
      ) : mods.length === 0 ? (
        <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
          <Heart className="w-10 h-10 text-[#232F4C] mx-auto" />
          <p className="text-sm font-bold text-[#FFFFFF] mt-3">Your wishlist is empty</p>
          <p className="text-xs text-[#94A3B8] mt-1">Browse the store and heart mods to save them here</p>
          <button onClick={() => window.location.href = '#store'} className="mt-4 px-4 py-2 bg-[#12CFCE] text-[#0B0F19] text-xs font-bold rounded-lg hover:bg-[#10B981] transition-all">Browse Store</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mods.map(mod => {
            const isOwned = mod.isFree || purchasedModIds.includes(mod._id);
            const isDownloaded = installedModIds.includes(mod._id);
            return (
              <div key={mod._id} className="group bg-[#151D30]/60 border border-[#232F4C] hover:border-[#EF4444]/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl">
                <div className="relative h-44 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${mod.thumbnail || ''}')` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151D30] to-transparent opacity-60" />
                  <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                    {mod.isFree ? (
                      <span className="text-[9px] font-mono font-black uppercase text-[#FFFFFF] bg-[#10B981] px-2 py-0.5 rounded shadow">Free</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-black uppercase text-[#0B0F19] bg-[#12CFCE] px-2 py-0.5 rounded shadow"><Crown className="w-3 h-3 fill-current" />Premium</span>
                    )}
                    <span className="text-[9px] font-mono text-[#FFFFFF] bg-[#0B0F19]/80 px-2 py-0.5 rounded border border-[#232F4C]">{mod.category.toUpperCase()}</span>
                  </div>
                  <button onClick={() => onToggleFavorite(mod._id)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/50 text-[#EF4444] backdrop-blur-md transition-all">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <div onClick={() => onSelectModDetails(mod)} className="absolute inset-0 bg-[#0B0F19]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer">
                    <p className="text-xs font-semibold text-[#12CFCE] uppercase tracking-wider mb-1">Quick View</p>
                    <p className="text-xs text-[#FFFFFF] line-clamp-3 px-3">{mod.shortDescription}</p>
                    <span className="text-[10px] text-[#94A3B8] mt-3 underline hover:text-[#FFFFFF]">Click for details</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 onClick={() => onSelectModDetails(mod)} className="font-sans font-bold text-sm text-[#FFFFFF] hover:text-[#EF4444] cursor-pointer transition-colors leading-tight truncate pr-2">{mod.title}</h3>
                      <div className="flex items-center gap-1 text-[11px] shrink-0 text-[#FFFFFF] font-semibold bg-[#1B2945]/40 px-1.5 py-0.5 rounded"><Star className="w-3 h-3 text-[#F59E0B] fill-current" />{mod.rating.toFixed(1)}</div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 font-mono">
                      <span>By {mod.author}</span>
                      <span>{mod.downloadCount.toLocaleString()} dl</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#232F4C]">
                    <div>
                      <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Price</span>
                      <span className="text-sm font-black text-[#FFFFFF] block">{mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {!mod.isFree && !isOwned ? (
                        <button onClick={() => onBuyMod(mod)} className="px-4 py-2 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:to-[#EF4444] text-[#FFFFFF] text-xs font-extrabold rounded-lg uppercase transition-all shadow-[0_0_12px_rgba(239,68,68,0.1)] cursor-pointer"><ShoppingBag className="w-3.5 h-3.5" /></button>
                      ) : (
                        <button onClick={() => { if (!isDownloaded) onDownloadMod(mod._id); }} disabled={isDownloaded} className={`px-4 py-2 text-xs font-extrabold rounded-lg uppercase transition-all flex items-center gap-1.5 cursor-pointer ${isDownloaded ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] cursor-default' : 'bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-[#12CFCE] hover:text-[#FFFFFF]'}`}>
                          {isDownloaded ? <><CheckCircle className="w-3.5 h-3.5" /><span>Lib</span></> : <><Download className="w-3.5 h-3.5" /><span>Get</span></>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
