import { useState } from 'react';
import { createContactInquiry } from '../services/contactService';

export default function ContactSection({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createContactInquiry({
        ...formData,
        userId: user?.uid,
        userEmail: user?.email,
      });
      setSuccess('お問い合わせを送信しました。ありがとうございます。');
      setFormData((prev) => ({ ...prev, name: '', company: '', message: '' }));
    } catch (err) {
      setError(err.message || '送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-2">お問い合わせ</h2>
      <p className="text-slate-400 text-sm mb-6">
        機能要望・不具合報告・導入相談などはこちらから送信できます。
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">お名前 *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">メールアドレス *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!!user?.email}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 text-sm mb-1">会社名（任意）</label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm mb-1">内容 *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
          />
        </div>

        {error && (
          <div className="bg-red-700/20 border border-red-600 text-red-200 rounded px-3 py-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-700/20 border border-green-600 text-green-200 rounded px-3 py-2 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-bold px-5 py-2 rounded transition-colors"
        >
          {loading ? '送信中...' : '送信する'}
        </button>
      </form>
    </section>
  );
}
