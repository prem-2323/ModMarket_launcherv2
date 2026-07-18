import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Crown,
  Download,
  Star,
  Heart,
  CheckCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Mod } from '../types';
import { modApi } from '../services/modApi';

interface StoreProps {
  purchasedModIds: string[];
  installedModIds: string[];
  favoriteModIds: string[];
  onToggleFavorite: (id: string) => void;
  onBuyMod: (mod: Mod) => void;
  onDownloadMod: (modId: string) => void;
  onSelectModDetails: (mod: Mod) => void;
}

const categories = [
  { id: '', label: 'All Categories' },
  { id: 'Maps', label: 'Map Expansion' },
  { id: 'Truck', label: 'Truck Mods' },
  { id: 'Trailer', label: 'Trailers' },
  { id: 'Graphics', label: 'Graphics & Skies' },
  { id: 'Weather', label: 'Weather' },
  { id: 'Sound', label: 'Sounds & Ambiance' },
  { id: 'Physics', label: 'Physics' },
  { id: 'AI Traffic', label: 'AI Traffic' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Interior', label: 'Interior' },
  { id: 'Paint Jobs', label: 'Paint Jobs' },
  { id: 'Utility', label: 'Utility' },
  { id: 'Bus', label: 'Bus' },
];

const sorts = [
  { id: 'downloads', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'price', label: 'Price' },
  { id: 'alphabetical', label: 'A-Z' },
] as const;

const games = [
  { id: '', label: 'All Games' },
  { id: 'ETS2', label: 'ETS2' },
  { id: 'ATS', label: 'ATS' },
];

export default function Store({
  purchasedModIds,
  installedModIds,
  favoriteModIds,
  onToggleFavorite,
  onBuyMod,
  onDownloadMod,
  onSelectModDetails
}: StoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState<string>('downloads');
  const [selectedGame, setSelectedGame] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [mods, setMods] = useState<Mod[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredMods, setFeaturedMods] = useState<Mod[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const fetchMods = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: 20,
        sort: selectedSort,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (selectedGame) params.game = selectedGame;
      if (freeOnly) params.isFree = 'true';
      if (searchQuery) params.search = searchQuery;

      const res = await modApi.getMods(params);
      if (res.success) {
        setMods(res.mods);
        setPagination(res.pagination);
      } else {
        setError('Failed to load mods');
      }
    } catch {
      setError('Network error loading mods');
    } finally {
      setLoading(false);
    }
  }, [page, selectedSort, selectedCategory, selectedGame, freeOnly, searchQuery]);

  useEffect(() => {
    fetchMods();
  }, [fetchMods]);

  useEffect(() => {
    modApi.getFeaturedMods().then((res) => {
      if (res.success) setFeaturedMods(res.mods);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % (featuredMods.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredMods.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMods();
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const featured = featuredMods[featuredIndex];

  return (
    <div id="store-view" className="space-y-6 animate-fade-in">

      {/* Featured Carousel */}
      {featured && (
        <div
          className="relative h-64 rounded-2xl overflow-hidden bg-cover bg-center cursor-pointer group"
          style={{ backgroundImage: `url('${featured.thumbnail || ''}')` }}
          onClick={() => onSelectModDetails(featured)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/90 via-[#0B0F19]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#12CFCE] bg-[#12CFCE]/15 px-2.5 py-1 rounded-full inline-block mb-2">
              Featured Mod
            </span>
            <h2 className="text-2xl font-black text-[#FFFFFF]">{featured.title}</h2>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-xl line-clamp-2">{featured.shortDescription}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-[#F59E0B]">
                <Star className="w-3.5 h-3.5 fill-current" /> {featured.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#94A3B8]">{featured.downloadCount.toLocaleString()} downloads</span>
              {!featured.isFree && (
                <span className="text-xs font-bold text-[#12CFCE]">${featured.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFeaturedIndex((prev) => (prev - 1 + featuredMods.length) % featuredMods.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-[#0B0F19]/60 hover:bg-[#0B0F19]/80 text-[#FFFFFF] rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setFeaturedIndex((prev) => (prev + 1) % featuredMods.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-[#0B0F19]/60 hover:bg-[#0B0F19]/80 text-[#FFFFFF] rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Sort Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#151D30]/40 p-4 rounded-2xl border border-[#232F4C] backdrop-blur-md">

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search mods by title, author, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151D30]/80 border border-[#232F4C] focus:border-[#12CFCE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none transition-all"
          />
        </form>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 w-full lg:w-auto overflow-x-auto custom-scrollbar shrink-0 pb-1 lg:pb-0">
          <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1 shrink-0 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            SORT BY:
          </span>
          {sorts.map((sort) => (
            <button
              key={sort.id}
              onClick={() => handleSortChange(sort.id)}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block px-3">
            Mod Categories
          </span>
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-2.5 rounded-2xl backdrop-blur-md space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#12CFCE]/15 text-[#FFFFFF] border border-[#12CFCE]/30'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945]/30 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                {selectedCategory === cat.id && (
                  <ChevronRightIcon className="w-3.5 h-3.5 text-[#12CFCE]" />
                )}
              </button>
            ))}
          </div>

          {/* Game Filter */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-2.5 rounded-2xl backdrop-blur-md space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block px-1 pb-1">Game</span>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => { setSelectedGame(g.id); setPage(1); }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGame === g.id
                    ? 'bg-[#12CFCE]/15 text-[#FFFFFF] border border-[#12CFCE]/30'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1B2945]/30 border border-transparent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Free Toggle */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] p-3 rounded-2xl backdrop-blur-md">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#94A3B8]">Free Only</span>
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={() => { setFreeOnly(!freeOnly); setPage(1); }}
                className="w-4 h-4 rounded border-[#232F4C] bg-[#151D30] text-[#12CFCE] focus:ring-[#12CFCE] focus:ring-offset-0"
              />
            </label>
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
              {loading ? 'Loading...' : `Showing ${mods.length} of ${pagination.total} mods`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <Loader2 className="w-8 h-8 text-[#12CFCE] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <AlertCircle className="w-8 h-8 text-[#EF4444] mx-auto" />
              <p className="text-sm font-bold text-[#FFFFFF] mt-2">{error}</p>
              <button onClick={fetchMods} className="mt-4 px-4 py-2 bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-xs font-semibold rounded-lg text-[#12CFCE] transition-all">
                Retry
              </button>
            </div>
          ) : mods.length === 0 ? (
            <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
              <Search className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-sm font-bold text-[#FFFFFF] mt-2">No matching mods found</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try resetting filters or adjusting search queries</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedGame(''); setFreeOnly(false); setPage(1); }}
                className="mt-4 px-4 py-2 bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-xs font-semibold rounded-lg text-[#12CFCE] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {mods.map((mod) => {
                  const isOwned = mod.isFree || purchasedModIds.includes(mod._id);
                  const isDownloaded = installedModIds.includes(mod._id);
                  const isFavorite = favoriteModIds.includes(mod._id);

                  return (
                    <div
                      key={mod._id}
                      className="group bg-[#151D30]/60 border border-[#232F4C] hover:border-[#12CFCE]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_24px_rgba(18,207,206,0.15)] relative"
                    >
                      <div className="relative h-44 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${mod.thumbnail || ''}')` }} referrerPolicy="no-referrer">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151D30] to-transparent opacity-60" />

                        <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                          {mod.isFree ? (
                            <span className="text-[9px] font-mono font-black uppercase text-[#FFFFFF] bg-[#10B981] px-2 py-0.5 rounded shadow">
                              Free
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-black uppercase text-[#0B0F19] bg-[#12CFCE] px-2 py-0.5 rounded shadow">
                              <Crown className="w-3 h-3 fill-current" />
                              Premium
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-[#FFFFFF] bg-[#0B0F19]/80 px-2 py-0.5 rounded border border-[#232F4C]">
                            {mod.category.toUpperCase()}
                          </span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(mod._id); }}
                          className={`absolute top-3 right-3 p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                            isFavorite
                              ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-[#EF4444]'
                              : 'bg-[#0B0F19]/60 border-[#232F4C] text-[#94A3B8] hover:text-[#EF4444]'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <div
                          onClick={() => onSelectModDetails(mod)}
                          className="absolute inset-0 bg-[#0B0F19]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                        >
                          <p className="text-xs font-semibold text-[#12CFCE] uppercase tracking-wider mb-1">Quick View</p>
                          <p className="text-xs text-[#FFFFFF] line-clamp-3 px-3 leading-normal">
                            {mod.shortDescription}
                          </p>
                          <span className="text-[10px] text-[#94A3B8] mt-3 underline hover:text-[#FFFFFF]">
                            Click to view technical specs
                          </span>
                        </div>
                      </div>

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
                              {mod.rating.toFixed(1)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 font-mono">
                            <span>By {mod.author}</span>
                            <span>{mod.downloadCount.toLocaleString()} dl</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#232F4C]">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Price</span>
                            <span className="text-sm font-black text-[#FFFFFF]">
                              {mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`}
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            {!mod.isFree && !isOwned ? (
                              <button
                                onClick={() => onBuyMod(mod)}
                                className="px-4 py-2 bg-gradient-to-r from-[#12CFCE] to-[#1B2945] hover:to-[#12CFCE] text-[#FFFFFF] hover:text-[#0B0F19] text-xs font-extrabold rounded-lg tracking-wide uppercase transition-all duration-300 shadow-[0_0_12px_rgba(18,207,206,0.1)] cursor-pointer"
                              >
                                Buy Now
                              </button>
                            ) : (
                              <button
                                onClick={() => { if (!isDownloaded) onDownloadMod(mod._id); }}
                                disabled={isDownloaded}
                                className={`px-4 py-2 text-xs font-extrabold rounded-lg tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                  isDownloaded
                                    ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] disabled:opacity-100 cursor-default'
                                    : 'bg-[#151D30] hover:bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-[#12CFCE] hover:text-[#FFFFFF]'
                                }`}
                              >
                                {isDownloaded ? (
                                  <><CheckCircle className="w-3.5 h-3.5" /><span>Library</span></>
                                ) : (
                                  <><Download className="w-3.5 h-3.5" /><span>Get</span></>
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 bg-[#151D30]/60 border border-[#232F4C] rounded-lg text-[#94A3B8] hover:text-[#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-[#94A3B8] text-xs">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            page === p
                              ? 'bg-[#12CFCE]/10 border border-[#12CFCE] text-[#12CFCE]'
                              : 'bg-[#151D30]/60 border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="p-2 bg-[#151D30]/60 border border-[#232F4C] rounded-lg text-[#94A3B8] hover:text-[#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
