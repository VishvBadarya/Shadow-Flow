import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState<'7 Days' | '30 Days' | '3 Months' | '1 Year'>('30 Days');

  return (
    <PortalLayout
      role="admin"
      title="Enterprise Healthcare Analytics & BI"
      subtitle="Holistic performance metrics across inpatient admissions, clinical efficiency, and financial throughput."
    >
      {/* Date Range Selector Filter */}
      <div className="flex justify-between items-center flex-wrap gap-md" style={{ marginBottom: '28px' }}>
        <div className="flex items-center gap-xs">
          {(['7 Days', '30 Days', '3 Months', '1 Year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`btn btn-sm ${dateRange === range ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {range}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Active View: <strong>Aggregated Data for {dateRange}</strong>
        </div>
      </div>

      {/* 4 Summary Micro-Metrics */}
      <div className="grid grid-cols-4" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Monthly Encounters</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>4,920</div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)' }}>↑ 14.2% YoY growth</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Patient Retention</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--secondary-dark)', marginTop: '4px' }}>84.6%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High loyalty index</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Average Length of Stay</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>2.8 Days</div>
          <div style={{ fontSize: '12px', color: 'var(--success-dark)' }}>-0.4 days faster recovery</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Net Promoter Score</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success-dark)', marginTop: '4px' }}>89.4</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top 5% nationally</div>
        </div>
      </div>

      {/* 2 Big Charts: Monthly Appointments & Revenue Growth */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px' }}>
        {/* Chart 1: Monthly Appointments Volume Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px' }}>Monthly Appointment Volumes</h3>
            <span className="badge badge-blue">Trend: +16%</span>
          </div>

          <svg viewBox="0 0 450 180" style={{ width: '100%', height: '180px' }}>
            {/* Grid */}
            <line x1="20" y1="140" x2="430" y2="140" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="20" y1="90" x2="430" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="40" x2="430" y2="40" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

            {/* Bars */}
            {[
              { m: 'May', h: 60, val: '2.8k' },
              { m: 'Jun', h: 75, val: '3.1k' },
              { m: 'Jul', h: 85, val: '3.6k' },
              { m: 'Aug', h: 100, val: '4.2k' },
              { m: 'Sep', h: 115, val: '4.7k' },
              { m: 'Oct', h: 130, val: '5.2k' }
            ].map((bar, i) => {
              const x = 50 + i * 65;
              const y = 140 - bar.h;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width="36"
                    height={bar.h}
                    rx="6"
                    fill="#0F6CBD"
                  />
                  <text x={x + 18} y={y - 8} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="700">
                    {bar.val}
                  </text>
                  <text x={x + 18} y="160" fontSize="12" fill="#64748B" textAnchor="middle">
                    {bar.m}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chart 2: Revenue Flow Growth Area Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px' }}>Operating Revenue Stream ($M)</h3>
            <span className="badge badge-teal">Consolidated</span>
          </div>

          <svg viewBox="0 0 450 180" style={{ width: '100%', height: '180px' }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path
              d="M 40,120 L 110,105 L 190,85 L 270,70 L 350,45 L 420,25 L 420,150 L 40,150 Z"
              fill="url(#revGrad)"
            />
            <path
              d="M 40,120 L 110,105 L 190,85 L 270,70 L 350,45 L 420,25"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="3"
            />

            {[
              { x: 40, y: 120, label: '$1.2M' },
              { x: 110, y: 105, label: '$1.3M' },
              { x: 190, y: 85, label: '$1.5M' },
              { x: 270, y: 70, label: '$1.6M' },
              { x: 350, y: 45, label: '$1.8M' },
              { x: 420, y: 25, label: '$2.1M' }
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
                <text x={p.x} y={p.y - 10} fontSize="11" fill="#0F172A" textAnchor="middle" fontWeight="700">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </PortalLayout>
  );
}
