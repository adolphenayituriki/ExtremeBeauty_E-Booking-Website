import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiPlus, FiEdit2, FiTrash2, FiLoader, FiRefreshCw, FiSearch, FiStar, FiX,
  FiTag, FiDollarSign, FiList, FiEye, FiUpload, FiImage, FiChevronDown, FiFilter,
} from 'react-icons/fi';
import { adminFetch, resolveAssetUrl } from '../../utils/adminApi';

const categoryOptions = ['Brows', 'Lash Lift', 'Lashes', 'Retouch', 'Training'];

const emptyForm = {
  name: '', price: '', priceFormatted: '', image: '', category: 'Brows',
  description: '', featured: false, active: true, order: 0,
};

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const inputBase =
    "w-full px-3.5 py-2.5 glass-input border border-black/10 text-[0.82rem] text-black outline-none rounded-xl placeholder:text-gray-400 transition-all duration-200";
  const labelBase = "flex items-center text-[0.66rem] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-2";

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/services');
      setServices(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditingId(s._id);
    setForm({ ...emptyForm, ...s, price: s.price !== undefined ? String(s.price) : '' });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.warning('Service name is required'); return; }
    if (!form.price) { toast.warning('Price is required'); return; }
    const payload = { ...form, price: Number(form.price), order: Number(form.order) || 0 };
    setSaving(true);
    try {
      if (editingId) {
        const updated = await adminFetch(`/api/services/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        setServices((prev) => prev.map((s) => (s._id === editingId ? updated : s)));
        toast.success('Service updated');
      } else {
        const created = await adminFetch('/api/services', { method: 'POST', body: JSON.stringify(payload) });
        setServices((prev) => [...prev, created]);
        toast.success('Service created');
      }
      setShowForm(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s) => {
    try {
      const updated = await adminFetch(`/api/services/${s._id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !s.active }),
      });
      setServices((prev) => prev.map((x) => (x._id === s._id ? updated : x)));
      toast.success(updated.active ? 'Service activated' : 'Service hidden');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFeatured = async (s) => {
    try {
      const updated = await adminFetch(`/api/services/${s._id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !s.featured }),
      });
      setServices((prev) => prev.map((x) => (x._id === s._id ? updated : x)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteService = async (s) => {
    if (!window.confirm(`Delete service "${s.name}"?`)) return;
    const wasSelected = selected === s._id;
    setDeletingId(s._id);
    try {
      await adminFetch(`/api/services/${s._id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((x) => x._id !== s._id));
      if (wasSelected) setSelected(null);
      toast.success('Service deleted');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const categoryOptionsAll = ['all', ...categoryOptions];

  const filtered = services
    .filter((s) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        (s.category || '').toLowerCase().includes(term) ||
        (s.description || '').toLowerCase().includes(term);
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && s.active) ||
        (statusFilter === 'hidden' && !s.active) ||
        (statusFilter === 'featured' && s.featured);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        case 'category': return (a.category || '').localeCompare(b.category || '');
        case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'order':
        default: return (a.order || 0) - (b.order || 0);
      }
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/image\//.test(file.type)) {
      toast.warning('Please choose an image file');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Image must be 5MB or smaller');
      e.target.value = '';
      return;
    }
    setUploadingImage(true);
    try {
      const dataUrl = await compressImage(file);
      setForm((f) => ({ ...f, image: dataUrl }));
      setImagePreview(dataUrl);
      toast.success('Image uploaded and saved in the database');
    } catch (error) {
      toast.error(error.message || 'Could not process this image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleOpenNew = () => { setImagePreview(''); openNew(); };
  const handleOpenEdit = (s) => { setImagePreview(s.image || ''); openEdit(s); };

  const active = selected ? services.find((s) => s._id === selected) : null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-4 space-y-3 hover:border-gold/20">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center flex-1 glass-input border border-black/10 rounded-xl overflow-hidden">
            <FiSearch size={15} className="ml-3.5 text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="flex-1 px-3 py-2.5 text-[0.82rem] bg-transparent border-none outline-none text-black"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadServices}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[0.75rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-all duration-300"
            >
              <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={handleOpenNew}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-[0.75rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all duration-300 border-none"
            >
              <FiPlus size={14} /> New Service
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-black/5 pt-3">
          <FilterSelect
            icon={<FiFilter size={13} />}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categoryOptionsAll.map((c) => ({ value: c, label: c === 'all' ? `All Categories (${services.length})` : c }))}
          />
          <FilterSelect
            icon={<FiEye size={13} />}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'hidden', label: 'Hidden' },
              { value: 'featured', label: 'Featured' },
            ]}
          />
          <FilterSelect
            icon={<FiChevronDown size={13} />}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'order', label: 'Sort: Default Order' },
              { value: 'name', label: 'Sort: Name (A–Z)' },
              { value: 'price_asc', label: 'Sort: Price (Low → High)' },
              { value: 'price_desc', label: 'Sort: Price (High → Low)' },
              { value: 'category', label: 'Sort: Category' },
              { value: 'featured', label: 'Sort: Featured First' },
            ]}
          />
          <button
            onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); setSortBy('order'); }}
            className="text-[0.7rem] text-gray-400 hover:text-black underline underline-offset-2 cursor-pointer bg-transparent border-none"
          >
            Clear filters
          </button>
          <span className="ml-auto text-[0.68rem] text-gray-400 whitespace-nowrap">{filtered.length} of {services.length} service{services.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Service list */}
      {loading && !services.length ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-[0.9rem] text-gray-400">No services yet. Create your first service.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Service</th>
                  <th className="hidden md:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold">Category</th>
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold text-right">Price</th>
                  <th className="hidden sm:table-cell px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold text-center">Featured</th>
                  <th className="px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold text-center">Status</th>
                  <th className="w-24 px-4 py-2.5 text-[0.6rem] uppercase tracking-[2px] text-gray-400 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id} onClick={() => setSelected(s._id)} className={`border-b border-black/5 last:border-b-0 hover:bg-white/70 transition-colors duration-150 cursor-pointer ${s.active ? '' : 'opacity-55'}`}>
                    {/* Service */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        {s.image ? (
                          <img src={resolveAssetUrl(s.image)} alt={s.name} className="w-10 h-10 rounded-lg object-cover bg-black/5 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-black/40 font-semibold text-[0.7rem] shrink-0">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[0.8rem] font-medium text-black truncate leading-tight flex items-center gap-1.5">
                            {s.name}
                            {s.featured && <FiStar size={12} className="text-gold fill-gold shrink-0" />}
                          </p>
                          {s.description && <p className="text-[0.62rem] text-gray-400 truncate max-w-[220px]">{s.description}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="hidden md:table-cell px-4 py-2.5">
                      <span className="text-[0.68rem] text-gray-500 uppercase tracking-[1px] bg-black/5 px-2 py-1 rounded-full whitespace-nowrap">{s.category}</span>
                    </td>
                    {/* Price */}
                    <td className="px-4 py-2.5 text-right">
                      <p className="text-[0.82rem] font-bold text-gold whitespace-nowrap">{s.priceFormatted || `RWF ${s.price?.toLocaleString?.() || s.price}`}</p>
                    </td>
                    {/* Featured */}
                    <td className="hidden sm:table-cell px-4 py-2.5 text-center">
                      <button
                        onClick={() => toggleFeatured(s)}
                        disabled={deletingId === s._id}
                        title={s.featured ? 'Remove featured' : 'Mark featured'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.62rem] font-semibold uppercase tracking-[1px] cursor-pointer transition-all border-none ${
                          s.featured ? 'bg-gold/15 text-gold' : 'bg-gray-100 text-gray-500 hover:text-black'
                        }`}
                      >
                        <FiStar size={11} className={s.featured ? 'fill-gold' : ''} /> {s.featured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => toggleActive(s)}
                        disabled={deletingId === s._id}
                        className={`px-2.5 py-1 rounded-lg text-[0.62rem] font-semibold uppercase tracking-[1px] cursor-pointer transition-all border-none ${
                          s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {s.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gold hover:bg-gold/10 cursor-pointer transition-all bg-transparent border-none"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteService(s); }}
                          disabled={deletingId === s._id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 cursor-pointer transition-all bg-transparent border-none"
                        >
                          {deletingId === s._id ? <FiLoader size={14} className="animate-spin" /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 text-[0.85rem]">No services match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />

          <div className="relative w-full sm:max-w-[400px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col animate-fade-in-up">
            {/* Header */}
            <div className="relative bg-gray-950 text-white px-4 py-2.5 shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer z-10"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
              <div className="relative flex items-center gap-2.5">
                {active.image ? (
                  <img src={resolveAssetUrl(active.image)} alt={active.name} className="w-8 h-8 rounded-full bg-white/10 border border-white/15 object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-[0.85rem] font-cormorant font-bold shrink-0">
                    {active.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 pr-6">
                  <h3 className="text-[0.95rem] font-cormorant font-semibold leading-tight truncate">{active.name}</h3>
                  <div className="flex items-center gap-1.5 text-[0.56rem] text-gray-400 mt-px">
                    <span className="text-gold font-medium uppercase tracking-wider">{active.category}</span>
                    {active.featured && <><span className="text-gray-600">·</span><span className="text-gold flex items-center gap-0.5"><FiStar size={10} className="fill-gold" /> Featured</span></>}
                    <span className="text-gray-600">·</span>
                    <span className={active.active ? 'text-emerald-300' : 'text-gray-400'}>{active.active ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-2.5">
                <InfoTile icon={<FiDollarSign size={13} />} label="Price" value={active.priceFormatted || `RWF ${active.price?.toLocaleString?.() || active.price}`} />
                <InfoTile icon={<FiTag size={13} />} label="Category" value={active.category} />
                <InfoTile icon={<FiEye size={13} />} label="Status" value={active.active ? 'Active' : 'Hidden'} />
                <InfoTile icon={<FiList size={13} />} label="Order" value={active.order} />
              </div>

              {active.description && (
                <div className="mb-2.5">
                  <p className="text-[0.58rem] uppercase tracking-[1.5px] text-gray-400 mb-1 flex items-center gap-1.5">
                    <FiList size={11} /> Description
                  </p>
                  <div className="glass-input border border-black/10 rounded-lg px-3 py-2 bg-white/70">
                    <p className="text-[0.78rem] text-gray-700 leading-snug">{active.description}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-t border-black/5 pt-2.5">
                <button
                  onClick={() => { setSelected(null); handleOpenEdit(active); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[0.64rem] font-semibold uppercase tracking-[1px] text-white bg-black hover:bg-gold cursor-pointer transition-all border-none"
                >
                  <FiEdit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => deleteService(active)}
                  disabled={deletingId === active._id}
                  className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg text-[0.64rem] font-semibold uppercase tracking-[1px] text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer disabled:opacity-50 transition-all bg-white"
                >
                  <FiTrash2 size={12} /> {deletingId === active._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[540px] shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-gray-950 text-white px-5 py-3.5 rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,149,106,0.18)_0%,transparent_60%)]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] tracking-[3px] uppercase text-gold font-medium">{editingId ? 'Edit' : 'New'}</p>
                  <h3 className="text-[1.1rem] font-cormorant font-semibold text-white leading-tight">{editingId ? 'Edit Service' : 'Create Service'}</h3>
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-white cursor-pointer bg-transparent border-none text-[1.3rem] leading-none"><FiX /></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className={labelBase}>Service Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputBase} required />
                </div>
                <div>
                  <label className={labelBase}>Price (RWF) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className={inputBase} required min="0" />
                </div>
                <div>
                  <label className={labelBase}>Price Display (optional)</label>
                  <input name="priceFormatted" value={form.priceFormatted} onChange={handleChange} placeholder="e.g. RWF 100,000" className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={`${inputBase} cursor-pointer`}>
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelBase}>Order</label>
                  <input name="order" type="number" value={form.order} onChange={handleChange} className={inputBase} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelBase}>Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/5 border border-black/10 shrink-0 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={resolveAssetUrl(imagePreview)} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-300"><FiImage size={16} /></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-[0.7rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 cursor-pointer transition-all">
                        {uploadingImage ? (
                          <><FiLoader size={14} className="animate-spin" /> Uploading...</>
                        ) : (
                          <><FiUpload size={14} /> Upload Image</>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                      <p className="text-[0.58rem] text-gray-400 mt-1">JPG, PNG, WebP or GIF · max 5MB</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className={labelBase}>...or paste image URL</label>
                    {form.image && form.image.startsWith('data:') ? (
                      <div className={`${inputBase} flex items-center justify-between gap-2 cursor-not-allowed`} title="This image was uploaded and stored in the database.">
                        <span className="text-gray-400 truncate">data:image (stored in database)</span>
                        <button
                          type="button"
                          onClick={() => { setForm((f) => ({ ...f, image: '' })); setImagePreview(''); }}
                          className="text-[0.65rem] text-gray-400 hover:text-red-500 underline underline-offset-2 bg-transparent border-none cursor-pointer shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input name="image" value={form.image} onChange={handleChange} placeholder="/images/example.jpg or https://..." className={inputBase} />
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelBase}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows="2" className={`${inputBase} resize-none`} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mb-4">
                <label className="flex items-center gap-2 text-[0.78rem] text-gray-600 cursor-pointer">
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-[#b8956a]" />
                  Active
                </label>
                <label className="flex items-center gap-2 text-[0.78rem] text-gray-600 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[#b8956a]" />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[0.72rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[0.72rem] font-semibold uppercase tracking-[1px] hover:bg-gold cursor-pointer transition-all border-none disabled:opacity-50">
                  {saving ? <FiLoader size={14} className="animate-spin" /> : null} {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoTile = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5 border-b border-black/5 py-1.5">
    <span className="text-gray-400 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[0.55rem] uppercase tracking-[1px] text-gray-400">{label}</p>
      <p className="text-[0.78rem] text-black font-medium break-words">{value}</p>
    </div>
  </div>
);

const FilterSelect = ({ icon, value, onChange, options }) => (
  <div className="relative flex items-center">
    <span className="absolute left-2.5 text-gray-400 pointer-events-none">{icon}</span>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none pl-7 pr-6 py-2 rounded-lg border border-black/10 bg-white text-[0.7rem] text-gray-600 outline-none cursor-pointer hover:border-gold/40 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <FiChevronDown size={12} className="absolute right-2 text-gray-400 pointer-events-none" />
  </div>
);

// Read a file into a base64 data URL.
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image'));
    reader.readAsDataURL(file);
  });
}

// Resize + compress an image client-side and return a data URL. Storing the
// image as a data URL in MongoDB keeps it persistent (survives backend
// redeploys, unlike the ephemeral uploads/ folder) and host-independent.
const MAX_IMAGE_DIM = 1600;
const JPEG_QUALITY = 0.82;

async function compressImage(file) {
  const original = await readFileAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load this image'));
    img.src = original;
  });

  const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(image.width, image.height));
  const w = Math.round(image.width * scale);
  const h = Math.round(image.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser');
  ctx.drawImage(image, 0, 0, w, h);

  const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const output = canvas.toDataURL(outputMime, JPEG_QUALITY);

  return output.length < original.length ? output : original;
}

export default ServicesAdmin;
