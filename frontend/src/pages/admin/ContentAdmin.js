import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiSave, FiLoader, FiPlus, FiTrash2, FiImage, FiInfo,
  FiTag, FiPhone, FiMail, FiMapPin, FiClock, FiAtSign, FiLink, FiType, FiStar, FiMessageSquare,
  FiMonitor, FiVideo, FiLayers, FiAward, FiPlay,
} from 'react-icons/fi';
import { adminFetch } from '../../utils/adminApi';
import { DEFAULT_CONTENT, DEFAULT_SITE } from '../../utils/content';

const defaultSite = DEFAULT_SITE;

const categoryOptions = ['Brows', 'Lash Lift', 'Lashes', 'Retouch'];
const featuredCategoryOptions = ['BROWS', 'LASHES', 'OTHER'];

const inputBase =
  "w-full px-3 py-2 glass-input border border-black/10 text-[0.8rem] text-black outline-none rounded-lg placeholder:text-gray-400 transition-all duration-200 focus:border-gold/50";
const inputSel = `${inputBase} cursor-pointer`;
const labelBase = "flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[1.2px] text-gray-500 mb-1.5 text-gold";

const ContentAdmin = () => {
  const [tab, setTab] = useState('site');
  const [site, setSite] = useState(defaultSite);
  const [gallery, setGallery] = useState([]);
  const [heroSlides, setHeroSlides] = useState(DEFAULT_CONTENT.heroSlides);
  const [heroStats, setHeroStats] = useState(DEFAULT_CONTENT.heroStats);
  const [homeCategories, setHomeCategories] = useState(DEFAULT_CONTENT.categories);
  const [featured, setFeatured] = useState(DEFAULT_CONTENT.featuredServices);
  const [videos, setVideos] = useState(DEFAULT_CONTENT.videos);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetch('/api/content/all');
        if (data.site) setSite({ ...defaultSite, ...data.site });
        if (Array.isArray(data.gallery) && data.gallery.length) setGallery(data.gallery);
        if (Array.isArray(data.heroSlides) && data.heroSlides.length) setHeroSlides(data.heroSlides);
        if (Array.isArray(data.heroStats) && data.heroStats.length) setHeroStats(data.heroStats);
        if (Array.isArray(data.categories) && data.categories.length) setHomeCategories(data.categories);
        if (Array.isArray(data.featuredServices) && data.featuredServices.length) setFeatured(data.featuredServices);
        if (Array.isArray(data.videos) && data.videos.length) setVideos(data.videos);
      } catch (error) {
        console.error('Could not load content:', error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSiteChange = (e) => setSite({ ...site, [e.target.name]: e.target.value });

  const editAt = (setter, index, field, value) =>
    setter(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
  const addTo = (setter, template) => setter(prev => [...prev, template]);
  const removeAt = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const addHeroSlide = () => addTo(setHeroSlides, { type: 'image', src: '', title: '', subtitle: 'Extreme Beauty Lashes & Brows' });
  const addStat = () => addTo(setHeroStats, { value: '', label: '' });
  const addCategory = () => addTo(setHomeCategories, { name: '', description: '', image: '', category: 'Brows' });
  const addFeatured = () => addTo(setFeatured, { category: 'BROWS', title: '', description: '', image: '' });
  const addVideo = () => addTo(setVideos, { src: '', poster: '' });
  const addGallery = () => addTo(setGallery, '');

  const save = async (key, data) => {
    setSaving(true);
    try {
      await adminFetch('/api/content', {
        method: 'PUT',
        body: JSON.stringify({ key, data }),
      });
      toast.success(`${key} saved successfully`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'live', label: 'Live Content', icon: <FiMonitor size={15} /> },
    { key: 'site', label: 'Site Info', icon: <FiInfo size={15} /> },
    { key: 'gallery', label: 'Gallery / Media', icon: <FiImage size={15} /> },
  ];

  const SaveButton = ({ label, onClick }) => (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white text-[0.68rem] font-semibold uppercase tracking-[1.5px] rounded-lg cursor-pointer transition-all duration-300 hover:bg-gold disabled:opacity-50 w-full sm:w-auto"
    >
      {saving ? <FiLoader size={13} className="animate-spin" /> : <FiSave size={13} />} {label}
    </button>
  );

  const AddButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-[0.68rem] font-semibold uppercase tracking-[1px] text-gray-600 hover:text-gold hover:border-gold/40 transition-all cursor-pointer"
    >
      <FiPlus size={13} /> {children}
    </button>
  );

  const DelButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 border border-red-200 hover:bg-red-50 cursor-pointer transition-all bg-white shrink-0"
    >
      <FiTrash2 size={14} />
    </button>
  );

  const SectionActions = ({ onAdd, onSave, addLabel, saveLabel }) => (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-black/5">
      <AddButton onClick={onAdd}>{addLabel}</AddButton>
      <SaveButton label={saveLabel} onClick={onSave} />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="glass-card rounded-2xl p-1.5 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-semibold uppercase tracking-[1px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
              tab === t.key ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black bg-transparent border-none'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* LIVE CONTENT */}
      {tab === 'live' && (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.6rem] tracking-[3px] uppercase text-gold font-medium">Edit Live Content</p>
                <h3 className="text-[1.05rem] font-cormorant font-semibold text-black leading-tight mt-0.5">Live Site Content</h3>
              </div>
              <p className="text-[0.72rem] text-gray-500 max-w-md">
                Edit what appears live on the public homepage. Updates take effect immediately. Files use paths or uploads (<span className="text-gold">/uploads/...</span>).
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Stats */}
              <section className="border border-black/10 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiAward size={14} /></span>
                    <div>
                      <h4 className="text-[0.85rem] font-medium text-black leading-tight">Hero Stats</h4>
                      <p className="text-[0.62rem] text-gray-400 leading-none mt-0.5">Numbers in the hero section</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-gray-400 font-medium">{heroStats.length}</span>
                </div>
                <div className="space-y-2.5">
                  {heroStats.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <input value={s.value} onChange={(e) => editAt(setHeroStats, i, 'value', e.target.value)} placeholder="500+" className={inputBase} />
                      <input value={s.label} onChange={(e) => editAt(setHeroStats, i, 'label', e.target.value)} placeholder="Happy Clients" className={inputBase} />
                      <DelButton onClick={() => removeAt(setHeroStats, i)} />
                    </div>
                  ))}
                </div>
                <SectionActions onAdd={addStat} onSave={() => save('heroStats', heroStats)} addLabel="Add Stat" saveLabel="Save" />
              </section>

              {/* Hero slides */}
              <section className="border border-black/10 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiMonitor size={14} /></span>
                    <div>
                      <h4 className="text-[0.85rem] font-medium text-black leading-tight">Hero Slides</h4>
                      <p className="text-[0.62rem] text-gray-400 leading-none mt-0.5">{heroSlides.length} rotating slides</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-gray-400 font-medium">{heroSlides.length}</span>
                </div>
                <div className="space-y-2.5">
                  {heroSlides.map((s, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-black/10 rounded-lg p-2.5 bg-white/60">
                      <div>
                        <label className={labelBase}><FiMonitor size={11} /> Type</label>
                        <select value={s.type} onChange={(e) => editAt(setHeroSlides, i, 'type', e.target.value)} className={inputSel}>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelBase}><FiLink size={11} /> Media URL</label>
                        <input value={s.src} onChange={(e) => editAt(setHeroSlides, i, 'src', e.target.value)} placeholder="/images/... or /videos/..." className={inputBase} />
                      </div>
                      <div>
                        <label className={labelBase}><FiType size={11} /> Title</label>
                        <input value={s.title} onChange={(e) => editAt(setHeroSlides, i, 'title', e.target.value)} className={inputBase} />
                      </div>
                      <div>
                        <label className={labelBase}><FiType size={11} /> Subtitle</label>
                        <input value={s.subtitle} onChange={(e) => editAt(setHeroSlides, i, 'subtitle', e.target.value)} className={inputBase} />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between gap-2 border-t border-black/5 pt-2">
                        {s.src ? (
                          <div className="h-12 w-20 rounded-lg overflow-hidden border border-black/10 bg-black/5 shrink-0">
                            {s.type === 'video' ? (
                              <video src={s.src} muted className="w-full h-full object-cover" />
                            ) : (
                              <img src={s.src} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                        ) : <span className="text-[0.62rem] text-gray-300">No preview</span>}
                        <DelButton onClick={() => removeAt(setHeroSlides, i)} />
                      </div>
                    </div>
                  ))}
                </div>
                <SectionActions onAdd={addHeroSlide} onSave={() => save('heroSlides', heroSlides)} addLabel="Add Slide" saveLabel="Save" />
              </section>

              {/* Categories */}
              <section className="border border-black/10 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiLayers size={14} /></span>
                    <div>
                      <h4 className="text-[0.85rem] font-medium text-black leading-tight">Service Categories</h4>
                      <p className="text-[0.62rem] text-gray-400 leading-none mt-0.5">{homeCategories.length} categories on homepage</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-gray-400 font-medium">{homeCategories.length}</span>
                </div>
                <div className="space-y-2.5">
                  {homeCategories.map((c, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-black/10 rounded-lg p-2.5 bg-white/60">
                      <div className="sm:col-span-2">
                        <label className={labelBase}><FiImage size={11} /> Image URL</label>
                        <input value={c.image} onChange={(e) => editAt(setHomeCategories, i, 'image', e.target.value)} placeholder="/images/..." className={inputBase} />
                      </div>
                      <div>
                        <label className={labelBase}><FiType size={11} /> Name</label>
                        <input value={c.name} onChange={(e) => editAt(setHomeCategories, i, 'name', e.target.value)} className={inputBase} />
                      </div>
                      <div>
                        <label className={labelBase}><FiTag size={11} /> Category</label>
                        <select value={c.category || 'Brows'} onChange={(e) => editAt(setHomeCategories, i, 'category', e.target.value)} className={inputSel}>
                          {categoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-end gap-2 sm:col-span-2">
                        <div className="flex-1">
                          <label className={labelBase}><FiType size={11} /> Description</label>
                          <input value={c.description} onChange={(e) => editAt(setHomeCategories, i, 'description', e.target.value)} className={inputBase} />
                        </div>
                        <DelButton onClick={() => removeAt(setHomeCategories, i)} />
                      </div>
                    </div>
                  ))}
                </div>
                <SectionActions onAdd={addCategory} onSave={() => save('categories', homeCategories)} addLabel="Add Category" saveLabel="Save" />
              </section>

              {/* Featured services */}
              <section className="border border-black/10 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiStar size={14} /></span>
                    <div>
                      <h4 className="text-[0.85rem] font-medium text-black leading-tight">Featured Services</h4>
                      <p className="text-[0.62rem] text-gray-400 leading-none mt-0.5">{featured.length} handpicked treatments</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-gray-400 font-medium">{featured.length}</span>
                </div>
                <div className="space-y-2.5">
                  {featured.map((f, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-black/10 rounded-lg p-2.5 bg-white/60">
                      <div className="sm:col-span-2 flex items-center gap-2.5">
                        {f.image ? (
                          <img src={f.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-black/10 bg-black/5 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-black/5 text-gray-300 shrink-0"><FiImage size={16} /></div>
                        )}
                        <div className="flex-1">
                          <label className={labelBase}><FiImage size={11} /> Image URL</label>
                          <input value={f.image} onChange={(e) => editAt(setFeatured, i, 'image', e.target.value)} placeholder="/images/..." className={inputBase} />
                        </div>
                      </div>
                      <div>
                        <label className={labelBase}><FiType size={11} /> Title</label>
                        <input value={f.title} onChange={(e) => editAt(setFeatured, i, 'title', e.target.value)} className={inputBase} />
                      </div>
                      <div>
                        <label className={labelBase}><FiTag size={11} /> Category</label>
                        <select value={f.category || 'BROWS'} onChange={(e) => editAt(setFeatured, i, 'category', e.target.value)} className={inputSel}>
                          {featuredCategoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-end gap-2 sm:col-span-2">
                        <div className="flex-1">
                          <label className={labelBase}><FiType size={11} /> Description</label>
                          <textarea value={f.description} onChange={(e) => editAt(setFeatured, i, 'description', e.target.value)} rows="2" className={inputBase} />
                        </div>
                        <DelButton onClick={() => removeAt(setFeatured, i)} />
                      </div>
                    </div>
                  ))}
                </div>
                <SectionActions onAdd={addFeatured} onSave={() => save('featuredServices', featured)} addLabel="Add Featured" saveLabel="Save" />
              </section>

              {/* Video reel */}
              <section className="border border-black/10 rounded-xl p-4 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiVideo size={14} /></span>
                    <div>
                      <h4 className="text-[0.85rem] font-medium text-black leading-tight">Featured Videos</h4>
                      <p className="text-[0.62rem] text-gray-400 leading-none mt-0.5">{videos.length} videos in the homepage reel</p>
                    </div>
                  </div>
                  <span className="text-[0.62rem] text-gray-400 font-medium">{videos.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {videos.map((v, i) => (
                    <div key={i} className="border border-black/10 rounded-lg p-2.5 bg-white/60 space-y-2">
                      <div>
                        <label className={labelBase}><FiVideo size={11} /> Video URL</label>
                        <input value={v.src} onChange={(e) => editAt(setVideos, i, 'src', e.target.value)} placeholder="/videos/..." className={inputBase} />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className={labelBase}><FiImage size={11} /> Poster URL</label>
                          <input value={v.poster} onChange={(e) => editAt(setVideos, i, 'poster', e.target.value)} placeholder="/images/..." className={inputBase} />
                        </div>
                        <DelButton onClick={() => removeAt(setVideos, i)} />
                      </div>
                    </div>
                  ))}
                </div>
                <SectionActions onAdd={addVideo} onSave={() => save('videos', videos)} addLabel="Add Video" saveLabel="Save" />
              </section>
            </div>
          </div>
        </div>
      )}

      {/* SITE INFO */}
      {tab === 'site' && (
        <div className="glass-card rounded-2xl p-5 sm:p-6 hover:border-gold/20">
          <div className="mb-6 pb-3 border-b border-black/5">
            <p className="text-[0.6rem] tracking-[3px] uppercase text-gold font-medium">Contact & Location</p>
            <h3 className="text-[1.05rem] font-cormorant font-semibold text-black leading-tight mt-0.5">Site Information</h3>
          </div>
          <p className="text-[0.75rem] text-gray-500 mb-5">These details appear on the public footer, navbar and contact page. Save to update them across the site.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <section className="border border-black/10 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/5">
                <span className="w-6 h-6 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiTag size={13} /></span>
                <h4 className="text-[0.82rem] font-medium text-black leading-none">Business</h4>
              </div>
              <div>
                <label className={labelBase}><FiType size={12} /> Business Name</label>
                <input name="name" value={site.name} onChange={handleSiteChange} className={inputBase} />
              </div>
            </section>

            <section className="border border-black/10 rounded-xl p-3.5 bg-white shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/5">
                <span className="w-6 h-6 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiPhone size={13} /></span>
                <h4 className="text-[0.82rem] font-medium text-black leading-none">Contact</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}><FiPhone size={12} /> Phone 1</label>
                  <input name="phone1" value={site.phone1} onChange={handleSiteChange} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}><FiMessageSquare size={12} /> WhatsApp Number</label>
                  <input name="phone2" value={site.phone2} onChange={handleSiteChange} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}><FiMail size={12} /> Email</label>
                  <input name="email" value={site.email} onChange={handleSiteChange} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}><FiAtSign size={12} /> Instagram</label>
                  <input name="instagram" value={site.instagram} onChange={handleSiteChange} className={inputBase} />
                </div>
              </div>
            </section>

            <section className="border border-black/10 rounded-xl p-3.5 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-black/5">
                <span className="w-6 h-6 rounded-lg bg-black text-gold flex items-center justify-center shrink-0"><FiMapPin size={13} /></span>
                <h4 className="text-[0.82rem] font-medium text-black leading-none">Location & Hours</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className={labelBase}><FiMapPin size={12} /> Address</label>
                  <input name="address" value={site.address} onChange={handleSiteChange} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}><FiClock size={12} /> Working Hours</label>
                  <input name="workingHours" value={site.workingHours} onChange={handleSiteChange} className={inputBase} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelBase}><FiLink size={12} /> Google Maps URL</label>
                  <input name="mapsUrl" value={site.mapsUrl} onChange={handleSiteChange} className={inputBase} />
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end border-t border-black/5 pt-5">
            <SaveButton label="Save Site Info" onClick={() => save('site', site)} />
          </div>
        </div>
      )}

      {/* GALLERY */}
      {tab === 'gallery' && (
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="mb-3 pb-3 border-b border-black/5">
            <p className="text-[0.6rem] tracking-[3px] uppercase text-gold font-medium">Media</p>
            <h3 className="text-[1.05rem] font-cormorant font-semibold text-black leading-tight mt-0.5">Gallery / Media</h3>
          </div>
          <p className="text-[0.75rem] text-gray-500 mb-4">Manage the homepage gallery carousel images ({gallery.length} images). These feed the carousel on the public homepage.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
            {gallery.map((url, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 border border-black/10 rounded-xl bg-white shadow-sm">
                {url ? (
                  <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover border border-black/10 bg-black/5 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-black/5 text-gray-300 shrink-0"><FiImage size={16} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <label className={labelBase}><FiLink size={10} /> Image URL</label>
                  <input value={url} onChange={(e) => setGallery(gallery.map((u, j) => j === i ? e.target.value : u))} placeholder="/images/..." className={inputBase} />
                </div>
                <span className="text-[0.6rem] text-gray-400 shrink-0">#{i + 1}</span>
                <DelButton onClick={() => removeAt(setGallery, i)} />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/5 pt-3">
            <AddButton onClick={addGallery}>Add Image</AddButton>
            <SaveButton label="Save Gallery" onClick={() => save('gallery', gallery)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAdmin;
