import React, { useMemo } from 'react';
import { Map, CalendarDays, TrendingUp, Clock, AlertTriangle, Layers } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface HeatmapViewProps {
  roleUpdated: number;
}

export default function HeatmapView({ roleUpdated }: HeatmapViewProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const heatmapData = useMemo(() => {
    const data: Array<{ day: number; hour: number; intensity: number }> = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        let intensity = 10 + Math.sin((h / 24) * Math.PI) * 15;
        // Peak weekday morning rush (PAC clearance & first surgery starts)
        if (d < 5 && h >= 7 && h <= 11) {
          intensity += 50 + (h === 9 ? 30 : 15);
        }
        // Evening discharge bottleneck
        if (d < 5 && h >= 15 && h <= 18) {
          intensity += 42;
        }
        // Weekend emergency peaks
        if (d >= 5 && h >= 11 && h <= 14) {
          intensity += 25;
        }
        data.push({ day: d, hour: h, intensity: Math.min(100, Math.round(intensity)) });
      }
    }
    return data;
  }, [roleUpdated]);

  const getHeatmapColor = (intensity: number) => {
    if (intensity < 25) return '#F1F5F9';
    if (intensity < 45) return '#CCFBF1'; // Teal light
    if (intensity < 65) return '#5EEAD4'; // Teal medium
    if (intensity < 82) return '#FDE68A'; // Amber warning
    return '#FCA5A5'; // Red alert
  };

  const getHeatmapBorder = (intensity: number) => {
    if (intensity >= 82) return '1px solid #EF4444';
    if (intensity >= 65) return '1px solid #F59E0B';
    return '1px solid rgba(0,0,0,0.06)';
  };

  const trendData = [
    { time: '00:00', volume: 12, delays: 2 },
    { time: '04:00', volume: 8, delays: 1 },
    { time: '07:00', volume: 45, delays: 12 },
    { time: '09:00', volume: 92, delays: 38 },
    { time: '11:00', volume: 88, delays: 29 },
    { time: '14:00', volume: 64, delays: 18 },
    { time: '16:00', volume: 76, delays: 31 },
    { time: '19:00', volume: 42, delays: 14 },
    { time: '22:00', volume: 20, delays: 4 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Map size={20} color="var(--primary)" />
            Spatiotemporal Friction & Bottleneck Matrix
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            Multi-dimensional mapping of clinical queue wait times across 24-hour cycles and calendar days
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Heatmap Matrix Card */}
        <div className="ci-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Hourly Queue Friction (Hour vs Day of Week)
              </h3>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>Smooth</span>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#F1F5F9', border: '1px solid var(--border)' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#CCFBF1' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#5EEAD4' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#FDE68A' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#FCA5A5', border: '1px solid #EF4444' }}></span>
              <span>Severe</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', paddingBottom: '12px' }}>
            <div style={{ minWidth: '650px' }}>
              {/* Hours Header (Every 2 hours) */}
              <div style={{ display: 'flex', marginLeft: '45px', marginBottom: '6px' }}>
                {hours.filter((h) => h % 2 === 0).map((h) => (
                  <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Day rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {days.map((day, dIdx) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '38px', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>
                      {day}
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
                      {hours.map((hour) => {
                        const cell = heatmapData.find((c) => c.day === dIdx && c.hour === hour);
                        const intensity = cell?.intensity || 0;
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className="ci-heat-cell"
                            style={{
                              flex: 1,
                              backgroundColor: getHeatmapColor(intensity),
                              border: getHeatmapBorder(intensity)
                            }}
                            title={`${day} at ${hour.toString().padStart(2, '0')}:00 — Delay Intensity: ${intensity}%`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Friction insight notice */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
              <strong>Primary Friction Hotspot:</strong> Mon-Fri between 08:30 and 10:30, OT queue builds up due to delayed PAC clearance sign-offs and unverified fasting protocols.
            </div>
          </div>
        </div>

        {/* Volume vs Delay Trend Chart */}
        <div className="ci-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <TrendingUp size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Case Volume vs. Surgical Delays
            </h3>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Correlation of active operating theater admissions vs. minute delays over the 24h operational cycle.
          </p>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F6CBD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0F6CBD" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0F6CBD" strokeWidth={2} fillOpacity={1} fill="url(#volGradient)" name="Active Cases" />
                <Area type="monotone" dataKey="delays" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#delayGradient)" name="Delayed Minutes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#0F6CBD' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Active Case Load</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '3px', backgroundColor: '#EF4444' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Delay Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
