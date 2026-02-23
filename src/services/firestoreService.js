import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PROJECTS_COLLECTION = 'projects';
const ENTRIES_COLLECTION = 'entries';

// 案件操作

export const createProject = async (userId, projectData) => {
  try {
    const docRef = await addDoc(
      collection(db, 'users', userId, PROJECTS_COLLECTION),
      {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('案件作成エラー:', error);
    throw error;
  }
};

export const getProjects = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, PROJECTS_COLLECTION),
      orderBy('startDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('案件取得エラー:', error);
    throw error;
  }
};

export const updateProject = async (userId, projectId, updates) => {
  try {
    const projectRef = doc(db, 'users', userId, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('案件更新エラー:', error);
    throw error;
  }
};

export const deleteProject = async (userId, projectId) => {
  try {
    const projectRef = doc(db, 'users', userId, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('案件削除エラー:', error);
    throw error;
  }
};

// 日記操作

export const createEntry = async (userId, projectId, entryData) => {
  try {
    const docRef = await addDoc(
      collection(db, 'users', userId, PROJECTS_COLLECTION, projectId, ENTRIES_COLLECTION),
      {
        ...entryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('日記作成エラー:', error);
    throw error;
  }
};

export const getEntries = async (userId, projectId) => {
  try {
    const q = query(
      collection(db, 'users', userId, PROJECTS_COLLECTION, projectId, ENTRIES_COLLECTION),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('日記取得エラー:', error);
    throw error;
  }
};

export const updateEntry = async (userId, projectId, entryId, updates) => {
  try {
    const entryRef = doc(
      db,
      'users',
      userId,
      PROJECTS_COLLECTION,
      projectId,
      ENTRIES_COLLECTION,
      entryId
    );
    await updateDoc(entryRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('日記更新エラー:', error);
    throw error;
  }
};

export const deleteEntry = async (userId, projectId, entryId) => {
  try {
    const entryRef = doc(
      db,
      'users',
      userId,
      PROJECTS_COLLECTION,
      projectId,
      ENTRIES_COLLECTION,
      entryId
    );
    await deleteDoc(entryRef);
  } catch (error) {
    console.error('日記削除エラー:', error);
    throw error;
  }
};
