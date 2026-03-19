import React, { useState } from 'react';

export default function ResultsTable({ data, columns }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  if (!data?.length || !columns?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        No results to display
      </div>
    );
  }

  const handleSort = (col) => {
    if (sortKey === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col);
      setSortDir('asc');
    }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{
                  padding: '0.625rem 0.875rem', textAlign: 'left', fontWeight: 700,
                  color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem',
                  background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)',
                  cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {col} {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)', transition: 'background 0.1s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.07)'}
              onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.03)'}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={String(row[col] ?? '')}
                >
                  {row[col] == null ? <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>null</span> : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '0.5rem 0.875rem', fontSize: '0.72rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        {sorted.length} row{sorted.length !== 1 ? 's' : ''} · Click column header to sort
      </div>
    </div>
  );
}
