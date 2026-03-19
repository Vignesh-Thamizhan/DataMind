import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../components/store/authStore';
import { useDatasetStore } from '../components/store/datasetStore';
import { useQueryStore } from '../components/store/qweryStore';
import { queryAPI, datasetAPI } from '../components/services/api';
import QueryInput from '../components/query/QueryInput';
import ModelSelector from '../components/query/ModelSelector';
import ChartRenderer from '../components/charts/chartRender';
import InsightsPanel from '../components/insights/insightsPanel';
import ResultsTable from '../components/datasets/ResultsTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { datasets, setDatasets, activeDataset, setActive } = useDatasetStore();
  const { currentResult, isLoading, error, setResult, setLoading, setError, clearResult } = useQueryStore();

  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('groq');
  const [model, setModel] = useState('llama3-70b');
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await datasetAPI.list();
      const list = res.data?.datasets || res.data || [];
      setDatasets(list);
      if (!activeDataset && list.length > 0) setActive(list[0]);
    } catch {}
  };

  const handleRun = async () => {
    if (!query.trim() || !activeDataset) return;
    setLoading(true);
    clearResult();
    try {
      const res = await queryAPI.run({
        datasetId: activeDataset._id,
        query,
        model,
        provider,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  const readyDatasets = datasets.filter((d) => d.status === 'ready' || !d.status);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Navbar */}
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🧠</div>
          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>DataMind <span className="gradient-text">AI</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/upload" className="btn-ghost">Upload</Link>
          <Link to="/history" className="btn-ghost">History</Link>
          <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 0.25rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</span>
          <button onClick={logout} className="btn-ghost" style={{ color: '#fb7185' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Sidebar — dataset selector */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>Datasets</h2>
                <Link to="/upload" style={{ fontSize: '0.75rem', color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>+ Upload</Link>
              </div>

              {readyDatasets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-text-muted)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📭</div>
                  <p style={{ fontSize: '0.8rem' }}>No datasets yet</p>
                  <Link to="/upload" className="btn-primary" style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}>Upload one →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {readyDatasets.map((ds) => (
                    <button
                      key={ds._id}
                      onClick={() => { setActive(ds); clearResult(); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--radius-md)', border: '1px solid',
                        borderColor: activeDataset?._id === ds._id ? 'rgba(99,102,241,0.5)' : 'transparent',
                        background: activeDataset?._id === ds._id ? 'rgba(99,102,241,0.1)' : 'transparent',
                        color: 'var(--color-text-primary)', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>
                          {{ csv: '📊', json: '📋', xlsx: '📗', xls: '📗' }[ds.fileType] || '📁'}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ds.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{ds.fileType} · {ds.rowCount?.toLocaleString() || '?'} rows</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Main area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Query box */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.125rem' }}>
                    {activeDataset ? <>Analyze: <span className="gradient-text">{activeDataset.name}</span></> : 'Select a dataset'}
                  </h1>
                  {activeDataset && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{activeDataset.rowCount?.toLocaleString()} rows · {activeDataset.fileType?.toUpperCase()}</p>}
                </div>
                <ModelSelector provider={provider} model={model} onProviderChange={setProvider} onModelChange={setModel} />
              </div>
              <QueryInput
                value={query}
                onChange={setQuery}
                onSubmit={handleRun}
                loading={isLoading}
                disabled={!activeDataset}
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', color: '#fb7185', fontSize: '0.875rem' }}>
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            <AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div className="skeleton" style={{ height: 20, width: '40%', borderRadius: 6 }} />
                  <div className="skeleton" style={{ height: 240, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 6 }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {currentResult && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Stats bar */}
                  <div className="card glass" style={{ display: 'flex', gap: '1.5rem', padding: '0.875rem 1.25rem', flexWrap: 'wrap' }}>
                    <Stat label="Rows" value={currentResult.row_count?.toLocaleString()} />
                    <Stat label="Columns" value={currentResult.columns?.length} />
                    <Stat label="Exec time" value={`${currentResult.execution_time_ms}ms`} />
                    {currentResult.chart?.chart_type && <Stat label="Chart" value={currentResult.chart.chart_type} />}
                  </div>

                  {/* Insight */}
                  {currentResult.insight && <InsightsPanel insight={currentResult.insight} />}

                  {/* SQL */}
                  <details className="card" style={{ padding: '0.875rem 1.25rem' }}>
                    <summary style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer', userSelect: 'none' }}>
                      🔍 Generated SQL
                    </summary>
                    <pre style={{ marginTop: '0.75rem', background: 'rgba(99,102,241,0.06)', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: '#a5b4fc', overflowX: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {currentResult.sql}
                    </pre>
                  </details>

                  {/* Chart / Table tabs */}
                  {(currentResult.chart || currentResult.data?.length > 0) && (
                    <div className="card">
                      {/* Tab switcher */}
                      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.25rem', width: 'fit-content' }}>
                        {['chart', 'table'].map((tab) => (
                          <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: activeTab === tab ? 'var(--color-bg-glass)' : 'transparent', color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)', transition: 'all 0.15s' }}>
                            {tab === 'chart' ? '📊 Chart' : '📋 Table'}
                          </button>
                        ))}
                      </div>

                      {activeTab === 'chart' && currentResult.chart ? (
                        <ChartRenderer
                          type={currentResult.chart.chart_type}
                          data={currentResult.data}
                          xKey={currentResult.chart.x_key}
                          yKey={currentResult.chart.y_key}
                          title={currentResult.chart.title}
                        />
                      ) : activeTab === 'chart' ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No chart data available</div>
                      ) : (
                        <ResultsTable data={currentResult.data} columns={currentResult.columns} />
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!currentResult && !isLoading && !error && activeDataset && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Ready to analyze</p>
                <p style={{ fontSize: '0.875rem' }}>Ask a question about your data above to get started</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.125rem' }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}
