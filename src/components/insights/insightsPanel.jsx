import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function InsightsPanel({ insight }) {
  const [copied, setCopied] = useState(false);

  if (!insight) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(insight).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        padding: '1rem 1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}>
          💡
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#818cf8' }}>
              AI Insight
            </span>
            <button
              onClick={handleCopy}
              style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--color-text-primary)', margin: 0 }}>
            {insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}