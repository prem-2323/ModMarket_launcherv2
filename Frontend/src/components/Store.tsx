import React, { useState } from 'react';
import { 
  Search, 
  Crown, 
  Download, 
  Star, 
  Heart, 
  CheckCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Mod } from '../types';

interface StoreProps {
  mods: Mod[];
  purchasedModIds: string[];
  installedModIds: string[];
  favoriteModIds: string[];
  onToggleFavorite: (id: string) => void;
  onBuyMod: (mod: Mod) => void;
  onDownloadMod: (modId: string) => void;
  onSelectModDetails: (mod: Mod) => void;
}

export default function Store({
  mods,
  purchasedModIds,
  installedModIds,
  favoriteModIds,
  onToggleFavorite,
  onBuyMod,
  onDownloadMod,
  onSelectModDetails
}: StoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'popular' | 'premium' | 'free'>('popular');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'truck', label: 'Truck Mods' },
    { id: 'map', label: 'Map Expansion' },
    { id: 'graphics', label: 'Graphics & Skies' },
    { id: 'trailers', label: 'Trailers' },
    { id: 'physics', label: 'Physics' },
    { id: 'sounds', label: 'Sounds & Ambiance' },
  ];

  const sorts = [
    { id: 'popular', label: 'Popular' },
    { id: 'newest', label: 'Newest' },
    { id: 'premium', label: 'Premium' },
    { id: 'free', label: 'Free' },
  ] as const;

  // Filter and sort mods
  const filteredMods = mods
    .filter((mod) => {
      const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            mod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mod.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (selectedSort === 'popular') {
        return b.downloads - a.downloads;
      }
      if (selectedSort === 'newest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      if (selectedSort === 'premium') {
        return (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0);
      }
      if (selectedSort === 'free') {
        return (a.isPremium ? 1 : 0) - (b.isPremium ? 1 : 0);
      }
      return 0;
    });

  return (
    <div id="store-view" className="space-y-6 animate-fade-in">
      
      {/* Search and Sort Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-4 rounded-2xl border border-[#232F4C] backdrop-blur-md">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search custom Scania trucks, graphics, sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151D30]/80 border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto custom-scrollbar shrink-0 pb-1 lg:pb-0">
          <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1 shrink-0 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            SORT BY:
          </span>
          {sorts.map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSelectedSort(sort.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                selectedSort === sort.id
                  ? 'bg-[#12CFCE]/10 border border-[#12CFCE] text-[#12CFCE]'
                  : 'bg-[#151D30]/60 border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Category filter on Left (Desktop) + Mod Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Categories Rails */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block px-3">
            Mod Categories
          </span>
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-2.5 rounded-2xl backdrop-blur-md space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#12CFCE]/15 text-[#FFFFFF] border border-[#12CFCE]/30'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945]/30 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                {selectedCategory === cat.id && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#12CFCE]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-4 bg-gradient-to-br from-[#151D30] to-[#1B2945]/30 border border-[#232F4C] rounded-2xl text-xs space-y-2 text-center">
            <TrendingUp className="w-6 h-6 text-[#12CFCE] mx-auto animate-pulse" />
            <h4 className="font-bold text-[#FFFFFF]">Submit Your Mod</h4>
            <p className="text-[10px] text-[#94A3B8] leading-relaxed">
              Earn real income by listing your bespoke 3D cabin assets and sound layouts in our premium marketplace.
            </p>
            <button className="w-full py-1.5 bg-[#1B2945] hover:bg-[#232F4C] text-[#12CFCE] hover:text-[#FFFFFF] border border-[#232F4C] rounded-lg font-bold text-[10px] transition-all">
              Creator Dashboard
            </button>
          </div>
        </div>

        {/* Right Mod Grid */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#94A3B8]">
              Showing {filteredMods.length} matching premium and free mods
            </span>
          </div>

          {filteredMods.length === 0 ? (
            <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <span className="text-2xl block">🔍</span>
              <p className="text-sm font-bold text-[#FFFFFF] mt-2">No matching mods found</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try resetting filters or adjusting search queries</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 px-4 py-2 bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-xs font-semibold rounded-lg text-[#12CFCE] hover:text-[#FFFFFF] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredMods.map((mod) => {
                const isOwned = !mod.isPremium || purchasedModIds.includes(mod.id);
                const isDownloaded = installedModIds.includes(mod.id);
                const isFavorite = favoriteModIds.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className="group bg-[#151D30]/60 border border-[#232F4C] hover:border-[#12CFCE]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_24px_rgba(18,207,206,0.15)] relative"
                  >
                    {/* Badge and Favorite on Thumbnail overlay */}
                    <div className="relative h-44 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${mod.thumbnail}')` }} referrerPolicy="no-referrer">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151D30] to-transparent opacity-60" />
                      
                      {/* Premium Badge / Cost Overlay */}
                      <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                        {mod.isPremium ? (
                          <span className="flex items-center gap-1 text-[9px] font-mono font-black uppercase text-[#0B0F19] bg-[#12CFCE] px-2 py-0.5 rounded shadow">
                            <Crown className="w-3 h-3 fill-current" />
                            Premium
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-black uppercase text-[#FFFFFF] bg-[#10B981] px-2 py-0.5 rounded shadow">
                            Free
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-[#FFFFFF] bg-[#0B0F19]/80 px-2 py-0.5 rounded border border-[#232F4C]">
                          {mod.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(mod.id);
                        }}
                        className={`absolute top-3 right-3 p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                          isFavorite
                            ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-[#EF4444]'
                            : 'bg-[#0B0F19]/60 border-[#232F4C] text-[#94A3B8] hover:text-[#EF4444]'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Overlay Details on Image Hover */}
                      <div 
                        onClick={() => onSelectModDetails(mod)}
                        className="absolute inset-0 bg-[#0B0F19]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-[#12CFCE] uppercase tracking-wider mb-1">Quick View</p>
                        <p className="text-xs text-[#FFFFFF] line-clamp-3 px-3 leading-normal">
                          {mod.tagline}
                        </p>
                        <span className="text-[10px] text-[#94A3B8] mt-3 underline hover:text-[#FFFFFF]">
                          Click to view technical specs & screens
                        </span>
                      </div>
                    </div>

                    {/* Mod Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 
                            onClick={() => onSelectModDetails(mod)}
                            className="font-sans font-bold text-sm text-[#FFFFFF] hover:text-[#12CFCE] cursor-pointer transition-colors leading-tight truncate pr-2"
                          >
                            {mod.title}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] shrink-0 text-[#FFFFFF] font-semibold bg-[#1B2945]/40 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                            {mod.rating.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 font-mono">
                          <span>By {mod.author}</span>
                          <span>{mod.downloads.toLocaleString()} dl</span>
                        </div>
                      </div>

                      {/* Price, Download, Purchase Action row */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#232F4C]">
                        {/* Cost detail */}
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Price</span>
                          <span className="text-sm font-black text-[#FFFFFF]">
                            {mod.isPremium ? `$${mod.price}` : 'FREE'}
                          </span>
                        </div>

                        {/* Button Action */}
                        <div className="flex gap-1.5">
                          {/* If premium and not owned, show Buy */}
                          {mod.isPremium && !isOwned ? (
                            <button
                              onClick={() => onBuyMod(mod)}
                              className="px-4 py-2 bg-gradient-to-r from-[#12CFCE] to-[#1B2945] hover:to-[#12CFCE] text-[#FFFFFF] hover:text-[#0B0F19] text-xs font-extrabold rounded-lg tracking-wide uppercase transition-all duration-300 shadow-[0_0_12px_rgba(18,207,206,0.1)] cursor-pointer"
                            >
                              Buy Now
                            </button>
                          ) : (
                            /* Else if not downloaded, show Download, or if downloaded, show Installed */
                            <button
                              onClick={() => {
                                if (!isDownloaded) {
                                  onDownloadMod(mod.id);
                                }
                              }}
                              disabled={isDownloaded}
                              className={`px-4 py-2 text-xs font-extrabold rounded-lg tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                isDownloaded
                                  ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] disabled:opacity-100 cursor-default'
                                  : 'bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-[#12CFCE] hover:text-[#FFFFFF]'
                              }`}
                            >
                              {isDownloaded ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Library</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Get</span>
                                </>
                              )}
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

      </div>
    </div>
  );
}
