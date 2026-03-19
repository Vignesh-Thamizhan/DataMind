import React from 'react';

export default function DataPreview({ columns, sampleData }) {
  if (!columns?.length) {
    return (
      <div style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
        No schema data available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Schema */}
      <div>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
          Schema — {columns.length} columns
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {columns.map((col) => (
            <span
              key={col.name}
              style={{
                padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                fontSize: '0.75rem', color: 'var(--color-text-primary)',
                display: 'flex', gap: '0.375rem', alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600 }}>{col.name}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>{col.type}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Sample rows */}
      {sampleData?.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
            Sample Data — {sampleData.length} rows
          </h3>
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.name} style={{ padding: '0.45rem 0.75rem', textAlign: 'left', background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.name} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row[col.name] == null ? <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>null</span> : String(row[col.name])}
                      </td>
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