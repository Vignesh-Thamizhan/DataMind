import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../components/services/api';
import { useAuthStore } from '../components/store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || !form.confirm) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authAPI.register({ email: form.email, password: form.password });
      const loginRes = await authAPI.login({ email: form.email, password: form.password });
      login(loginRes.data);
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="orb orb-violet" style={{ width: 500, height: 500, top: -100, right: -100 }} />
      <div className="orb orb-cyan" style={{ width: 350, height: 350, bottom: -100, left: -50 }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{ width: '100%', maxWidth: 440, borderRadius: 'var(--radius-2xl)', padding: '2.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🧠</div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>DataMind <span className="gradient-text">AI</span></span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Start analyzing your data for free</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="input" type="password" name="confirm" placeholder="Repeat your password" value={form.confirm} onChange={handleChange} autoComplete="new-password" />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', color: '#fb7185', fontSize: '0.85rem' }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.25rem', padding: '0.75rem' }}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: '2px' }} /> Creating account…</> : 'Create account →'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.75rem 0' }} />

        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
