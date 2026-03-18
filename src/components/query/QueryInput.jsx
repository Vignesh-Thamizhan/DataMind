import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
  'Show total revenue by month',
  'What are the top 10 products by sales?',
  'Find average order value by region',
  'Compare Q1 vs Q2 performance',
];

export default function QueryInput({ value, onChange, onSubmit, loading, disabled }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [value]);

  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!loading && !disabled && value.trim()) onSubmit();
    }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a question about your data… e.g. 'Show revenue by month'"
          disabled={loading || disabled}
          rows={2}
          style={{ resize: 'none', paddingRight: '5rem', fontFamily: 'var(--font-sans)', lineHeight: 1.6, minHeight: 56 }}
        />
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={loading || disabled || !value.trim()}
          style={{
            position: 'absolute',
            right: '0.625rem',
            bottom: '0.625rem',
            padding: '0.375rem 0.875rem',
            fontSize: '0.8rem',
          }}
        >
          {loading
            ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} />
            : '↵ Run'
          }
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onChange(ex)}
            disabled={loading}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
          >
            {ex}
          </button>
        ))}
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: 'auto', alignSelf: 'center' }}>Ctrl+Enter to run</span>
      </div>
    </div>
  );
}
