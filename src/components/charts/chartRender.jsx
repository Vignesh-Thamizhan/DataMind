import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  ArcElement, PointElement, Tooltip, Legend, Title, Filler
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Tooltip, Legend, Title, Filler);

const PALETTE = ['#6366f1', '#8b5cf6', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8'];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, boxWidth: 14 } },
    tooltip: {
      backgroundColor: 'rgba(15,21,35,0.95)',
      borderColor: 'rgba(99,102,241,0.3)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 12,
    },
  },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(99,102,241,0.06)' },
    },
    y: {
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(99,102,241,0.06)' },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16 } },
    tooltip: baseOptions.plugins.tooltip,
  },
};

function buildChartData(type, data, xKey, yKey) {
  if (!data?.length || !xKey || !yKey) return null;
  const labels = data.map(r => String(r[xKey] ?? ''));
  const values = data.map(r => Number(r[yKey]) || 0);

  if (type === 'pie') {
    return {
      labels,
      datasets: [{ data: values, backgroundColor: PALETTE, borderColor: PALETTE.map(c => `${c}99`), borderWidth: 1 }],
    };
  }
  if (type === 'scatter') {
    return {
      datasets: [{
        label: `${xKey} vs ${yKey}`,
        data: data.map(r => ({ x: Number(r[xKey]) || 0, y: Number(r[yKey]) || 0 })),
        backgroundColor: '#6366f188',
        borderColor: '#6366f1',
        pointRadius: 5,
      }],
    };
  }
  return {
    labels,
    datasets: [{
      label: yKey,
      data: values,
      backgroundColor: type === 'line' ? '#6366f130' : PALETTE[0] + 'cc',
      borderColor: PALETTE[0],
      borderWidth: 2,
      pointBackgroundColor: PALETTE[0],
      pointRadius: 4,
      fill: type === 'line',
      tension: 0.4,
    }],
  };
}

export default function ChartRenderer({ type, data, xKey, yKey, title }) {
  if (!data?.length || !type) return null;

  const chartData = buildChartData(type, data, xKey, yKey);
  if (!chartData) return null;

  const opts = type === 'pie' ? pieOptions : {
    ...baseOptions,
    plugins: { ...baseOptions.plugins, title: title ? { display: true, text: title, color: '#f1f5f9', font: { family: 'Inter', size: 14, weight: '600' }, padding: { bottom: 16 } } : undefined },
  };

  const height = 280;
  const style = { height };

  try {
    switch (type) {
      case 'bar': return <div style={style}><Bar data={chartData} options={opts} /></div>;
      case 'line': return <div style={style}><Line data={chartData} options={opts} /></div>;
      case 'pie': return <div style={style}><Pie data={chartData} options={opts} /></div>;
      case 'scatter': return <div style={style}><Scatter data={chartData} options={{ ...opts, scales: { x: opts.scales?.x, y: opts.scales?.y } }} /></div>;
      case 'histogram': return <div style={style}><Bar data={chartData} options={opts} /></div>;
      default: return null;
    }
  } catch {
    return <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>Chart rendering failed</div>;
  }
}