import './App.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { ensureUserProfile } from './services/firestoreService';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CareerSheet from './pages/CareerSheet';
import InterviewLogsPage from './pages/InterviewLogsPage';
import NewsPage from './pages/NewsPage';
import GuidesPage from './pages/GuidesPage';
import GuideArticlePage from './pages/GuideArticlePage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import { trackEvent } from './utils/analytics';

const normalizePath = (path) => {
  if (!path) return '/';
  if (path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account');
  const publicPath = normalizePath(location.pathname);

  useEffect(() => {
    trackEvent('page_view', { page_path: publicPath });
  }, [publicPath]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          await ensureUserProfile(currentUser);
        }
      } catch (error) {
        console.error('ユーザープロフィール初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const navigatePublic = (path) => {
    const nextPath = normalizePath(path);
    if (nextPath !== publicPath) navigate(nextPath);
  };

  const handleSignupFrom = (source) => {
    trackEvent('signup_click', { source, page_path: publicPath });
    navigatePublic('/signup');
  };

  const handleOpenGuide = (path) => {
    trackEvent('guide_open', { target_path: path, page_path: publicPath });
    navigatePublic(path);
  };

  const handleDemoLogin = async (source) => {
    const demoEmail = (process.env.REACT_APP_DEMO_EMAIL || '').trim();
    const demoPassword = (process.env.REACT_APP_DEMO_PASSWORD || '').trim();

    trackEvent('trial_login_click', { source, page_path: publicPath });

    if (!demoEmail || !demoPassword) {
      window.alert('Demo login is not configured. Set REACT_APP_DEMO_EMAIL and REACT_APP_DEMO_PASSWORD.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
    } catch (error) {
      console.error('Demo login error:', error);

      const code = error?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        window.alert('Demo login failed. Check demo email/password and that the demo user exists in Firebase Auth.');
        return;
      }
      if (code === 'auth/too-many-requests') {
        window.alert('Too many attempts. Please wait and try again.');
        return;
      }
      if (code === 'auth/network-request-failed') {
        window.alert('Network error while logging in. Please check your connection.');
        return;
      }

      window.alert(`Demo login failed. (${code || 'unknown-error'})`);
    }
  };

  const handleProjectSuccess = () => {
    setCurrentPage('projects');
    setRefreshKey((prev) => prev + 1);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setCurrentPage('project-detail');
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800" />;
  }

  if (!user) {
    if (publicPath === '/guides') {
      return (
        <GuidesPage
          onNavigatePublic={handleOpenGuide}
          onStartLogin={() => navigatePublic('/login')}
          onStartSignup={() => handleSignupFrom('guides')}
        />
      );
    }

    if (publicPath.startsWith('/guides/')) {
      const slug = publicPath.replace('/guides/', '');
      return (
        <GuideArticlePage
          slug={slug}
          onNavigatePublic={handleOpenGuide}
          onStartLogin={() => navigatePublic('/login')}
          onStartSignup={() => handleSignupFrom(`guide_article_${slug}`)}
        />
      );
    }

    if (publicPath === '/news') {
      return (
        <NewsPage
          isPublic
          onStartLogin={() => navigatePublic('/login')}
          onStartSignup={() => handleSignupFrom('news')}
          onNavigatePublic={navigatePublic}
        />
      );
    }

    if (publicPath === '/demo') {
      return (
        <DemoPage
          onNavigatePublic={navigatePublic}
          onStartLogin={() => navigatePublic('/login')}
          onStartSignup={() => handleSignupFrom('demo')}
          onStartDemoLogin={() => handleDemoLogin('demo_page')}
        />
      );
    }

    if (publicPath === '/about') {
      return (
        <AboutPage
          onNavigatePublic={navigatePublic}
          onStartLogin={() => navigatePublic('/login')}
          onStartSignup={() => handleSignupFrom('about')}
          onStartDemoLogin={() => handleDemoLogin('about')}
        />
      );
    }

    if (publicPath === '/login' || publicPath === '/signup') {
      return (
        <AuthPage
          initialMode={publicPath === '/signup' ? 'signup' : 'login'}
          onBack={() => navigatePublic('/')}
        />
      );
    }

    return (
      <LandingPage
        onStartSignup={() => handleSignupFrom('landing')}
        onStartLogin={() => navigatePublic('/login')}
        onOpenNews={() => navigatePublic('/news')}
        onOpenGuides={() => navigatePublic('/guides')}
        onOpenDemo={() => handleDemoLogin('landing')}
        onNavigatePublic={navigatePublic}
        onStartDemoLogin={() => handleDemoLogin('landing')}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-y-none bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="bg-slate-950 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8 flex flex-wrap gap-3 justify-between items-start sm:items-center">
          <div className="flex min-w-0 items-start sm:items-center gap-3 sm:gap-6">
            <div>
              <h1
                className="text-xl sm:text-2xl lg:text-3xl leading-tight font-serif font-bold text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
                onClick={() => setCurrentPage('dashboard')}
              >
                SES キャリア記録
              </h1>
              <p className="text-slate-400 mt-1 text-sm">案件と選考を一元管理</p>
            </div>

            <nav className="hidden lg:flex gap-2 ml-4 xl:ml-8 whitespace-nowrap">
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
                案件
              </button>
              <button
                onClick={() => navigateTo('career-sheet')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'career-sheet'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                キャリア
              </button>
              <button
                onClick={() => navigateTo('interview-logs')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'interview-logs'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                選考
              </button>
              <button
                onClick={() => navigateTo('news')}
                className={`font-semibold transition-colors py-2 px-4 rounded ${
                  currentPage === 'news'
                    ? 'text-amber-400 bg-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                ニュース
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

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block text-right max-w-[14rem]">
              <p className="text-sm text-slate-300">{user.email}</p>
              <p className="text-xs text-slate-500">ログイン中</p>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-white transition-colors shrink-0"
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
              <button onClick={() => navigateTo('interview-logs')} className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2">選考管理</button>
              <button onClick={() => navigateTo('news')} className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded px-3 py-2">ニュース</button>
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
                アカウント設定
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
                送信履歴
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

      <main className="max-w-7xl mx-auto px-4 py-5 sm:py-8 sm:px-6 lg:px-8">
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
            onAddProject={() => setCurrentPage('add-project')}
            onViewProject={handleViewProject}
            onRefresh={refreshKey}
          />
        )}

        {currentPage === 'career-sheet' && <CareerSheet user={user} />}

        {currentPage === 'interview-logs' && <InterviewLogsPage user={user} />}

        {currentPage === 'news' && <NewsPage enableSeo={false} />}

        {currentPage === 'settings' && (
          <SettingsPage user={user} tab={settingsTab} onTabChange={setSettingsTab} />
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
            onEdit={() => setCurrentPage('edit-project')}
          />
        )}

        {currentPage === 'edit-project' && selectedProject && (
          <ProjectForm
            user={user}
            project={selectedProject}
            onSuccess={handleProjectSuccess}
            onCancel={() => setCurrentPage('project-detail')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
