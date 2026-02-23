import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-slate-700">
        <h1 className="text-3xl font-serif font-bold text-amber-400 mb-2 text-center">SES キャリア記録</h1>
        <p className="text-slate-400 text-center mb-8">案件の実績を管理して転職活動をスマートに</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-white placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-2 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold py-2 rounded transition-colors"
          >
            {loading ? 'しばらくお待ちください...' : isLogin ? 'ログイン' : '新規登録'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? 'アカウントをお持ちではありませんか?' : 'アカウントをお持ちですか?'}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="text-amber-400 hover:text-amber-300 font-semibold mt-2"
          >
            {isLogin ? '新規登録' : 'ログイン'}
          </button>
        </div>
      </div>
    </div>
  );
}
