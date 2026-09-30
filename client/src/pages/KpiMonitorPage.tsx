import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { ApiService } from '../services/api';
import { KpiMetric } from '../types';

interface KpiMonitorPageProps {
  roleUpdated: number;
}

export default function KpiMonitorPage({ roleUpdated }: KpiMonitorPageProps) {
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await ApiService.getKpis();
        setKpis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, [roleUpdated]);

  // Mock historical data for sparklines
  const generateHistory = (base: number, trend: 'up' | 'down') => {
    return Array.from({ length: 14 }, (_, i) => ({
      day: `Day ${i+1}`,
      value: base + (trend === 'up' ? i * 0.5 : -i * 0.5) + (Math.random() * 2 - 1)
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-bold text-slate-100">Live Metric Targets</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpis.map(kpi => {
          const isBetter = kpi.is_higher_better 
            ? kpi.current_value >= kpi.target_value 
            : kpi.current_value <= kpi.target_value;
          
          const trend = kpi.is_higher_better ? 'up' : 'down';
          const history = generateHistory(kpi.current_value - (trend === 'up' ? 5 : -5), trend);
          
          return (
            <div key={kpi.id} className="glass-panel p-6 rounded-xl border border-cosmic-800 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-slate-200 text-lg mb-1">{kpi.kpi_name.replace(/_/g, ' ')}</h3>
                  <div className="text-sm text-slate-500">{kpi.department}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isBetter ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'}`}>
                  {isBetter ? 'ON TARGET' : 'AT RISK'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Current</div>
                  <div className={`text-3xl font-bold ${isBetter ? 'text-teal-400' : 'text-amber-500'}`}>{kpi.current_value}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Target</div>
                  <div className="text-xl font-bold text-slate-300">{kpi.target_value}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Variance</div>
                  <div className="text-xl font-bold text-slate-300">
                    {Math.abs(kpi.current_value - kpi.target_value).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="h-32 mt-auto w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '0.5rem', color: '#F1F5F9' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={isBetter ? '#14B8A6' : '#F59E0B'} 
                      strokeWidth={3} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
