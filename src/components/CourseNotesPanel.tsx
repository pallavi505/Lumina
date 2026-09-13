import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  X, 
  Plus, 
  Clock, 
  Play, 
  Trash2, 
  Edit3, 
  Check, 
  Cloud, 
  CloudCheck, 
  Download, 
  Copy, 
  Search, 
  Tag, 
  ChevronDown,
  Minimize2,
  Maximize2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import type { CourseNote, Chapter, AICourse, DemoAccount } from '../types';
import { 
  fetchCourseNotes, 
  saveNote, 
  deleteNote, 
  subscribeToCourseNotes, 
  formatSecondsToTimestamp, 
  parseTimestampToSeconds 
} from '../lib/notesService';

interface CourseNotesPanelProps {
  course: AICourse;
  currentChapter: Chapter;
  activeChapterIndex: number;
  currentUser: DemoAccount | null;
  onSeekVideo?: (seconds: number, chapterIndex?: number) => void;
  currentVideoElapsedSeconds?: number;
}

const NOTE_TAGS = ['Insight', 'Key Takeaway', 'Question', 'Exam Focus', 'Code Reference', 'Research'];

export default function CourseNotesPanel({
  course,
  currentChapter,
  activeChapterIndex,
  currentUser,
  onSeekVideo,
  currentVideoElapsedSeconds = 0
}: CourseNotesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  
  // Note input state
  const [noteText, setNoteText] = useState('');
  const [timestampInput, setTimestampInput] = useState('00:00');
  const [selectedTag, setSelectedTag] = useState<string>('Insight');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editTimestamp, setEditTimestamp] = useState('');

  // Filtering & search
  const [filterMode, setFilterMode] = useState<'current' | 'all'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Auto-sync timestamp with video elapsed time when user opens input
  const userId = currentUser?.id || 'demo_scholar';

  // Load and subscribe to notes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Initial fetch
    fetchCourseNotes(userId, course.id).then((fetched) => {
      if (isMounted) {
        setNotes(fetched);
        setIsLoading(false);
      }
    });

    // Real-time subscription
    const unsubscribe = subscribeToCourseNotes(userId, course.id, (updated) => {
      if (isMounted) {
        setNotes(updated);
        setSyncStatus('synced');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId, course.id]);

  // Update timestamp input when video elapsed time updates and input was untouched
  const handleCaptureCurrentTime = () => {
    const formatted = formatSecondsToTimestamp(currentVideoElapsedSeconds);
    setTimestampInput(formatted);
  };

  // Adjust timestamp input by +/- seconds
  const handleNudgeTimestamp = (deltaSeconds: number) => {
    const currentSec = parseTimestampToSeconds(timestampInput);
    const newSec = Math.max(0, currentSec + deltaSeconds);
    setTimestampInput(formatSecondsToTimestamp(newSec));
  };

  // Save new note
  const handleSaveNote = async () => {
    if (!noteText.trim()) return;

    setSyncStatus('saving');
    const sec = parseTimestampToSeconds(timestampInput);
    const formattedTime = formatSecondsToTimestamp(sec);

    const newNote: CourseNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      courseId: course.id,
      chapterId: currentChapter.id,
      chapterIndex: activeChapterIndex,
      chapterTitle: currentChapter.title,
      timestamp: formattedTime,
      timestampSeconds: sec,
      text: selectedTag ? `[${selectedTag}] ${noteText.trim()}` : noteText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveNote(newNote);
      setNoteText('');
      // Advance timestamp slightly or keep
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Error saving note:', err);
      setSyncStatus('offline');
    }
  };

  // Update existing note
  const handleUpdateNote = async (noteId: string) => {
    if (!editText.trim()) return;

    setSyncStatus('saving');
    const existing = notes.find(n => n.id === noteId);
    if (!existing) return;

    const sec = parseTimestampToSeconds(editTimestamp || existing.timestamp);
    const updated: CourseNote = {
      ...existing,
      text: editText.trim(),
      timestamp: formatSecondsToTimestamp(sec),
      timestampSeconds: sec,
      updatedAt: new Date().toISOString()
    };

    try {
      await saveNote(updated);
      setEditingNoteId(null);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Error updating note:', err);
      setSyncStatus('offline');
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    setSyncStatus('saving');
    try {
      await deleteNote(noteId);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Error deleting note:', err);
      setSyncStatus('offline');
    }
  };

  // Copy notes to clipboard as Markdown
  const handleCopyAllNotes = () => {
    if (notes.length === 0) return;

    const mdLines = [
      `# Study Notes: ${course.title}`,
      `**Scholar**: ${currentUser?.name || 'Scholar'}`,
      `**Export Date**: ${new Date().toLocaleDateString()}`,
      '',
      ...notes.map(n => 
        `### [${n.timestamp}] Chapter ${n.chapterIndex + 1}: ${n.chapterTitle}\n${n.text}\n`
      )
    ];

    navigator.clipboard.writeText(mdLines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  // Download notes as Markdown file
  const handleDownloadNotes = () => {
    if (notes.length === 0) return;

    const mdContent = [
      `# Study Notes: ${course.title}`,
      `**Scholar**: ${currentUser?.name || 'Scholar'}`,
      `**Course**: ${course.title}`,
      `**Category**: ${course.category} (${course.level})`,
      `**Date**: ${new Date().toLocaleString()}`,
      '\n---\n',
      ...notes.map(n => 
        `#### [${n.timestamp}] Ch ${n.chapterIndex + 1}: ${n.chapterTitle}\n\n${n.text}\n\n*Created: ${new Date(n.createdAt).toLocaleTimeString()}*\n`
      )
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter notes based on chapter and search query
  const filteredNotes = notes.filter(n => {
    const matchesChapter = filterMode === 'all' || n.chapterId === currentChapter.id;
    const matchesQuery = searchQuery === '' || 
      n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.timestamp.includes(searchQuery);
    return matchesChapter && matchesQuery;
  });

  const currentChapterNotesCount = notes.filter(n => n.chapterId === currentChapter.id).length;

  return (
    <>
      {/* Floating Action Button Trigger */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            handleCaptureCurrentTime();
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-zinc-900/95 hover:bg-zinc-800 text-white border border-[#40e3bd]/40 hover:border-[#40e3bd] shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-[#40e3bd]/15 flex items-center justify-center text-[#40e3bd] group-hover:bg-[#40e3bd] group-hover:text-[#052219] transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            {notes.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#40e3bd] text-[#052219] text-[10px] font-extrabold flex items-center justify-center font-mono shadow-sm">
                {notes.length}
              </span>
            )}
          </div>

          <div className="text-left">
            <div className="text-xs font-bold font-['Space_Grotesk'] text-white flex items-center gap-1.5">
              <span>Lecture Notes</span>
              <span className="w-2 h-2 rounded-full bg-[#40e3bd] animate-pulse" />
            </div>
            <div className="text-[10px] text-zinc-400">
              {currentChapterNotesCount} on this chapter
            </div>
          </div>
        </motion.button>
      )}

      {/* Floating Notes Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '620px'
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={`fixed bottom-6 right-4 sm:right-6 z-40 w-[94vw] sm:w-[420px] max-w-[460px] bg-[#0c0e14]/95 border border-zinc-700/80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden text-white`}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[#40e3bd]/15 flex items-center justify-center text-[#40e3bd] shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                      Lecture Notes
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                      {notes.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    {syncStatus === 'saving' ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Cloud className="w-3 h-3 animate-spin" />
                        Syncing...
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CloudCheck className="w-3 h-3 text-[#40e3bd]" />
                        Synced to Firestore
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Export Markdown */}
                <button
                  onClick={handleCopyAllNotes}
                  title="Copy All as Markdown"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleDownloadNotes}
                  title="Download .md Study Guide"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Minimize / Expand */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Panel"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If minimized, only show a compact summary bar */}
            {isMinimized ? (
              <div className="p-3 flex items-center justify-between text-xs text-zinc-400">
                <span>{notes.length} total notes recorded</span>
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-[#40e3bd] hover:underline font-semibold cursor-pointer"
                >
                  Expand Notes
                </button>
              </div>
            ) : (
              <>
                {/* Note Creation Form */}
                <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/40 space-y-2.5 shrink-0">
                  <div className="flex items-center justify-between gap-2">
                    {/* Timestamp stepper */}
                    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1 text-xs">
                      <Clock className="w-3 h-3 text-[#40e3bd] shrink-0" />
                      <input
                        type="text"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                        placeholder="00:00"
                        className="w-12 bg-transparent text-white font-mono text-xs focus:outline-none text-center"
                      />
                      <div className="flex items-center gap-0.5 border-l border-zinc-700/60 pl-1 ml-0.5">
                        <button
                          type="button"
                          onClick={() => handleNudgeTimestamp(-15)}
                          title="Rewind 15s"
                          className="px-1 py-0.5 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                        >
                          -15s
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNudgeTimestamp(15)}
                          title="Forward 15s"
                          className="px-1 py-0.5 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                        >
                          +15s
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCaptureCurrentTime}
                      className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-[11px] text-[#40e3bd] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sync Video Time</span>
                    </button>
                  </div>

                  {/* Tag quick-chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    {NOTE_TAGS.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                        className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                          selectedTag === t 
                            ? 'bg-[#40e3bd]/20 text-[#40e3bd] border border-[#40e3bd]/40 font-medium' 
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent'
                        }`}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>

                  {/* Note textarea */}
                  <div className="relative">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveNote();
                        }
                      }}
                      placeholder={`Add timestamped note for Ch ${activeChapterIndex + 1}... (Press Ctrl+Enter to save)`}
                      rows={2}
                      className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#40e3bd]/60 focus:ring-1 focus:ring-[#40e3bd]/30 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none resize-none transition-all"
                    />
                  </div>

                  {/* Add note button */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 truncate max-w-[220px]">
                      Ch {activeChapterIndex + 1}: {currentChapter.title}
                    </span>
                    <button
                      type="button"
                      disabled={!noteText.trim()}
                      onClick={handleSaveNote}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#40e3bd] to-[#20b892] text-[#052219] font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 shadow-sm transition-all cursor-pointer hover:from-[#5ef8d5]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="px-3.5 py-2 border-b border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFilterMode('current')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        filterMode === 'current'
                          ? 'bg-zinc-800 text-[#40e3bd] font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      This Chapter ({currentChapterNotesCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        filterMode === 'all'
                          ? 'bg-zinc-800 text-[#40e3bd] font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      All Chapters ({notes.length})
                    </button>
                  </div>

                  {/* Search filter */}
                  <div className="relative flex-1 max-w-[150px]">
                    <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-lg pl-6 pr-2 py-1 text-[11px] text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#40e3bd]/50"
                    />
                  </div>
                </div>

                {/* Notes List Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {isLoading ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#40e3bd] rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-zinc-500 font-mono">Loading notes from Firestore...</p>
                    </div>
                  ) : filteredNotes.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-400">
                        {searchQuery ? 'No notes match your search' : 'No notes recorded for this chapter yet'}
                      </p>
                      <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                        Type an insight or concept above with a timestamp to bookmark important video moments.
                      </p>
                    </div>
                  ) : (
                    filteredNotes.map((note) => {
                      const isEditing = editingNoteId === note.id;

                      return (
                        <div
                          key={note.id}
                          className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-2 group"
                        >
                          {/* Note Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Clickable timestamp pill that seeks video */}
                              <button
                                type="button"
                                onClick={() => onSeekVideo?.(note.timestampSeconds, note.chapterIndex)}
                                title={`Jump video to ${note.timestamp}`}
                                className="px-2 py-0.5 rounded-lg bg-[#40e3bd]/15 hover:bg-[#40e3bd] text-[#40e3bd] hover:text-[#052219] font-mono text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer group/pill"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>{note.timestamp}</span>
                              </button>

                              <span className="text-[10px] text-zinc-400 truncate max-w-[170px]">
                                Ch {note.chapterIndex + 1}: {note.chapterTitle}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isEditing) {
                                    setEditingNoteId(null);
                                  } else {
                                    setEditingNoteId(note.id);
                                    setEditText(note.text);
                                    setEditTimestamp(note.timestamp);
                                  }
                                }}
                                title="Edit note"
                                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Delete note"
                                className="p-1 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Note Text or Edit Field */}
                          {isEditing ? (
                            <div className="space-y-2 pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-400">Timestamp:</span>
                                <input
                                  type="text"
                                  value={editTimestamp}
                                  onChange={(e) => setEditTimestamp(e.target.value)}
                                  className="w-16 bg-zinc-950 border border-zinc-700 rounded px-2 py-0.5 text-xs font-mono text-white"
                                />
                              </div>
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={2}
                                className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#40e3bd] rounded-lg p-2 text-xs text-white focus:outline-none resize-none"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateNote(note.id)}
                                  className="px-3 py-1 bg-[#40e3bd] text-[#052219] font-bold text-[11px] rounded-lg cursor-pointer"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap pl-1">
                              {note.text}
                            </div>
                          )}

                          {/* Created at footer */}
                          <div className="text-[9px] text-zinc-500 font-mono pl-1">
                            {new Date(note.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })} at {new Date(note.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer status */}
                <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[10px] text-zinc-400 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#40e3bd]" />
                    Click any timestamp pill to jump video
                  </span>
                  <span className="font-mono text-zinc-500">Firestore DB</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
