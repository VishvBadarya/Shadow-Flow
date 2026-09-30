import React, { useState } from 'react';
import { TestTube, Play, SlidersHorizontal, ArrowRight, BarChart3, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulatorPageProps {
  roleUpdated: number;
}

export default function SimulatorPage({ roleUpdated }: SimulatorPageProps) {
  const [running, setRunning] = useState(false);
  
  const simulationData = [
    { hour: '0', baseline: 45, optimized: 45 },
    { hour: '4', baseline: 30, optimized: 30 },
    { hour: '8', baseline: 120, optimized: 90 },
    { hour: '12', baseline: 150, optimized: 100 },
    { hour: '16', baseline: 180, optimized: 110 },
    { hour: '20', baseline: 90, optimized: 60 },
    { hour: '24', baseline: 50, optimized: 40 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <TestTube className="w-6 h-6 text-violet-400" />
        <h2 className="text-xl font-bold text-slate-100">What-If Process Simulator (Beta)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="glass-panel p-6 rounded-xl border border-cosmic-800 space-y-6">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2 border-b border-cosmic-800 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            Simulation Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex justify-between">
                <span>PAC Bypasses Blocked</span>
                <span className="text-violet-400 font-mono">100%</span>
              </label>
              <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-violet-500" />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex justify-between">
                <span>CSSD Indent Automation</span>
                <span className="text-violet-400 font-mono">80%</span>
              </label>
              <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-violet-500" />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block flex justify-between">
                <span>Pre-auth Staff Added</span>
                <span className="text-violet-400 font-mono">+2 FTEs</span>
              </label>
              <input type="range" min="0" max="5" defaultValue="2" className="w-full accent-violet-500" />
            </div>
          </div>

          <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-lg">
             <div className="flex items-start gap-2">
               <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-xs text-amber-400/80 leading-relaxed">
                 Simulation uses Discrete Event Simulation (DES) trained on historical variants. Results are probabilistic estimates.
               </p>
             </div>
          </div>

          <button 
            onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 1500); }}
            disabled={running}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {running ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Play className="w-4 h-4" />}
            {running ? 'Running Monte Carlo...' : 'Run Simulation'}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-cosmic-800">
              <div className="text-xs text-slate-500 mb-1">Avg Discharge TAT</div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-slate-400 line-through">4.2h</span>
                <span className="text-2xl font-bold text-teal-400 flex items-center"><ArrowRight className="w-4 h-4 mx-1" /> 2.1h</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-cosmic-800">
              <div className="text-xs text-slate-500 mb-1">OT Day-of Cancellations</div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-slate-400 line-through">12%</span>
                <span className="text-2xl font-bold text-teal-400 flex items-center"><ArrowRight className="w-4 h-4 mx-1" /> 3%</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-cosmic-800">
              <div className="text-xs text-slate-500 mb-1">CSSD Reworks / Day</div>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-slate-400 line-through">45</span>
                <span className="text-2xl font-bold text-teal-400 flex items-center"><ArrowRight className="w-4 h-4 mx-1" /> 8</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-cosmic-800 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Projected Queue Depth (All Workflows)
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="hour" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B', borderRadius: '0.5rem', color: '#F1F5F9' }} />
                  <Area type="monotone" dataKey="baseline" stroke="#475569" strokeWidth={2} fillOpacity={0.1} fill="#475569" name="Baseline (Current)" />
                  <Area type="monotone" dataKey="optimized" stroke="#8B5CF6" strokeWidth={2} fillOpacity={0.3} fill="#8B5CF6" name="Optimized (Simulated)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
