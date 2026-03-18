import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '⚡',
    title: 'DuckDB Speed',
    desc: 'Columnar in-process analytics engine. Queries run in milliseconds on million-row datasets.',
    badge: 'Performance',
    color: 'badge-amber',
  },
  {
    icon: '🤖',
    title: 'Multi-Model AI',
    desc: 'Choose between Llama 3, Mixtral, Gemma 2, and Gemini models for SQL generation.',
    badge: 'AI',
    color: 'badge-violet',
  },
  {
    icon: '📊',
    title: 'Auto Charts',
    desc: 'AI recommends the best chart type — bar, line, pie, scatter, or histogram — automatically.',
    badge: 'Visualization',
    color: 'badge-cyan',
  },
  {
    icon: '🔒',
    title: 'SQL Safety',
    desc: 'Generated SQL is validated for mutation keywords. DuckDB runs in sandboxed memory mode.',
    badge: 'Security',
    color: 'badge-emerald',
  },
  {
    icon: '📁',
    title: 'Zero Duplication',
    desc: 'Datasets are registered as DuckDB VIEWs — no data is copied or re-stored.',
    badge: 'Efficient',
    color: 'badge-indigo',
  },
  {
    icon: '🚀',
    title: 'Async Upload',
    desc: 'Upload returns 202 instantly. Schema detection runs in the background, UI polls for readiness.',
    badge: 'Async',
    color: 'badge-rose',
  },
];

const MODELS = [
  { provider: 'Groq', name: 'Llama 3 70B', id: 'llama3-70b', badge: 'badge-emerald', note: 'Best quality' },
  { provider: 'Groq', name: 'Mixtral 8x7B', id: 'mixtral', badge: 'badge-indigo', note: 'Instruction following' },
  { provider: 'Groq', name: 'Llama 3 8B', id: 'llama3-8b', badge: 'badge-cyan', note: 'Fast & lightweight' },
  { provider: 'Groq', name: 'Gemma 2 9B', id: 'gemma2', badge: 'badge-violet', note: 'Efficient' },
  { provider: 'Gemini', name: 'Gemini 1.5 Flash', id: 'gemini-flash', badge: 'badge-amber', note: 'Fast + multimodal' },
  { provider: 'Gemini', name: 'Gemini 1.5 Pro', id: 'gemini-pro', badge: 'badge-rose', note: 'Complex reasoning' },
];

const STEPS = [
  { n: '01', title: 'Upload Your Data', desc: 'Drag & drop CSV, JSON, or Excel files. Schema detected automatically.' },
  { n: '02', title: 'Ask in Plain English', desc: 'Type questions like "Show revenue by month" — no SQL knowledge needed.' },
  { n: '03', title: 'Get Instant Insights', desc: 'AI generates SQL, runs it on DuckDB, charts the result, and explains what it found.' },
];

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } },
};

export default function Landing() {
  const [activeTab, setActiveTab] = useState('groq');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* ======= Navbar ======= */}
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🧠</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>DataMind <span className="gradient-text">AI</span></span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* ======= Orbs ======= */}
      <div className="orb orb-indigo" style={{ width: 600, height: 600, top: -200, left: -200 }} />
      <div className="orb orb-violet" style={{ width: 500, height: 500, top: 100, right: -150 }} />

      {/* ======= Hero ======= */}
      <section className="bg-grid" style={{ position: 'relative', padding: '6rem 2rem 5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          <div className="badge badge-indigo" style={{ margin: '0 auto 1.5rem', width: 'fit-content' }}>
            ✨ AI-Powered Data Analysis
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Analyze Data with{' '}
            <span className="gradient-text">Plain English</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Upload CSV, JSON, or Excel → Ask questions in natural language → Get SQL, interactive charts, and AI insights — powered by Gemini and Groq.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              🚀 Start Analyzing Free
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass"
          style={{ maxWidth: 700, margin: '4rem auto 0', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'left' }}
        >
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fb7185' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>DataMind AI — Query Engine</span>
          </div>
          <div style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.8 }}>
            <div style={{ color: 'var(--color-text-muted)' }}>{'>'} <span style={{ color: '#818cf8' }}>Query:</span> <span style={{ color: '#f1f5f9' }}>Show me revenue by month for Q1 2024</span></div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{'>'} <span style={{ color: '#34d399' }}>SQL:</span></div>
            <div style={{ color: '#a5f3fc', paddingLeft: '1rem' }}>
              SELECT STRFTIME('%Y-%m', date) AS month,<br />
              {'       '}SUM(revenue) AS total_revenue<br />
              FROM dataset<br />
              GROUP BY 1 ORDER BY 1
            </div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>{'>'} <span style={{ color: '#fbbf24' }}>Insight:</span> <span style={{ color: '#f1f5f9' }}>Revenue grew 32% from Jan to Mar 2024, with March at $128K being the strongest month.</span></div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{'>'} <span style={{ color: '#a78bfa' }}>Chart:</span> <span style={{ color: '#f1f5f9' }}>line • 3 rows • 1,240ms</span></div>
          </div>
        </motion.div>
      </section>

      {/* ======= How it Works ======= */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={stagger.item} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge badge-cyan" style={{ margin: '0 auto 1rem', width: 'fit-content' }}>How it Works</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>Three steps to instant insights</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {STEPS.map((step) => (
              <motion.div key={step.n} variants={stagger.item} className="card glass-hover" style={{ position: 'relative' }}>
                <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, marginBottom: '1rem' }}>{step.n}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ======= Features ======= */}
      <section style={{ padding: '5rem 2rem', background: 'rgba(99,102,241,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={stagger.item} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div className="badge badge-violet" style={{ margin: '0 auto 1rem', width: 'fit-content' }}>Features</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>Built for serious data work</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {FEATURES.map((f) => (
                <motion.div key={f.title} variants={stagger.item} className="card glass-hover">
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{f.title}</h3>
                    <span className={`badge ${f.color}`}>{f.badge}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= AI Models ======= */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="badge badge-indigo" style={{ margin: '0 auto 1rem', width: 'fit-content' }}>AI Models</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>Choose your AI model</h2>
            </div>

            {/* Provider tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
              {['groq', 'gemini'].map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveTab(p)}
                  className={activeTab === p ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.5rem 1.5rem', textTransform: 'capitalize' }}
                >
                  {p === 'groq' ? '⚡ Groq' : '✨ Gemini'}
                </button>
              ))}
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>ID</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.filter((m) => m.provider.toLowerCase() === activeTab).map((m) => (
                    <tr key={m.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{m.name}</span>
                      </td>
                      <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#a5f3fc' }}>{m.id}</code></td>
                      <td><span className={`badge ${m.badge}`}>{m.note}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= Architecture ======= */}
      <section style={{ padding: '5rem 2rem', background: 'rgba(99,102,241,0.03)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="badge badge-emerald" style={{ margin: '0 auto 1rem', width: 'fit-content' }}>Architecture</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '2.5rem' }}>How the platform is built</h2>
            <div className="code-block" style={{ textAlign: 'left', fontSize: '0.85rem' }}>
{`Browser (React + Vite)
    │  JWT Auth · File Upload · Chart Rendering
    ▼
Node.js Express API Gateway :5000
    │  JWT Validation · Rate Limiting · Dataset Management
    ▼
Python FastAPI AI Agent :8000
    │  NL → SQL (Groq / Gemini) · SQL Safety Validation
    ▼
DuckDB (In-Memory + File Views)
    │  CSV / JSON / XLSX / Parquet (zero duplication)
    ▼
MongoDB (Users · Datasets · Query History)`}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div className="orb orb-cyan" style={{ width: 400, height: 400, bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to talk to your data?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
            Upload a dataset and ask your first question in under 60 seconds.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            🚀 Get Started Free
          </Link>
        </motion.div>
      </section>

      {/* ======= Footer ======= */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🧠</div>
          <span style={{ fontWeight: 700 }}>DataMind AI</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
          React · Node.js · Python FastAPI · DuckDB · MongoDB · Gemini · Groq
        </p>
      </footer>
    </div>
  );
}
