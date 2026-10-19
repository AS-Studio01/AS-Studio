import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const DEMO_META = {
  'mitti-cafe': { name: 'Mitti Café', pkg: 'Starter ($95)', color: '#b98a50' },
  'rao-law': { name: 'Rao & Partners', pkg: 'Starter ($95)', color: '#2a6159' },
  'vitalcare': { name: 'VitalCare Clinic', pkg: 'Growth ($275)', color: '#0d9488' },
  'fold-atelier': { name: 'Fold Atelier', pkg: 'Growth ($275)', color: '#8b5cf6' },
  'apex-residences': { name: 'Apex Residences', pkg: 'Signature ($600)', color: '#d97706' },
  'atelier-north': { name: 'Atelier North', pkg: 'Signature ($600)', color: '#16a34a' },
  'delta-os': { name: 'Delta.OS AI', pkg: 'Flagship Platform', color: '#00f2fe' },
  'studio': { name: 'Studio Home', pkg: 'Direct Brief', color: '#6366f1' }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: '#1a1815',
        color: '#f8f6f0',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{data.name}</div>
        <div style={{ color: '#b98a50', fontSize: '11px', marginBottom: '6px' }}>{data.package}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>{data.views}</span>
          <span style={{ color: '#a8a29e' }}>hits ({data.share}% share)</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TrafficChartApp() {
  const [analytics, setAnalytics] = useState({ totalViews: 0, demoViews: {}, recentViews: [] });
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.warn('[Recharts Analytics Fetch Error]', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const handleUpdate = () => fetchAnalytics();
    window.addEventListener('analyticsRefreshed', handleUpdate);
    return () => window.removeEventListener('analyticsRefreshed', handleUpdate);
  }, []);

  const total = analytics.totalViews || 0;
  const demoViews = analytics.demoViews || {};

  const barData = Object.keys(DEMO_META).map(key => {
    const count = demoViews[key] || 0;
    const share = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      id: key,
      name: DEMO_META[key].name,
      package: DEMO_META[key].pkg,
      views: count,
      share,
      color: DEMO_META[key].color
    };
  });

  const pieData = [
    {
      name: 'Starter ($95)',
      value: (demoViews['mitti-cafe'] || 0) + (demoViews['rao-law'] || 0),
      color: '#b98a50'
    },
    {
      name: 'Growth ($275)',
      value: (demoViews['vitalcare'] || demoViews['nova-dental'] || 0) + (demoViews['fold-atelier'] || 0),
      color: '#0d9488'
    },
    {
      name: 'Signature ($600)',
      value: (demoViews['apex-residences'] || 0) + (demoViews['atelier-north'] || 0),
      color: '#d97706'
    },
    {
      name: 'Direct Studio',
      value: demoViews['studio'] || 0,
      color: '#6366f1'
    }
  ].filter(item => item.value > 0);

  // Fallback pie slice if zero views recorded yet
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'Starter Tier ($95)', value: 1, color: '#b98a50' },
    { name: 'Growth Tier ($275)', value: 1, color: '#0d9488' },
    { name: 'Signature Tier ($600)', value: 1, color: '#d97706' },
    { name: 'Studio Direct', value: 1, color: '#6366f1' }
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--line, #e2ded4)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      fontFamily: 'inherit'
    }}>
      {/* Visual Chart Header & Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid var(--line, #e2ded4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--mono, monospace)',
            background: 'rgba(185,138,80,0.12)',
            color: '#b98a50',
            padding: '3px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            RECHARTS VISUALIZATION
          </span>
          <span style={{ fontSize: '13px', color: '#737067' }}>
            {loading ? 'Refreshing...' : `Visualizing ${total} total telemetry events`}
          </span>
        </div>

        {/* View Toggle Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: '#f5f2e9', padding: '3px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: chartType === 'bar' ? 600 : 400,
              background: chartType === 'bar' ? '#ffffff' : 'transparent',
              color: chartType === 'bar' ? '#1a1815' : '#737067',
              border: 'none',
              borderRadius: '6px',
              boxShadow: chartType === 'bar' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer'
            }}
          >
            Demo Engagement (Bar)
          </button>
          <button
            type="button"
            onClick={() => setChartType('pie')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: chartType === 'pie' ? 600 : 400,
              background: chartType === 'pie' ? '#ffffff' : 'transparent',
              color: chartType === 'pie' ? '#1a1815' : '#737067',
              border: 'none',
              borderRadius: '6px',
              boxShadow: chartType === 'pie' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer'
            }}
          >
            Package Tier Share (Donut)
          </button>
        </div>
      </div>

      {/* Dynamic Recharts Container */}
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#737067', fontSize: 11 }}
                axisLine={{ stroke: '#e2ded4' }}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#737067', fontSize: 11 }}
                axisLine={{ stroke: '#e2ded4' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={displayPieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {displayPieData.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [`${val} visits`, name]}
                contentStyle={{
                  background: '#1a1815',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '12px', color: '#737067' }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Real-time KPI Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--line, #e2ded4)'
      }}>
        {barData.map(item => (
          <div
            key={item.id}
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              background: '#faf8f3',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#333' }}>{item.name}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mount to DOM
const rootEl = document.getElementById('trafficRechartsRoot');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<TrafficChartApp />);
}
