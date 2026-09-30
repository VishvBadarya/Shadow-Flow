import React from 'react';
import { Map, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HeatmapPageProps {
  roleUpdated: number;
}

export default function HeatmapPage({ roleUpdated }: HeatmapPageProps) {
  // Mock data for the heatmap visualization (simulating hour of day vs day of week bottlenecks)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const generateHeatmapData = () => {
    const data = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        // Create hot spots around 8-10am and 4-6pm on weekdays
        let intensity = Math.random() * 20;
        if (d < 5) {
          if (h >= 8 && h <= 11) intensity += 40 + Math.random() * 40; // Morning rush (PAC/Discharges)
          if (h >= 16 && h <= 19) intensity += 30 + Math.random() * 30; // Evening rush
        }
        data.push({ day: d, hour: h, intensity: Math.min(100, intensity) });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getHeatmapColor = (intensity: number) => {
    if (intensity < 20) return 'bg-cosmic-900 border-cosmic-800';
    if (intensity < 40) return 'bg-teal-900/40 border-teal-800/50';
    if (intensity < 60) return 'bg-teal-700/60 border-teal-600/70';
    if (intensity < 80) return 'bg-amber-600/80 border-amber-500/90 shadow-glow-amber-sm';
    return 'bg-safety-alert border-safety-alert shadow-glow-red z-10 scale-110';
  };

  // Mock data for overall volume trend
  const trendData = [
    { time: '00:00', volume: 10, delays: 2 },
    { time: '04:00', volume: 5, delays: 1 },
    { time: '08:00', volume: 65, delays: 15 },
    { time: '10:00', volume: 85, delays: 30 },
    { time: '12:00', volume: 60, delays: 20 },
    { time: '16:00', volume: 75, delays: 25 },
    { time: '20:00', volume: 40, delays: 10 },
    { time: '23:59', volume: 15, delays: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Map className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-bold text-slate-100">Friction Heatmap & Spatiotemporal Analysis</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap Matrix */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-xl border border-cosmic-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Bottleneck Intensity (Time of Day vs Day of Week)
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Low</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-cosmic-900"></div>
                <div className="w-3 h-3 rounded-sm bg-teal-900/40"></div>
                <div className="w-3 h-3 rounded-sm bg-teal-700/60"></div>
                <div className="w-3 h-3 rounded-sm bg-amber-600/80"></div>
                <div className="w-3 h-3 rounded-sm bg-safety-alert"></div>
              </div>
              <span>Severe</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* X Axis Labels (Hours) */}
              <div className="flex ml-12 mb-2">
                {hours.filter(h => h % 2 === 0).map(h => (
                  <div key={h} className="flex-1 text-xs text-slate-500 text-center">
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              {/* Matrix */}
              <div className="space-y-1">
                {days.map((day, dIdx) => (
                  <div key={day} className="flex items-center gap-2">
                    <div className="w-10 text-xs font-medium text-slate-400 text-right shrink-0">{day}</div>
                    <div className="flex-1 flex gap-1">
                      {hours.map(hour => {
                        const cell = heatmapData.find(c => c.day === dIdx && c.hour === hour);
                        return (
                          <div 
                            key={`${day}-${hour}`}
                            className={`flex-1 aspect-square rounded-sm border transition-all duration-300 hover:scale-150 hover:z-20 cursor-crosshair ${getHeatmapColor(cell?.intensity || 0)}`}
                            title={`${day} ${hour.toString().padStart(2, '0')}:00 - Intensity: ${Math.round(cell?.intensity || 0)}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trend Graph */}
        <div className="glass-panel p-6 rounded-xl border border-cosmic-800 flex flex-col">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            Volume vs Delay Correlation
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Analysis indicates that queue times degrade non-linearly when concurrent hospital volume exceeds 60 active cases per hour.
          </p>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDelays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '0.5rem', color: '#F1F5F9' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" name="Active Cases" />
                <Area type="monotone" dataKey="delays" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorDelays)" name="Delayed Steps" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
