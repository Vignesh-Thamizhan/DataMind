import React from 'react';

const TYPE_COLORS = {
  INTEGER: 'badge-cyan', BIGINT: 'badge-cyan', DOUBLE: 'badge-indigo', FLOAT: 'badge-indigo',
  VARCHAR: 'badge-violet', TEXT: 'badge-violet', BOOLEAN: 'badge-emerald',
  DATE: 'badge-amber', TIMESTAMP: 'badge-amber',
};

export default function DataPreview({ dataset, schema, sampleData, rowCount }) {
  if (!dataset) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
        <p style={{ fontSize: '0.875rem' }}>Select a dataset to preview its schema</p>
      </div>
    );
  }

  const cols = schema || dataset?.columns || [];
  const rows = sampleData || dataset?.sampleData || [];
  const count = rowCount ?? dataset?.rowCount ?? 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dataset.name || dataset.filename}</span>
          <span className={`badge ${dataset.fileType === 'csv' ? 'badge-emerald' : dataset.fileType === 'json' ? 'badge-cyan' : 'badge-indigo'}`}>
            {(dataset.fileType || '').toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          {count.toLocaleString()} rows · {cols.length} columns
        </span>
      </div>

      {/* Schema */}
      {cols.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Schema</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: 180, overflowY: 'auto' }}>
            {cols.map((col) => {
              const typeName = (col.type || col.data_type || 'VARCHAR').split('(')[0].toUpperCase();
              return (
                <div key={col.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-primary)' }}>{col.name}</span>
                  <span className={`badge ${TYPE_COLORS[typeName] || 'badge-violet'}`}>{typeName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample Data */}
      {rows.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Sample rows</p>
          <div className="table-container" style={{ maxHeight: 200 }}>
            <table>
              <thead>
                <tr>{Object.keys(rows[0]).slice(0, 5).map(k => <th key={k}>{k}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).slice(0, 5).map((v, j) => (
                      <td key={j} style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(v ?? '—')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
