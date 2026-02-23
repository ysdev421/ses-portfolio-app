import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* ヘッダー */}
      <header className="bg-slate-950 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div>
              <h1 
                className="text-3xl font-serif font-bold text-amber-400 cursor-pointer hover:text-amber-300 transition-colors" 
                onClick={() => setCurrentPage('dashboard')}
              >
                SES キャリア記録
              </h1>
              <p className="text-slate-400 mt-1 text-sm">案件の実績を管理</p>
            </div>
            
            {/* ナビゲーション */}
            <nav className="hidden md:flex gap-6 ml-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'dashboard'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                ダッシュボード
              </button>
              <button
                onClick={() => setCurrentPage('projects')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'projects'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                案件一覧
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-serif font-bold text-amber-400 mb-4">
            {currentPage === 'dashboard' ? 'ダッシュボード' : '案件一覧'}
          </h2>
          
          <div className="text-slate-300">
            <p className="text-lg mb-4">SESスキルポートフォリオへようこそ</p>
            <p className="mb-6">このアプリケーションは、SES技術者のキャリア実績を管理するためのツールです。</p>
            
            {currentPage === 'dashboard' && (
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded border border-slate-600">
                  <h3 className="text-amber-400 font-semibold mb-2">機能一覧</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>案件情報の登録と管理</li>
                    <li>スキルと実績の記録</li>
                    <li>プロジェクト発生工数の追跡</li>
                    <li>キャリア情報の一元管理</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => setCurrentPage('projects')}
                  className="mt-6 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2 px-6 rounded transition-colors"
                >
                  案件一覧を見る
                </button>
              </div>
            )}
            
            {currentPage === 'projects' && (
              <div className="bg-slate-700 p-4 rounded border border-slate-600">
                <p className="text-slate-400">案件データがまだありません。</p>
                <p className="text-sm text-slate-500 mt-2">Firebase設定後に案件を追加できます。</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
