import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderPlus, 
  UploadCloud, 
  Video, 
  FileText, 
  Presentation, 
  Database, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Trash2, 
  ExternalLink, 
  Eye, 
  MoreVertical, 
  Tag, 
  Clock, 
  Download, 
  Folder, 
  Sparkles,
  Layers,
  CheckCircle2,
  X,
  PlayCircle
} from 'lucide-react';
import type { CourseMaterial, MaterialType } from '../../types';
import { INITIAL_COURSE_MATERIALS } from '../../data/trainerData';

interface MaterialLibraryManagerProps {
  materials?: CourseMaterial[];
  isLoading?: boolean;
  onMaterialAdded?: (material: CourseMaterial) => void;
  onUploadMaterial?: (material: Omit<CourseMaterial, 'id' | 'uploadedAt' | 'downloadsCount'> & { id?: string }) => Promise<CourseMaterial>;
  onDeleteMaterial?: (id: string) => Promise<void>;
}

export default function MaterialLibraryManager({ 
  materials: propMaterials,
  isLoading = false,
  onMaterialAdded,
  onUploadMaterial,
  onDeleteMaterial 
}: MaterialLibraryManagerProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>(propMaterials || INITIAL_COURSE_MATERIALS);

  React.useEffect(() => {
    if (propMaterials && propMaterials.length > 0) {
      setMaterials(propMaterials);
    }
  }, [propMaterials]);

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Material form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MaterialType>('video');
  const [newModuleId, setNewModuleId] = useState('mod-1');
  const [newDurationOrPages, setNewDurationOrPages] = useState('35 mins');
  const [newTags, setNewTags] = useState('National Accounts, Official Statistics');
  const [newStatus, setNewStatus] = useState<'published' | 'draft'>('published');
  const [newUrl, setNewUrl] = useState('');

  // Course modules definition
  const courseModules = [
    { id: 'mod-1', title: 'Module 1: National Accounts & Macro Aggregates', course: 'National Accounts Statistics' },
    { id: 'mod-2', title: 'Module 2: Survey Sampling & Field CAPI Telemetry', course: 'Modern Survey Sampling' },
    { id: 'mod-3', title: 'Module 3: Price Indices & Inflation Forecasting', course: 'Consumer Price Index' },
    { id: 'mod-4', title: 'Module 4: Applied AI & Machine Learning for Official Data', course: 'AI & Machine Learning' },
  ];

  // Filtering materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const matchModule = selectedModule === 'all' || item.moduleId === selectedModule;
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchModule && matchType && matchSearch;
    });
  }, [materials, selectedModule, selectedType, searchQuery]);

  // Counts by type
  const typeCounts = useMemo(() => {
    return {
      all: materials.length,
      video: materials.filter(m => m.type === 'video').length,
      presentation: materials.filter(m => m.type === 'presentation').length,
      document: materials.filter(m => m.type === 'document').length,
      dataset: materials.filter(m => m.type === 'dataset').length,
    };
  }, [materials]);

  // Handle Add Material
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const moduleObj = courseModules.find(m => m.id === newModuleId);

    const payload = {
      title: newTitle.trim(),
      type: newType,
      moduleId: newModuleId,
      moduleTitle: moduleObj?.title || 'General Course Materials',
      courseId: 'crs-custom',
      courseTitle: moduleObj?.course || 'Official Statistical Training',
      durationOrPages: newDurationOrPages || (newType === 'video' ? '30 mins' : '20 pages'),
      fileSize: newType === 'video' ? '280 MB' : '4.5 MB',
      status: newStatus,
      author: 'Dr. Julian Hayes (Master Trainer)',
      url: newUrl || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      let savedMat: CourseMaterial;
      if (onUploadMaterial) {
        savedMat = await onUploadMaterial(payload);
      } else {
        savedMat = {
          ...payload,
          id: `mat-${Date.now()}`,
          uploadedAt: 'Just now',
          downloadsCount: 0
        };
      }

      setMaterials(prev => [savedMat, ...prev]);
      if (onMaterialAdded) onMaterialAdded(savedMat);

      // Reset Form & Close
      setNewTitle('');
      setNewUrl('');
      setIsUploadModalOpen(false);
      setActionNotice('Learning asset uploaded to Firestore curriculum repository.');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      setActionNotice(`Upload failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      if (onDeleteMaterial) {
        await onDeleteMaterial(id);
      }
      setMaterials(prev => prev.filter(m => m.id !== id));
      if (previewMaterial?.id === id) setPreviewMaterial(null);
      setActionNotice('Curricular asset removed from repository.');
      setTimeout(() => setActionNotice(null), 2500);
    } catch (err) {
      setActionNotice(`Delete failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleReassignModule = (matId: string, targetModuleId: string) => {
    const modObj = courseModules.find(m => m.id === targetModuleId);
    if (!modObj) return;

    setMaterials(prev => prev.map(m => {
      if (m.id !== matId) return m;
      return {
        ...m,
        moduleId: targetModuleId,
        moduleTitle: modObj.title,
        courseTitle: modObj.course
      };
    }));
  };

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'presentation':
        return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'dataset':
        return <Database className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getTypeBadgeClass = (type: MaterialType) => {
    switch (type) {
      case 'video':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'presentation':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'document':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'dataset':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header & Main Upload Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Module 2: Material Library Manager
            </span>
            <span className="text-zinc-500 text-xs font-mono">Curriculum Assets Repository</span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
            Curriculum Material Library & Module Organizer
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl mt-1">
            Upload recorded lectures, slide decks, syllabus manuals, and validation code datasets. Structure content directly into accredited course modules for trainee access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#40e3bd] hover:bg-[#a3f7e2] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(64,227,189,0.25)]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {/* Module Organizer Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Course Module Hierarchy:
          </span>
          <span className="text-xs font-mono text-[#40e3bd]">
            {filteredMaterials.length} Resources in View
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedModule('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedModule === 'all'
                ? 'bg-[#40e3bd] text-[#052219] shadow-md font-bold'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Modules ({materials.length})</span>
          </button>

          {courseModules.map((mod) => {
            const count = materials.filter(m => m.moduleId === mod.id).length;
            const isSelected = selectedModule === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#40e3bd]/20 border border-[#40e3bd] text-[#40e3bd]'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{mod.title.split(':')[0]}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#40e3bd] text-[#052219]' : 'bg-zinc-800 text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Resource Types & Search */}
      <div className="p-4 rounded-2xl bg-[#111318]/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedType === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Types ({typeCounts.all})
          </button>
          <button
            onClick={() => setSelectedType('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'video' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-3 h-3 text-rose-400" />
            <span>Lectures ({typeCounts.video})</span>
          </button>
          <button
            onClick={() => setSelectedType('presentation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'presentation' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Presentation className="w-3 h-3 text-amber-400" />
            <span>Slides ({typeCounts.presentation})</span>
          </button>
          <button
            onClick={() => setSelectedType('document')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'document' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3 h-3 text-blue-400" />
            <span>Docs ({typeCounts.document})</span>
          </button>
          <button
            onClick={() => setSelectedType('dataset')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedType === 'dataset' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Data/Code ({typeCounts.dataset})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material title or tags..."
            className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]"
          />
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-[#40e3bd]/10 border border-[#40e3bd]/30 text-xs font-semibold text-[#40e3bd] flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-zinc-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Materials Grid */}
      {isLoading ? (
        <div className="p-16 text-center rounded-2xl bg-[#111318]/60 border border-zinc-800 space-y-4">
          <div className="w-10 h-10 border-2 border-[#40e3bd] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#40e3bd]">
            Fetching curricular assets from Firestore...
          </p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#111318]/60 border border-dashed border-zinc-800 space-y-3">
          <Folder className="w-8 h-8 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-semibold text-zinc-300">No Learning Materials Found</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or click "Upload New Material" to add resources to this module.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-[#111318]/90 border border-zinc-800 hover:border-zinc-700 shadow-lg flex flex-col justify-between space-y-4 group transition-all"
            >
              {/* Card Top: Type & Module Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border flex items-center gap-1.5 ${getTypeBadgeClass(item.type)}`}>
                    {getTypeIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    item.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-[#40e3bd] transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <Folder className="w-3 h-3 text-[#40e3bd] shrink-0" />
                  <span className="truncate">{item.moduleTitle}</span>
                </p>
              </div>

              {/* Card Metadata (Duration / Size / Downloads) */}
              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {item.durationOrPages}
                  </span>
                  <span>{item.fileSize}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Download className="w-3 h-3 text-zinc-500" />
                    {item.downloadsCount} dl
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 flex-wrap">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Reassign Module Dropdown & Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
                  <select
                    value={item.moduleId}
                    onChange={(e) => handleReassignModule(item.id, e.target.value)}
                    className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300 focus:outline-none focus:border-[#40e3bd] max-w-[150px] truncate"
                    title="Reassign to another course module"
                  >
                    {courseModules.map((m) => (
                      <option key={m.id} value={m.id}>{m.title.split(':')[0]}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewMaterial(item)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-[#40e3bd]/20 border border-zinc-800 hover:border-[#40e3bd]/50 text-zinc-300 hover:text-[#40e3bd] transition-colors cursor-pointer"
                      title="Preview Material"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(item.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal Drawer */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#111318] border border-zinc-800 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#40e3bd]" />
                  <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                    Upload & Organize Course Material
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMaterial} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Material Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Double Deflation & Supply-Use Balancing Workshop"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Resource Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as MaterialType)}
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                    >
                      <option value="video">Recorded Lecture (Video)</option>
                      <option value="presentation">Presentation (Slides)</option>
                      <option value="document">Official Document (PDF)</option>
                      <option value="dataset">Dataset / Code Notebook</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Assign To Module
                    </label>
                    <select
                      value={newModuleId}
                      onChange={(e) => setNewModuleId(e.target.value)}
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                    >
                      {courseModules.map((m) => (
                        <option key={m.id} value={m.id}>{m.title.split(':')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Duration / Pages
                    </label>
                    <input
                      type="text"
                      value={newDurationOrPages}
                      onChange={(e) => setNewDurationOrPages(e.target.value)}
                      placeholder="e.g. 45 mins or 32 pages"
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Publish Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                    >
                      <option value="published">Published (Visible to Trainees)</option>
                      <option value="draft">Draft (Faculty Only)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="SNA 2008, Macroeconomics, CPI"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#40e3bd]"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#40e3bd] hover:bg-[#a3f7e2] text-[#052219] font-bold text-xs font-['Space_Grotesk'] transition-all cursor-pointer shadow-md"
                  >
                    Save & Add to Module
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Material Preview Modal */}
      <AnimatePresence>
        {previewMaterial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-[#111318] border border-zinc-800 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  {getTypeIcon(previewMaterial.type)}
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    {previewMaterial.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {previewMaterial.type === 'video' ? (
                <div className="w-full aspect-video rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <PlayCircle className="w-12 h-12 text-[#40e3bd]" />
                  <p className="text-xs text-zinc-300 font-semibold">
                    Recorded Video Lecture Player
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Stream duration: {previewMaterial.durationOrPages} • Format: MP4 / GovCloud CDN
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-[#40e3bd] text-xs font-mono">
                    <FileText className="w-4 h-4" />
                    <span>Official Course Pack Documentation</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    This document is officially archived in <strong>{previewMaterial.moduleTitle}</strong>. Trainees enrolled in this track have direct offline and online read access.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                    <span>Size: {previewMaterial.fileSize}</span>
                    <span>Pages: {previewMaterial.durationOrPages}</span>
                    <span>Author: {previewMaterial.author}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
