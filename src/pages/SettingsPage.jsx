import { useCallback, useEffect, useState } from 'react';
import ContactSection from '../components/ContactSection';
import ContactList from '../components/ContactList';
import { ensureUserProfile, getUserProfile } from '../services/firestoreService';

export default function SettingsPage({ user, tab = 'account', onTabChange }) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      setProfileError('');
      let data = await getUserProfile(user?.uid);
      if (!data && user) {
        await ensureUserProfile(user);
        data = await getUserProfile(user?.uid);
      }
      setProfile(data);
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
      setProfile(null);
      setProfileError(error.message || 'プロフィール取得に失敗しました');
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-amber-400">設定</h2>
        <p className="text-slate-400 text-sm mt-1">アカウント情報の確認とお問い合わせ</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTabChange('account')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            tab === 'account'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          アカウント情報
        </button>
        <button
          onClick={() => onTabChange('contact')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            tab === 'contact'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          お問い合わせ
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            tab === 'history'
              ? 'bg-amber-500 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          送信履歴
        </button>
        {isAdmin && (
          <button
            onClick={() => onTabChange('inbox')}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              tab === 'inbox'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            受信一覧
          </button>
        )}
      </div>

      {tab === 'account' && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">アカウント情報</h3>
          {profileError && (
            <div className="bg-red-700/20 border border-red-600 text-red-200 rounded px-3 py-2 text-sm mb-4">
              {profileError}
            </div>
          )}
          {loadingProfile ? (
            <p className="text-slate-400 text-sm mb-4">プロフィール読み込み中...</p>
          ) : (
            <p className="text-slate-400 text-sm mb-4">
              権限: <span className="text-white font-semibold">{profile?.role || 'user'}</span>
            </p>
          )}
          <button
            onClick={loadProfile}
            className="mb-4 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
          >
            プロフィール初期化 / 再取得
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700/60 border border-slate-600 rounded p-4">
              <p className="text-slate-400 mb-1">表示名</p>
              <p className="text-white font-semibold">{user?.displayName || '未設定'}</p>
            </div>
            <div className="bg-slate-700/60 border border-slate-600 rounded p-4">
              <p className="text-slate-400 mb-1">メールアドレス</p>
              <p className="text-white font-semibold">{user?.email || '-'}</p>
            </div>
            <div className="bg-slate-700/60 border border-slate-600 rounded p-4 md:col-span-2">
              <p className="text-slate-400 mb-1">ユーザーID</p>
              <p className="text-white font-mono text-xs break-all">{user?.uid || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'contact' && <ContactSection user={user} />}
      {tab === 'history' && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">送信したお問い合わせ</h3>
          <ContactList user={user} mode="mine" />
        </div>
      )}
      {isAdmin && tab === 'inbox' && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-serif font-bold text-amber-400 mb-4">受信したお問い合わせ（全件）</h3>
          <ContactList user={user} mode="all" />
        </div>
      )}
    </div>
  );
}
