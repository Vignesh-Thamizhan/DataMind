import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { queryAPI } from '../services/api';
import { useQueryStore } from '../store/qweryStore';

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
            fontSize: '0.75rem',
          }}
        >
          {loading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: '1.5px' }} /> : '→'}
        </button>
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {EXAMPLES.map((ex) => (
          <motion.button
            key={ex}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-ghost"
            onClick={() => onChange(ex)}
            type="button"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}
          >
            {ex}
          </motion.button>
        ))}
      </div>
    </div>
  );
}