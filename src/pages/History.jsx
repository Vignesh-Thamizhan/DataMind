import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../components/store/authStore';
import { historyAPI } from '../components/services/api';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function History() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (p) => {
    setLoading(true);
    try {
      const res = await historyAPI.list();
      const data = res.data;
      setHistory(data.history || []);
      setPagination(data.pagination || null);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🧠</div>
          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>DataMind <span className="gradient-text">AI</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
          <Link to="/upload" className="btn-ghost">Upload</Link>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 0.25rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</span>
          <button onClick={logout} className="btn-ghost" style={{ color: '#fb7185' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Query History</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>All your past AI queries and results</p>
            </div>
            {pagination && <span className="badge badge-indigo">{pagination.total} total</span>}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-md)' }} />)}
            </div>
          ) : history.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>No queries yet</p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Run your first AI query on the dashboard</p>
              <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block' }}>Go to Dashboard →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card glass-hover"
                  style={{ padding: '1rem 1.25rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.625rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', flex: 1 }}>{item.query}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', flexShrink: 0, marginTop: '0.125rem' }}>{timeAgo(item.createdAt)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                    {item.datasetName && <span className="badge badge-indigo">📊 {item.datasetName}</span>}
                    {item.model && <span className="badge badge-violet">⚡ {item.model}</span>}
                    {item.chartType && <span className="badge badge-cyan">📈 {item.chartType}</span>}
                    {item.rowCount > 0 && <span className="badge badge-emerald">{item.rowCount?.toLocaleString()} rows</span>}
                    {item.executionTimeMs > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>{item.executionTimeMs}ms</span>}
                  </div>

                  {item.sql && (
                    <details>
                      <summary style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                        🔍 View SQL
                      </summary>
                      <pre style={{ marginTop: '0.5rem', background: 'rgba(99,102,241,0.06)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: '#a5b4fc', overflowX: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {item.sql}
                      </pre>
                    </details>
                  )}

                  {item.insight && (
                    <p style={{ marginTop: '0.625rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)', padding: '0.5rem 0.75rem', background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid rgba(99,102,241,0.4)' }}>
                      💡 {item.insight}
                    </p>
                  )}
                </motion.div>
              ))}

              {pagination && pagination.pages > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                  <span style={{ alignSelf: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Page {page} of {pagination.pages}</span>
                  <button className="btn-ghost" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
