import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定
// TODO: 実際の Firebase プロジェクト設定に置き換えてください
const firebaseConfig = {
  apiKey: 'AIzaSyDUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU', // dummy key
  authDomain: 'ses-portfolio-demo.firebaseapp.com',
  projectId: 'ses-portfolio-demo',
  storageBucket: 'ses-portfolio-demo.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdefghijklmnop',
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
} catch (error) {
  console.warn('Firebase初期化エラー:', error.message);
  console.log('Firebase設定を確認してください。');
}

// Firebase サービスのエクスポート
export { auth, db, storage };
export default app;
