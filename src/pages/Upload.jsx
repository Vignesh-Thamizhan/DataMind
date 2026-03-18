import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { datasetAPI } from '../components/services/api';
import { useDatasetStore } from '../components/store/datasetStore';
import { useAuthStore } from '../components/store/authStore';

const ACCEPTED = '.csv,.json,.xlsx,.xls';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function FileTypeIcon({ type }) {
  const map = { csv: { icon: '📊', badge: 'badge-emerald' }, json: { icon: '📋', badge: 'badge-cyan' }, xlsx: { icon: '📗', badge: 'badge-indigo' }, xls: { icon: '📗', badge: 'badge-indigo' } };
  const m = map[type?.toLowerCase()] || { icon: '📁', badge: 'badge-violet' };
  return <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>;
}

export default function Upload() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { datasets, setDatasets, setProgress, uploadProgress, uploadStatus, setUploadStatus, clearUpload, removeDataset } = useDatasetStore();

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const [fetchingList, setFetchingList] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    setFetchingList(true);
    try {
      const res = await datasetAPI.list();
      setDatasets(res.data?.datasets || res.data || []);
    } catch {
      setDatasets([]);
    } finally {
      setFetchingList(false);
    }
  };

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json', 'xlsx', 'xls'].includes(ext)) {
      alert('Unsupported file type. Please upload CSV, JSON, or Excel files.');
      return;
    }
    setUploading(true);
    setUploadedName(file.name);
    setUploadStatus('uploading');
    setProgress(0);
    try {
      const res = await datasetAPI.upload(file, (pct) => setProgress(pct));
      const datasetId = res.data?._id || res.data?.id;
      setUploadStatus('processing');
      // Poll for readiness
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const d = await datasetAPI.get(datasetId);
          if (d.data?.status === 'ready' || attempts > 20) {
            clearInterval(poll);
            setUploadStatus('ready');
            fetchDatasets();
            setTimeout(clearUpload, 2000);
          }
        } catch {
          if (attempts > 20) { clearInterval(poll); setUploadStatus('error'); }
        }
      }, 2000);
    } catch {
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const onFileInput = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const deleteDataset = async (id) => {
    if (!confirm('Delete this dataset?')) return;
    try {
      await datasetAPI.delete(id);
      removeDataset(id);
    } catch { alert('Failed to delete.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Navbar */}
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🧠</div>
          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>DataMind <span className="gradient-text">AI</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
          <Link to="/history" className="btn-ghost">History</Link>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 0.25rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</span>
          <button onClick={logout} className="btn-ghost" style={{ color: '#fb7185' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Upload Dataset</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Upload CSV, JSON, or Excel files to start analyzing with AI</p>
          </div>

          {/* Drop Zone */}
          <div
            className={`dropzone ${dragOver ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !uploading && document.getElementById('file-input').click()}
            style={{ marginBottom: '2rem', cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            <input id="file-input" type="file" accept={ACCEPTED} style={{ display: 'none' }} onChange={onFileInput} disabled={uploading} />
            <motion.div animate={{ scale: dragOver ? 1.05 : 1 }} transition={{ duration: 0.2 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{dragOver ? '✨' : '📂'}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {dragOver ? 'Drop to upload!' : 'Drag & drop your file here'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>or click to browse</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['CSV', 'JSON', 'XLSX', 'XLS'].map((t) => <span key={t} className="badge badge-indigo">{t}</span>)}
              </div>
            </motion.div>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {(uploading || uploadStatus) && uploadStatus !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card"
                style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
              >
                <div style={{ fontSize: '1.5rem' }}>
                  {uploadStatus === 'uploading' && '⬆️'}
                  {uploadStatus === 'processing' && '⚙️'}
                  {uploadStatus === 'ready' && '✅'}
                  {uploadStatus === 'error' && '❌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{uploadedName}</span>
                    <span className={`badge ${uploadStatus === 'ready' ? 'badge-emerald' : uploadStatus === 'error' ? 'badge-rose' : 'badge-amber'}`}>
                      {uploadStatus === 'uploading' ? `${uploadProgress}%` : uploadStatus}
                    </span>
                  </div>
                  {uploadStatus === 'uploading' && (
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                  {uploadStatus === 'processing' && (
                    <>
                      <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                        <div className="progress-bar-fill" style={{ width: '100%', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%' }} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Detecting schema and loading into DuckDB…</p>
                    </>
                  )}
                  {uploadStatus === 'ready' && <p style={{ fontSize: '0.8rem', color: '#34d399' }}>Dataset ready! Redirecting you to the dashboard…</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Datasets List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Datasets</h2>
              <span className="badge badge-indigo">{datasets.length} total</span>
            </div>

            {fetchingList ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-md)' }} />)}
              </div>
            ) : datasets.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
                <p>No datasets yet. Upload your first file above!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {datasets.map((ds) => (
                  <motion.div
                    key={ds._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card glass-hover"
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}
                  >
                    <FileTypeIcon type={ds.fileType || ds.file_type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ds.name || ds.filename}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {ds.rowCount && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ds.rowCount?.toLocaleString()} rows</span>}
                        {ds.fileSize && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatBytes(ds.fileSize)}</span>}
                        <span className={`badge ${ds.status === 'ready' ? 'badge-emerald' : 'badge-amber'}`}>{ds.status || 'ready'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }} onClick={() => { useDatasetStore.getState().setActive(ds); navigate('/dashboard'); }}>
                        Analyze →
                      </button>
                      <button className="btn-danger" onClick={() => deleteDataset(ds._id)}>🗑</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
