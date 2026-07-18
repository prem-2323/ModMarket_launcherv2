import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Eye,
  Star,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Heart,
  MessageSquare,
  Edit3,
  Trash2,
  EyeOff,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Crown,
  RefreshCcw,
  Plus,
  Save,
  X
} from 'lucide-react';
import { Mod } from '../types';
import { modApi } from '../services/modApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [mods, setMods] = useState<Mod[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Mod>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, modsRes] = await Promise.all([
        modApi.getModStats(),
        modApi.getMods({ page, limit: 20, sort: 'newest', status: undefined }),
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (modsRes.success) {
        setMods(modsRes.mods);
        setPagination(modsRes.pagination);
      }
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData() }, [page]);

  const handleSearch = async () => {
    setPage(1);
    setLoading(true);
    const res = await modApi.getMods({ page: 1, limit: 20, search: searchQuery || undefined, sort: 'newest', status: undefined });
    if (res.success) { setMods(res.mods); setPagination(res.pagination); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mod permanently?')) return;
    await modApi.deleteMod(id);
    fetchData();
  };

  const handleHide = async (id: string) => {
    await modApi.patchHide(id);
    fetchData();
  };

  const handlePublish = async (id: string) => {
    await modApi.patchPublish(id);
    fetchData();
  };

  const handleToggleFeature = async (id: string, featured: boolean) => {
    await modApi.patchFeature(id, featured);
    fetchData();
  };

  const handleSave = async () => {
    if (!formData.title) return;
    setSaving(true);
    if (editingMod) {
      await modApi.updateMod(editingMod._id, formData);
    } else {
      await modApi.createMod(formData);
    }
    setSaving(false);
    setEditingMod(null);
    setShowAddForm(false);
    setFormData({});
    fetchData();
  };

  const statCards = stats ? [
    { label: 'Total Mods', value: stats.totalMods, icon: Package, color: 'text-[#12CFCE]' },
    { label: 'Downloads', value: stats.totalDownloads?.toLocaleString(), icon: Download, color: 'text-[#10B981]' },
    { label: 'Views', value: stats.totalViews?.toLocaleString(), icon: Eye, color: 'text-[#F59E0B]' },
    { label: 'Purchases', value: stats.totalPurchases?.toLocaleString(), icon: ShoppingCart, color: 'text-[#8B5CF6]' },
    { label: 'Avg Rating', value: stats.avgRating?.toFixed(1), icon: Star, color: 'text-[#F59E0B]' },
  ] : [];

  if (loading && !stats) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-[#12CFCE] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-[#FFFFFF] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#12CFCE]" />
          Admin Dashboard
        </h1>
        <button onClick={() => { setShowAddForm(true); setEditingMod(null); setFormData({}); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12CFCE] text-[#0B0F19] rounded-lg text-xs font-bold hover:bg-[#10B981] transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Mod
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-[#151D30]/60 border border-[#232F4C] p-4 rounded-xl">
              <div className="flex items-center justify-between text-[#94A3B8] mb-1.5">
                <span className="text-[9px] font-mono uppercase">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-lg font-black text-[#FFFFFF]">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Mod Table */}
      <div className="bg-[#151D30]/40 border border-[#232F4C] rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#94A3B8]">{pagination.total} mods</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8]" />
              <input type="text" placeholder="Search mods..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-48 bg-[#0B0F19] border border-[#232F4C] rounded-lg pl-8 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#94A3B8] outline-none focus:border-[#12CFCE] transition-all" />
            </div>
            <button onClick={fetchData} className="p-2 bg-[#1B2945] border border-[#232F4C] rounded-lg text-[#94A3B8] hover:text-[#12CFCE] transition-all cursor-pointer"><RefreshCcw className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {(showAddForm || editingMod) && (
          <div className="bg-[#0B0F19] border border-[#12CFCE]/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#232F4C] pb-2">
              <span className="text-xs font-bold text-[#FFFFFF]">{editingMod ? 'Edit Mod' : 'Add New Mod'}</span>
              <button onClick={() => { setShowAddForm(false); setEditingMod(null); }} className="text-[#94A3B8] hover:text-[#FFFFFF] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Title" value={formData.title || ''} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]" />
              <input placeholder="Slug" value={formData.slug || ''} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]" />
              <input placeholder="Author" value={formData.author || ''} onChange={e => setFormData(p => ({ ...p, author: e.target.value }))} className="bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]" />
              <select value={formData.game || 'ETS2'} onChange={e => setFormData(p => ({ ...p, game: e.target.value }))} className="bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]">
                <option value="ETS2">ETS2</option><option value="ATS">ATS</option>
              </select>
              <select value={formData.category || ''} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]">
                <option value="">Category</option>
                {['Truck','Trailer','Maps','Graphics','Weather','Sound','Physics','Traffic','Bus','Interior','Accessories','Paint Jobs','Utility','Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Price" value={formData.price || 0} onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value), isFree: Number(e.target.value) === 0 }))} className="flex-1 bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE]" />
                <label className="flex items-center gap-1.5 text-xs text-[#94A3B8]"><input type="checkbox" checked={formData.featured || false} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-3.5 h-3.5" /> Featured</label>
              </div>
            </div>
            <textarea placeholder="Short description" value={formData.shortDescription || ''} onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))} className="w-full bg-[#151D30] border border-[#232F4C] rounded-lg px-3 py-2 text-xs text-[#FFFFFF] outline-none focus:border-[#12CFCE] h-16 resize-none" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowAddForm(false); setEditingMod(null); }} className="px-3 py-1.5 bg-[#1B2945] border border-[#232F4C] text-xs text-[#94A3B8] rounded-lg hover:text-[#FFFFFF] transition-all cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !formData.title} className="px-3 py-1.5 bg-[#12CFCE] text-[#0B0F19] text-xs font-bold rounded-lg hover:bg-[#10B981] transition-all disabled:opacity-50 cursor-pointer">{saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[#94A3B8] font-mono border-b border-[#232F4C]">
                <th className="text-left py-2 px-2">Title</th>
                <th className="text-left py-2 px-2">Author</th>
                <th className="text-left py-2 px-2">Game</th>
                <th className="text-left py-2 px-2">Category</th>
                <th className="text-center py-2 px-2">Price</th>
                <th className="text-center py-2 px-2">Downloads</th>
                <th className="text-center py-2 px-2">Rating</th>
                <th className="text-center py-2 px-2">Status</th>
                <th className="text-center py-2 px-2">Featured</th>
                <th className="text-right py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mods.map(mod => (
                <tr key={mod._id} className="border-b border-[#232F4C]/50 hover:bg-[#1B2945]/20 transition-colors">
                  <td className="py-2.5 px-2 text-[#FFFFFF] font-semibold max-w-[200px] truncate">{mod.title}</td>
                  <td className="py-2.5 px-2 text-[#94A3B8]">{mod.author}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold text-[#12CFCE] bg-[#12CFCE]/10 px-1.5 py-0.5 rounded">{mod.game}</span></td>
                  <td className="py-2.5 px-2 text-[#94A3B8]">{mod.category}</td>
                  <td className="py-2.5 px-2 text-center font-mono">{mod.isFree ? <span className="text-[#10B981]">FREE</span> : `$${mod.price.toFixed(2)}`}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-[#94A3B8]">{mod.downloadCount}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                      {mod.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${mod.status === 'Published' ? 'bg-[#10B981]/10 text-[#10B981]' : mod.status === 'Hidden' ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{mod.status}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {mod.featured ? <Crown className="w-3.5 h-3.5 text-[#F59E0B] mx-auto fill-current" /> : <span className="text-[#232F4C]">—</span>}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditingMod(mod); setFormData(mod); setShowAddForm(false); }} className="p-1.5 bg-[#1B2945] rounded-lg text-[#94A3B8] hover:text-[#12CFCE] transition-all cursor-pointer" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleToggleFeature(mod._id, !mod.featured)} className={`p-1.5 rounded-lg transition-all cursor-pointer ${mod.featured ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#1B2945] text-[#94A3B8] hover:text-[#F59E0B]'}`} title={mod.featured ? 'Unfeature' : 'Feature'}><Star className="w-3.5 h-3.5" /></button>
                      {mod.status === 'Published' ? (
                        <button onClick={() => handleHide(mod._id)} className="p-1.5 bg-[#1B2945] rounded-lg text-[#94A3B8] hover:text-[#EF4444] transition-all cursor-pointer" title="Hide"><EyeOff className="w-3.5 h-3.5" /></button>
                      ) : (
                        <button onClick={() => handlePublish(mod._id)} className="p-1.5 bg-[#1B2945] rounded-lg text-[#94A3B8] hover:text-[#10B981] transition-all cursor-pointer" title="Publish"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => handleDelete(mod._id)} className="p-1.5 bg-[#1B2945] rounded-lg text-[#94A3B8] hover:text-[#EF4444] transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {mods.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-[#94A3B8]">No mods found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 bg-[#1B2945] border border-[#232F4C] rounded-lg text-[#94A3B8] hover:text-[#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 2).map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-[#94A3B8] text-xs">...</span>}
                <button onClick={() => setPage(p)} className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${page === p ? 'bg-[#12CFCE]/10 border border-[#12CFCE] text-[#12CFCE]' : 'bg-[#151D30]/60 border border-[#232F4C] text-[#94A3B8] hover:text-[#FFFFFF]'}`}>{p}</button>
              </React.Fragment>
            ))}
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="p-1.5 bg-[#1B2945] border border-[#232F4C] rounded-lg text-[#94A3B8] hover:text-[#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
