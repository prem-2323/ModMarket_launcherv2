import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Crown,
  Download,
  Star,
  Heart,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  MessageSquare,
  Send,
  Trash2,
  User,
  Calendar
} from 'lucide-react';
import { Mod, Review } from '../types';
import { modApi } from '../services/modApi';

interface ModDetailsProps {
  modId: string;
  purchasedModIds: string[];
  installedModIds: string[];
  favoriteModIds: string[];
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onBuyMod: (mod: Mod) => void;
  onDownloadMod: (modId: string) => void;
}

export default function ModDetails({
  modId,
  purchasedModIds,
  installedModIds,
  favoriteModIds,
  onBack,
  onToggleFavorite,
  onBuyMod,
  onDownloadMod
}: ModDetailsProps) {
  const [mod, setMod] = useState<Mod | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPagination, setReviewsPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [reviewPage, setReviewPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    modApi.getModById(modId).then((res) => {
      if (res.success && res.mod) {
        setMod(res.mod);
      } else {
        setError('Mod not found');
      }
      setLoading(false);
    }).catch(() => {
      setError('Failed to load mod');
      setLoading(false);
    });
  }, [modId]);

  useEffect(() => {
    modApi.getModReviews(modId, reviewPage).then((res) => {
      if (res.success) {
        setReviews(res.reviews);
        setReviewsPagination(res.pagination);
      }
    });
  }, [modId, reviewPage]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    const res = await modApi.createReview(modId, reviewStars, reviewComment);
    if (res.success) {
      setReviewComment('');
      setReviewStars(5);
      const updated = await modApi.getModReviews(modId, 1);
      if (updated.success) {
        setReviews(updated.reviews);
        setReviewsPagination(updated.pagination);
        setReviewPage(1);
      }
    } else {
      setReviewError(res.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await modApi.deleteReview(reviewId);
    const updated = await modApi.getModReviews(modId, reviewPage);
    if (updated.success) {
      setReviews(updated.reviews);
      setReviewsPagination(updated.pagination);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#12CFCE] animate-spin" />
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div className="text-center py-20 bg-[#151D30]/30 border border-[#232F4C] rounded-2xl">
        <AlertCircle className="w-8 h-8 text-[#EF4444] mx-auto" />
        <p className="text-sm font-bold text-[#FFFFFF] mt-2">{error || 'Mod not found'}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#1B2945] border border-[#232F4C] hover:border-[#12CFCE] text-xs font-semibold rounded-lg text-[#12CFCE] transition-all">
          Back to Store
        </button>
      </div>
    );
  }

  const isOwned = mod.isFree || purchasedModIds.includes(mod._id);
  const isDownloaded = installedModIds.includes(mod._id);
  const isFavorite = favoriteModIds.includes(mod._id);

  return (
    <div id="mod-details-view" className="space-y-6 animate-fade-in">

      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#151D30]/80 border border-[#232F4C] hover:border-[#12CFCE]/50 text-xs text-[#94A3B8] hover:text-[#FFFFFF] rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>

        <div className="flex items-center space-x-2">
          {mod.isFree ? (
            <span className="text-[10px] font-mono font-black uppercase text-[#FFFFFF] bg-[#10B981] px-2.5 py-1 rounded">
              Free Mod
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono font-black uppercase text-[#0B0F19] bg-[#12CFCE] px-2.5 py-1 rounded">
              <Crown className="w-3.5 h-3.5 fill-current" />
              Premium Mod
            </span>
          )}
          <span className="text-[10px] font-mono text-[#FFFFFF] bg-[#151D30] border border-[#232F4C] px-2.5 py-1 rounded">
            Version {mod.version}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Gallery */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl overflow-hidden p-2 backdrop-blur-md">
            <div
              className="relative h-96 bg-cover bg-center rounded-xl overflow-hidden transition-all duration-300"
              style={{ backgroundImage: `url('${(mod.screenshots || [])[activeScreenIndex] || mod.thumbnail || ''}')` }}
              referrerPolicy="no-referrer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-40" />
            </div>

            {(mod.screenshots || []).length > 1 && (
              <div className="flex gap-2 mt-2 px-1">
                {(mod.screenshots || []).map((screen, idx) => (
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

          {/* Description */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div>
              <h1 className="text-2xl font-sans font-black text-[#FFFFFF] tracking-tight">
                {mod.title}
              </h1>
              <p className="text-xs text-[#12CFCE] mt-1 font-mono">
                DEVELOPED BY {mod.author.toUpperCase()} &bull; {mod.game}
              </p>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {mod.description}
            </p>

            {(mod.features || []).length > 0 && (
              <div className="border-t border-[#232F4C] pt-4">
                <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-3">
                  Key Features
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
            )}

            {mod.changelog.length > 0 && (
              <div className="border-t border-[#232F4C] pt-4">
                <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-3">
                  Changelog
                </span>
                <ul className="space-y-1">
                  {mod.changelog.map((entry, idx) => (
                    <li key={idx} className="text-xs text-[#94A3B8] flex items-start gap-2">
                      <span className="text-[#12CFCE] mt-1">-</span>
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-6 backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Reviews ({reviewsPagination.total})
            </span>

            {/* Review Form */}
            <div className="bg-[#1B2945]/30 rounded-xl p-4 border border-[#232F4C]">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewStars(star)}
                    className="cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${star <= reviewStars ? 'text-[#F59E0B] fill-current' : 'text-[#232F4C]'}`} />
                  </button>
                ))}
                <span className="text-xs text-[#94A3B8] ml-2">{reviewStars}/5</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a review..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="flex-1 bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none focus:border-[#12CFCE] transition-all"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewComment.trim()}
                  className="px-3 py-2 bg-[#12CFCE] text-[#0B0F19] rounded-lg font-bold text-xs hover:bg-[#10B981] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
              {reviewError && <p className="text-[10px] text-[#EF4444] mt-1">{reviewError}</p>}
            </div>

            {/* Review List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-[#94A3B8] text-center py-6">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-[#1B2945]/20 rounded-xl p-3 border border-[#232F4C]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#151D30] rounded-full flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                        </div>
                        <span className="text-xs font-semibold text-[#FFFFFF]">{review.user?.username || 'Anonymous'}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-2.5 h-2.5 ${s <= review.stars ? 'text-[#F59E0B] fill-current' : 'text-[#232F4C]'}`} />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-[#94A3B8] hover:text-[#EF4444] transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1.5">{review.comment}</p>
                    <span className="text-[9px] text-[#94A3B8] mt-1 block font-mono">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {reviewsPagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {Array.from({ length: reviewsPagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setReviewPage(p)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      reviewPage === p
                        ? 'bg-[#12CFCE]/10 border border-[#12CFCE] text-[#12CFCE]'
                        : 'bg-[#151D30]/60 border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Pricing Card */}
          <div className="bg-gradient-to-b from-[#151D30] to-[#1B2945]/40 border border-[#12CFCE]/30 rounded-2xl p-5 shadow-[0_0_24px_rgba(18,207,206,0.05)]">
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">ACQUIRING LICENSE</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-sans font-black text-[#FFFFFF]">
                {mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`}
              </span>
              {!mod.isFree && (
                <span className="text-[10px] text-[#94A3B8] font-mono">one-time seat purchase</span>
              )}
            </div>

            <div className="space-y-2.5 mt-5">
              {!mod.isFree && !isOwned ? (
                <button
                  onClick={() => onBuyMod(mod)}
                  className="w-full py-3 bg-gradient-to-r from-[#12CFCE] to-[#10B981] text-[#0B0F19] hover:text-[#FFFFFF] font-black text-sm uppercase rounded-xl tracking-wider transition-all duration-300 cursor-pointer"
                >
                  Buy Mod Now
                </button>
              ) : (
                <button
                  onClick={() => { if (!isDownloaded) onDownloadMod(mod._id); }}
                  disabled={isDownloaded}
                  className={`w-full py-3 text-sm font-black uppercase rounded-xl tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isDownloaded
                      ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] disabled:opacity-100 cursor-default'
                      : 'bg-[#151D30] hover:bg-[#1B2945] border border-[#12CFCE]/50 text-[#12CFCE] hover:text-[#FFFFFF]'
                  }`}
                >
                  {isDownloaded ? (
                    <><CheckCircle className="w-4 h-4" /><span>Ready In Library</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>Download Assets</span></>
                  )}
                </button>
              )}

              <button
                onClick={() => onToggleFavorite(mod._id)}
                className={`w-full py-2 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-[#EF4444]'
                    : 'bg-[#151D30]/60 border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Specs Card */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2">
              Specifications
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
                <span className="text-[#94A3B8] font-mono text-[10px]">GAME</span>
                <p className="text-[#12CFCE] font-bold">{mod.game}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[#94A3B8] font-mono text-[10px]">DOWNLOADS</span>
                <p className="text-[#FFFFFF] font-bold">{mod.downloadCount.toLocaleString()}</p>
              </div>
            </div>

            {mod.supportedGameVersions.length > 0 && (
              <div className="border-t border-[#232F4C] pt-3">
                <span className="text-[#94A3B8] font-mono text-[10px] block">SUPPORTED VERSIONS</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {mod.supportedGameVersions.map((v, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-[#FFFFFF] bg-[#1B2945] px-2 py-0.5 rounded border border-[#232F4C]">
                      v{v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mod.requiredDLC.length > 0 && (
              <div className="border-t border-[#232F4C] pt-3">
                <span className="text-[#94A3B8] font-mono text-[10px] block">REQUIRED DLC</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {mod.requiredDLC.map((dlc, idx) => (
                    <span key={idx} className="text-[10px] font-semibold text-[#FFFFFF] bg-[#1B2945] px-2 py-0.5 rounded border border-[#232F4C]">
                      {dlc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mod.dependencies.length > 0 && (
              <div className="border-t border-[#232F4C] pt-3">
                <span className="text-[#94A3B8] font-mono text-[10px] block">DEPENDENCIES</span>
                {mod.dependencies.map((dep, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20 mt-1 mr-1">
                    <ShieldAlert className="w-3 h-3" />
                    {dep}
                  </span>
                ))}
              </div>
            )}

            {mod.dependencies.length === 0 && mod.requiredDLC.length === 0 && (
              <div className="border-t border-[#232F4C] pt-3">
                <span className="text-xs text-[#10B981] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  No DLC Requirements
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2">
              Rating
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-sans font-black text-[#FFFFFF]">
                {mod.rating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${
                      i < Math.floor(mod.rating) ? 'text-[#F59E0B] fill-current' : 'text-[#232F4C]'
                    }`} />
                  ))}
                </div>
                <span className="text-[10px] text-[#94A3B8] mt-0.5">
                  Based on {mod.reviewCount} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {mod.tags.length > 0 && (
            <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block border-b border-[#232F4C] pb-2">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {mod.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-[#94A3B8] bg-[#1B2945] px-2 py-0.5 rounded border border-[#232F4C]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
