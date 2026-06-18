import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-3xl text-bloom-green">Create your account</h1>
      <p className="mt-1 text-sm text-bloom-green/60">Save bouquets, manage gifts, and unlock more.</p>

      <form onSubmit={submit} className="card-surface mt-6 space-y-4 p-6">
        <label className="block">
          <span className="text-sm text-bloom-green/70">Username</span>
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input-field mt-1"
            placeholder="rosegardener"
          />
        </label>
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
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field mt-1"
            placeholder="At least 6 characters"
          />
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-bloom-green/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-bloom-gold">Log in</Link>
      </p>
    </div>
  );
}
