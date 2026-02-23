import './App.css';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CareerSheet from './pages/CareerSheet';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

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
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleAddProject = () => {
    setCurrentPage('add-project');
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
    return <AuthPage />;
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
              <button
                onClick={() => setCurrentPage('career-sheet')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'career-sheet'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                キャリアシート
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
          </div>
        </div>
      </header>

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
            onNavigate={(page) => setCurrentPage(page)}
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
