import React, { useEffect, useState } from 'react';
import { queryAPI } from '../services/api';

const PROVIDER_COLORS = { groq: { color: '#34d399', badge: 'badge-emerald', label: '⚡ Groq' }, gemini: { color: '#818cf8', badge: 'badge-indigo', label: '✨ Gemini' } };

const DEFAULT_MODELS = [
  { provider: 'groq', model_id: 'llama3-70b', display_name: 'Llama 3 70B', description: 'Best quality SQL' },
  { provider: 'groq', model_id: 'mixtral', display_name: 'Mixtral 8x7B', description: 'Instruction following' },
  { provider: 'groq', model_id: 'llama3-8b', display_name: 'Llama 3 8B', description: 'Fast & lightweight' },
  { provider: 'groq', model_id: 'gemma2', display_name: 'Gemma 2 9B', description: 'Efficient' },
  { provider: 'gemini', model_id: 'gemini-flash', display_name: 'Gemini 1.5 Flash', description: 'Fast multimodal' },
  { provider: 'gemini', model_id: 'gemini-pro', display_name: 'Gemini 1.5 Pro', description: 'Complex reasoning' },
];

export default function ModelSelector({ provider, model, onChange }) {
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [activeProvider, setActiveProvider] = useState(provider || 'groq');

  useEffect(() => {
    queryAPI.models().then(res => {
      if (res.data?.models?.length) setModels(res.data.models);
    }).catch(() => {});
  }, []);

  const filtered = models.filter(m => m.provider === activeProvider);

  const select = (m) => {
    onChange({ provider: m.provider, model: m.model_id });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
        {Object.entries(PROVIDER_COLORS).map(([p, v]) => (
          <button
            key={p}
            onClick={() => { setActiveProvider(p); const first = models.find(m => m.provider === p); if (first) select(first); }}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${activeProvider === p ? v.color : 'var(--color-border)'}`,
              background: activeProvider === p ? `${v.color}18` : 'transparent',
              color: activeProvider === p ? v.color : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.2s',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map(m => {
          const selected = model === m.model_id && provider === m.provider;
          return (
            <button
              key={m.model_id}
              onClick={() => select(m)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'var(--color-border)'}`,
                background: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: selected ? '#818cf8' : 'var(--color-text-primary)' }}>{m.display_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.description}</div>
              </div>
              {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
