import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PROJECTS_COLLECTION = 'projects';

// 案件作成
export const createProject = async (userId, projectData) => {
  try {
    console.log('DEBUG: createProject called with userId:', userId);
    console.log('DEBUG: projectData:', projectData);
    const docRef = await addDoc(
      collection(db, PROJECTS_COLLECTION),
      {
        userId,
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    console.log('✓ 案件作成成功:', docRef.id);
    console.log('DEBUG: 作成されたドキュメント ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('✗ 案件作成エラー:', error);
    console.error('ERROR CODE:', error.code);
    console.error('ERROR MESSAGE:', error.message);
    throw error;
  }
};

// ユーザーの案件一覧取得
export const getProjects = async (userId) => {
  try {
    console.log('DEBUG: getProjects called with userId:', userId);
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // JavaScriptで降順ソート
    projects.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    console.log('✓ 案件取得成功:', projects.length, '件');
    console.log('DEBUG: 取得されたプロジェクト:', projects);
    return projects;
  } catch (error) {
    console.error('✗ 案件取得エラー:', error);
    console.error('ERROR CODE:', error.code);
    console.error('ERROR MESSAGE:', error.message);
    throw error;
  }
};

export const updateProject = async (projectId, updates) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('✓ 案件更新成功:', projectId);
  } catch (error) {
    console.error('✗ 案件更新エラー:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
    console.log('✓ 案件削除成功:', projectId);
  } catch (error) {
    console.error('✗ 案件削除エラー:', error);
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
