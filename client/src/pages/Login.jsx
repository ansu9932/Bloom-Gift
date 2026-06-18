import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-3xl text-bloom-green">Welcome back</h1>
      <p className="mt-1 text-sm text-bloom-green/60">Log in to manage your gifts and bouquets.</p>

      <form onSubmit={submit} className="card-surface mt-6 space-y-4 p-6">
        <label className="block">
          <span className="text-sm text-bloom-green/70">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field mt-1"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-bloom-green/70">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field mt-1"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-bloom-green/60">
        No account?{' '}
        <Link to="/register" className="font-semibold text-bloom-gold">Create one</Link>
      </p>
    </div>
  );
}
