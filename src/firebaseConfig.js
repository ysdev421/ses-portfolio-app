import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyCMCCM1uIDRj7gcGdQx7ExcwGLj0rARtbM",
  authDomain: "ses-portfolio.firebaseapp.com",
  projectId: "ses-portfolio",
  storageBucket: "ses-portfolio.firebasestorage.app",
  messagingSenderId: "802049399246",
  appId: "1:802049399246:web:bcd8634a6fd5c79cfaf39f",
  measurementId: "G-DWCFGXTSMF"
};

// Firebaseアプリケーションの初期化
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('✓ Firebase初期化成功');
} catch (error) {
  console.error('✗ Firebase初期化エラー:', error.message);
}

// Firebase サービスのエクスポート
export { auth, db, storage };
export default app;
