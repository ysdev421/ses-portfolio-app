import './App.css';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CareerSheet from './pages/CareerSheet';
import SettingsPage from './pages/SettingsPage';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthMode(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleAddProject = () => {
    setCurrentPage('add-project');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleProjectSuccess = () => {
    setCurrentPage('projects');
    setRefreshKey(prev => prev + 1);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setCurrentPage('project-detail');
  };

  const handleEditProject = () => {
    setCurrentPage('edit-project');
  };

  const handleBackToDetail = () => {
    setCurrentPage('project-detail');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-amber-400 text-2xl font-serif">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    if (!authMode) {
      return (
        <LandingPage
          onStartSignup={() => setAuthMode('signup')}
          onStartLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <AuthPage
        initialMode={authMode}
        onBack={() => setAuthMode(null)}
      />
    );
  }

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
            
            <nav className="hidden lg:flex gap-6 ml-8">
              <button
                onClick={() => navigateTo('dashboard')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'dashboard'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                ダッシュボード
              </button>
              <button
                onClick={() => navigateTo('projects')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'projects'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                案件一覧
              </button>
              <button
                onClick={() => navigateTo('career-sheet')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'career-sheet'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                キャリアシート
              </button>
              <button
                onClick={() => {
                  setSettingsTab('account');
                  navigateTo('settings');
                }}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'settings'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                設定
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">{user.email}</p>
              <p className="text-xs text-slate-500">ログイン中</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors text-sm font-semibold"
            >
              ログアウト
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-white transition-colors"
              aria-label="メニューを開く"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
            aria-label="メニューを閉じる"
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-slate-700 shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-amber-400">メニュー</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xl"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-slate-400 text-xs font-semibold">ページ</p>
              <button onClick={() => navigateTo('dashboard')} className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2">ダッシュボード</button>
              <button onClick={() => navigateTo('projects')} className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2">案件一覧</button>
              <button onClick={() => navigateTo('career-sheet')} className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2">キャリアシート</button>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-slate-400 text-xs font-semibold">アカウント</p>
              <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2">
                <p className="text-slate-400 text-xs">ログイン中</p>
                <p className="text-white text-sm break-all">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setSettingsTab('account');
                  navigateTo('settings');
                }}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2"
              >
                アカウント情報
              </button>
              <button
                onClick={() => {
                  setSettingsTab('contact');
                  navigateTo('settings');
                }}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2"
              >
                お問い合わせ
              </button>
              <button
                onClick={() => {
                  setSettingsTab('history');
                  navigateTo('settings');
                }}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2"
              >
                問い合わせ履歴
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors text-sm font-semibold"
            >
              ログアウト
            </button>
          </aside>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentPage === 'dashboard' && (
          <Dashboard
            user={user}
            onNavigate={(page, data) => {
              if (page === 'project-detail' && data) {
                handleViewProject(data);
              } else {
                setCurrentPage(page);
              }
            }}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectList 
            user={user}
            onAddProject={handleAddProject}
            onViewProject={handleViewProject}
            onRefresh={refreshKey}
          />
        )}

        {currentPage === 'career-sheet' && (
          <CareerSheet
            user={user}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            user={user}
            tab={settingsTab}
            onTabChange={setSettingsTab}
          />
        )}

        {currentPage === 'add-project' && (
          <ProjectForm
            user={user}
            onSuccess={handleProjectSuccess}
            onCancel={() => setCurrentPage('projects')}
          />
        )}

        {currentPage === 'project-detail' && (
          <ProjectDetail
            user={user}
            project={selectedProject}
            onBack={() => setCurrentPage('projects')}
            onEdit={handleEditProject}
          />
        )}

        {currentPage === 'edit-project' && selectedProject && (
          <ProjectForm
            user={user}
            project={selectedProject}
            onSuccess={handleProjectSuccess}
            onCancel={handleBackToDetail}
          />
        )}
      </main>
    </div>
  );
}

export default App;
