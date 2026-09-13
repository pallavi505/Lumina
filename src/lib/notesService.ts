import { db, doc, setDoc, deleteDoc, collection, getDocs, query, where, onSnapshot } from './firebase';
import type { CourseNote } from '../types';

const LOCAL_NOTES_KEY = 'lumina_course_notes';

// Helper to get locally stored notes
export function getLocalNotes(): CourseNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read local notes:', err);
    return [];
  }
}

// Helper to save locally
export function saveLocalNotes(notes: CourseNote[]) {
  try {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Could not save local notes:', err);
  }
}

// Fetch all notes for a user in a specific course
export async function fetchCourseNotes(userId: string, courseId: string): Promise<CourseNote[]> {
  const localList = getLocalNotes().filter(n => n.userId === userId && n.courseId === courseId);
  let firestoreList: CourseNote[] = [];

  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      firestoreList = snap.docs.map(d => d.data() as CourseNote);
    }
  } catch (err) {
    console.warn('Firestore fetch notes warning (using local fallback):', err);
  }

  // Merge unique notes by id
  const map = new Map<string, CourseNote>();
  for (const n of localList) {
    map.set(n.id, n);
  }
  for (const n of firestoreList) {
    map.set(n.id, n);
  }

  const merged = Array.from(map.values()).sort((a, b) => {
    // Sort by chapter index first, then timestampSeconds
    if (a.chapterIndex !== b.chapterIndex) {
      return a.chapterIndex - b.chapterIndex;
    }
    return a.timestampSeconds - b.timestampSeconds;
  });

  // Update local cache
  const allLocal = getLocalNotes().filter(n => !(n.userId === userId && n.courseId === courseId));
  saveLocalNotes([...allLocal, ...merged]);

  return merged;
}

// Real-time listener for course notes
export function subscribeToCourseNotes(
  userId: string,
  courseId: string,
  onUpdate: (notes: CourseNote[]) => void
): () => void {
  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreList: CourseNote[] = snapshot.docs.map(d => d.data() as CourseNote);
        const localList = getLocalNotes().filter(n => n.userId === userId && n.courseId === courseId);
        
        const map = new Map<string, CourseNote>();
        for (const n of localList) map.set(n.id, n);
        for (const n of firestoreList) map.set(n.id, n);

        const merged = Array.from(map.values()).sort((a, b) => {
          if (a.chapterIndex !== b.chapterIndex) {
            return a.chapterIndex - b.chapterIndex;
          }
          return a.timestampSeconds - b.timestampSeconds;
        });

        // Update local cache
        const otherNotes = getLocalNotes().filter(n => !(n.userId === userId && n.courseId === courseId));
        saveLocalNotes([...otherNotes, ...merged]);

        onUpdate(merged);
      },
      (error) => {
        console.warn('Firestore notes subscription fallback:', error);
        // On error, deliver local notes
        const local = getLocalNotes().filter(n => n.userId === userId && n.courseId === courseId);
        onUpdate(local);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not setup onSnapshot notes listener:', err);
    // Initial emission from local
    const local = getLocalNotes().filter(n => n.userId === userId && n.courseId === courseId);
    onUpdate(local);
    return () => {};
  }
}

// Save or update a note
export async function saveNote(note: CourseNote): Promise<void> {
  // 1. Immediately persist locally
  const all = getLocalNotes();
  const idx = all.findIndex(n => n.id === note.id);
  if (idx >= 0) {
    all[idx] = note;
  } else {
    all.unshift(note);
  }
  saveLocalNotes(all);

  // 2. Persist to Firestore
  try {
    await setDoc(doc(db, 'notes', note.id), note, { merge: true });
  } catch (err) {
    console.warn('Could not write note to Firestore (cached locally):', err);
  }
}

// Delete a note
export async function deleteNote(noteId: string): Promise<void> {
  // 1. Delete locally
  const all = getLocalNotes().filter(n => n.id !== noteId);
  saveLocalNotes(all);

  // 2. Delete in Firestore
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (err) {
    console.warn('Could not delete note in Firestore (removed locally):', err);
  }
}

// Utility: convert seconds to MM:SS or HH:MM:SS
export function formatSecondsToTimestamp(totalSeconds: number): string {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

// Utility: parse timestamp string (e.g. "02:45" or "1:05:20" or "45") to seconds
export function parseTimestampToSeconds(timestampStr: string): number {
  if (!timestampStr) return 0;
  const parts = timestampStr.trim().split(':').map(p => parseInt(p, 10) || 0);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}
