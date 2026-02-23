import './App.css';
import { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase認証状態の監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-navy to-navy flex items-center justify-center">
        <div className="text-gold text-2xl font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy to-navy text-white">
      {/* ヘッダー */}
      <header className="bg-navy border-b border-light-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-gold">SES エンジニア向けキャリア記録アプリ</h1>
          <p className="text-light-navy mt-2">実績を可視化して、転職活動をスマートに</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {user ? (
          <div>
            <div className="bg-light-navy rounded-lg p-6 mb-8">
              <p className="text-gold text-lg">{user.email} でログイン中</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ダッシュボードカードプレースホルダー */}
              <div className="bg-light-navy rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-gold-light/20">
                <h2 className="text-xl font-serif text-gold mb-2">ダッシュボード</h2>
                <p className="text-light-navy">技術別の累計経験年数を表示</p>
              </div>
              <div className="bg-light-navy rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-gold-light/20">
                <h2 className="text-xl font-serif text-gold mb-2">案件管理</h2>
                <p className="text-light-navy">案件の基本情報と詳細を記録</p>
              </div>
              <div className="bg-light-navy rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-gold-light/20">
                <h2 className="text-xl font-serif text-gold mb-2">日記</h2>
                <p className="text-light-navy">スマートに仕事内容を記録</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl text-gold mb-4">ログインしてください</p>
            <p className="text-light-navy">Firebase認証ページを準備中...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
