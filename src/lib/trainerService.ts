import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { CourseMaterial, TraineePerformanceRecord } from '../types';
import { INITIAL_COURSE_MATERIALS, INITIAL_TRAINEE_RECORDS } from '../data/trainerData';
import { handleFirestoreError, OperationType } from './adminService';

const MATERIALS_COLLECTION = 'materials';
const RECORDS_COLLECTION = 'trainee_records';

let hasSeededMaterials = false;
let hasSeededRecords = false;

/**
 * Seeds initial materials in Firestore if collection is empty
 */
async function seedMaterialsIfEmpty(): Promise<void> {
  if (hasSeededMaterials) return;
  hasSeededMaterials = true;
  try {
    const snap = await getDocs(collection(db, MATERIALS_COLLECTION));
    if (snap.empty) {
      for (const mat of INITIAL_COURSE_MATERIALS) {
        await setDoc(doc(db, MATERIALS_COLLECTION, mat.id), {
          ...mat,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Materials initial seed notice:', error);
  }
}

/**
 * Seeds initial trainee performance records in Firestore if collection is empty
 */
async function seedRecordsIfEmpty(): Promise<void> {
  if (hasSeededRecords) return;
  hasSeededRecords = true;
  try {
    const snap = await getDocs(collection(db, RECORDS_COLLECTION));
    if (snap.empty) {
      for (const rec of INITIAL_TRAINEE_RECORDS) {
        await setDoc(doc(db, RECORDS_COLLECTION, rec.id), {
          ...rec,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Trainee records initial seed notice:', error);
  }
}

/**
 * Fetches all course materials
 */
export async function fetchTrainerMaterials(trainerId?: string): Promise<CourseMaterial[]> {
  await seedMaterialsIfEmpty();

  try {
    const colRef = collection(db, MATERIALS_COLLECTION);
    const q = trainerId ? query(colRef, where('authorId', '==', trainerId)) : colRef;
    const snap = await getDocs(q);

    if (snap.empty) {
      return INITIAL_COURSE_MATERIALS;
    }

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || '',
        type: data.type || 'document',
        moduleId: data.moduleId || 'mod-1',
        moduleTitle: data.moduleTitle || 'General Module',
        courseId: data.courseId || 'crs-1',
        courseTitle: data.courseTitle || 'Official Statistics Curriculum',
        fileSize: data.fileSize || '3.5 MB',
        durationOrPages: data.durationOrPages || '30 mins',
        uploadedAt: data.uploadedAt || 'Recently',
        status: data.status || 'published',
        author: data.author || 'Academy Faculty',
        url: data.url,
        tags: data.tags || ['Official Statistics'],
        downloadsCount: data.downloadsCount || 0
      } as CourseMaterial;
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    try {
      handleFirestoreError(error, OperationType.GET, MATERIALS_COLLECTION);
    } catch {
      return INITIAL_COURSE_MATERIALS;
    }
  }
}

/**
 * Real-time listener for trainer course materials
 */
export function subscribeToTrainerMaterials(
  onUpdate: (materials: CourseMaterial[]) => void,
  onError?: (error: Error) => void
): () => void {
  seedMaterialsIfEmpty();

  const colRef = collection(db, MATERIALS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_COURSE_MATERIALS);
        return;
      }
      const list: CourseMaterial[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          type: data.type || 'document',
          moduleId: data.moduleId || 'mod-1',
          moduleTitle: data.moduleTitle || 'General Module',
          courseId: data.courseId || 'crs-1',
          courseTitle: data.courseTitle || 'Official Statistics Curriculum',
          fileSize: data.fileSize || '3.5 MB',
          durationOrPages: data.durationOrPages || '30 mins',
          uploadedAt: data.uploadedAt || 'Recently',
          status: data.status || 'published',
          author: data.author || 'Academy Faculty',
          url: data.url,
          tags: data.tags || ['Official Statistics'],
          downloadsCount: data.downloadsCount || 0
        } as CourseMaterial;
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Error subscribing to materials:', error);
      if (onError) onError(error);
      else {
        try {
          handleFirestoreError(error, OperationType.GET, MATERIALS_COLLECTION);
        } catch {
          onUpdate(INITIAL_COURSE_MATERIALS);
        }
      }
    }
  );
}

/**
 * Upload and save a new material record
 */
export async function uploadMaterialRecord(
  material: Omit<CourseMaterial, 'id' | 'uploadedAt' | 'downloadsCount'> & { id?: string }
): Promise<CourseMaterial> {
  const newId = material.id || `mat-${Date.now()}`;
  const docRef = doc(db, MATERIALS_COLLECTION, newId);

  const fullRecord: CourseMaterial = {
    ...material,
    id: newId,
    uploadedAt: 'Just now',
    downloadsCount: 0
  };

  try {
    await setDoc(docRef, {
      ...fullRecord,
      createdAt: new Date().toISOString()
    });
    return fullRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${MATERIALS_COLLECTION}/${newId}`);
  }
}

/**
 * Deletes a material record
 */
export async function deleteMaterialRecord(materialId: string): Promise<void> {
  const docRef = doc(db, MATERIALS_COLLECTION, materialId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MATERIALS_COLLECTION}/${materialId}`);
  }
}

/**
 * Real-time listener for trainee performance analytics
 */
export function subscribeToCourseAnalytics(
  courseId?: string,
  onUpdate?: (records: TraineePerformanceRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  seedRecordsIfEmpty();

  const colRef = collection(db, RECORDS_COLLECTION);
  const q = courseId && courseId !== 'all' ? query(colRef, where('courseId', '==', courseId)) : colRef;

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        if (onUpdate) onUpdate(INITIAL_TRAINEE_RECORDS);
        return;
      }
      const records: TraineePerformanceRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          cadre: data.cadre || 'ISS Cadre',
          courseId: data.courseId || 'crs-1',
          courseTitle: data.courseTitle || 'National Accounts Statistics',
          currentModule: data.currentModule || 'Module 1',
          participationRate: data.participationRate ?? 85,
          completionRate: data.completionRate ?? 65,
          avgAssessmentScore: data.avgAssessmentScore ?? 80,
          finalExamScore: data.finalExamScore ?? null,
          scoreDistribution: data.scoreDistribution || [75, 80, 85, 90],
          status: data.status || 'On Track',
          lastActive: data.lastActive || 'Today'
        } as TraineePerformanceRecord;
      });
      if (onUpdate) onUpdate(records);
    },
    (error) => {
      console.error('Error subscribing to course analytics:', error);
      if (onError) onError(error);
      else {
        try {
          handleFirestoreError(error, OperationType.GET, RECORDS_COLLECTION);
        } catch {
          if (onUpdate) onUpdate(INITIAL_TRAINEE_RECORDS);
        }
      }
    }
  );
}

/**
 * Fetches one-time course analytics records
 */
export async function fetchCourseAnalytics(courseId?: string): Promise<TraineePerformanceRecord[]> {
  await seedRecordsIfEmpty();

  try {
    const colRef = collection(db, RECORDS_COLLECTION);
    const q = courseId && courseId !== 'all' ? query(colRef, where('courseId', '==', courseId)) : colRef;
    const snap = await getDocs(q);

    if (snap.empty) {
      return INITIAL_TRAINEE_RECORDS;
    }

    return snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || '',
        cadre: data.cadre || 'ISS Cadre',
        courseId: data.courseId || 'crs-1',
        courseTitle: data.courseTitle || 'National Accounts Statistics',
        currentModule: data.currentModule || 'Module 1',
        participationRate: data.participationRate ?? 85,
        completionRate: data.completionRate ?? 65,
        avgAssessmentScore: data.avgAssessmentScore ?? 80,
        finalExamScore: data.finalExamScore ?? null,
        scoreDistribution: data.scoreDistribution || [75, 80, 85, 90],
        status: data.status || 'On Track',
        lastActive: data.lastActive || 'Today'
      } as TraineePerformanceRecord;
    });
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    try {
      handleFirestoreError(error, OperationType.GET, RECORDS_COLLECTION);
    } catch {
      return INITIAL_TRAINEE_RECORDS;
    }
  }
}
