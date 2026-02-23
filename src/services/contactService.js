import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CONTACT_COLLECTION = 'contact_inquiries';

export const createContactInquiry = async ({ userId, userEmail, name, email, company, message }) => {
  const payload = {
    userId: (userId || '').trim(),
    userEmail: (userEmail || '').trim(),
    name: (name || '').trim(),
    email: (email || '').trim(),
    company: (company || '').trim(),
    message: (message || '').trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  };

  if (!payload.userId || !payload.userEmail) {
    throw new Error('ログインユーザーのみ送信できます');
  }

  if (!payload.name || !payload.email || !payload.message) {
    throw new Error('必須項目を入力してください');
  }

  await addDoc(collection(db, CONTACT_COLLECTION), payload);
};

const sortByCreatedAtDesc = (items) =>
  [...items].sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() || 0;
    const tb = b.createdAt?.toMillis?.() || 0;
    return tb - ta;
  });

export const getContactInquiriesByUser = async (userId) => {
  if (!userId) return [];
  const q = query(
    collection(db, CONTACT_COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return sortByCreatedAtDesc(items);
};

export const getAllContactInquiries = async () => {
  const snapshot = await getDocs(collection(db, CONTACT_COLLECTION));
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return sortByCreatedAtDesc(items);
};

export const updateContactInquiry = async (inquiryId, updates) => {
  if (!inquiryId) throw new Error('問い合わせIDが不正です');
  const ref = doc(db, CONTACT_COLLECTION, inquiryId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};
