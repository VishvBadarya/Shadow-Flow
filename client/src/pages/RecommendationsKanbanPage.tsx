import React, { useState } from 'react';
import { ListTodo, CheckSquare, Clock, AlertCircle, Plus, MoreHorizontal } from 'lucide-react';

interface KanbanPageProps {
  roleUpdated: number;
}

export default function RecommendationsKanbanPage({ roleUpdated }: KanbanPageProps) {
  const [columns] = useState([
    {
      id: 'todo',
      title: 'Identified / Backlog',
      color: 'border-slate-700 bg-slate-900/30',
      textColor: 'text-slate-400',
      tasks: [
        { id: 1, title: 'Implement strict EMR PAC block', desc: 'Prevent OT booking in HIS until PAC clearance form is signed by Anaesthesia.', type: 'SYSTEM', priority: 'HIGH' },
        { id: 2, title: 'Automate Ward->Billing Discharge ping', desc: 'Trigger SMS/HIS alert to billing the moment final doctor note is saved.', type: 'SYSTEM', priority: 'HIGH' }
      ]
    },
    {
      id: 'in_progress',
      title: 'In Progress (Implementation)',
      color: 'border-amber-900/50 bg-amber-950/20',
      textColor: 'text-amber-500',
      tasks: [
        { id: 3, title: 'CSSD Real-time Tracker Dashboard', desc: 'Deploy tablet in OT showing autoclave status to stop duplicate WhatsApp indents.', type: 'PROCESS', priority: 'MEDIUM' }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring Impact',
      color: 'border-teal-900/50 bg-teal-950/20',
      textColor: 'text-teal-400',
      tasks: [
        { id: 4, title: 'Pre-auth checklist standardization', desc: 'New SOP for compiling TPA documents at admission rather than discharge.', type: 'PEOPLE', priority: 'LOW' }
      ]
    },
    {
      id: 'done',
      title: 'Validated / Closed',
      color: 'border-cosmic-800 bg-cosmic-900',
      textColor: 'text-slate-500',
      tasks: []
    }
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-teal-400" />
            Action Board & Process Interventions
          </h2>
          <p className="text-sm text-slate-400 mt-1">Track implementation of AI-recommended workflow improvements.</p>
        </div>
        <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Initiative
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
          {columns.map(col => (
            <div key={col.id} className={`flex-1 flex flex-col rounded-xl border ${col.color} p-4 max-w-sm`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${col.textColor}`}>{col.title} <span className="text-xs bg-black/20 px-2 py-0.5 rounded ml-2">{col.tasks.length}</span></h3>
                <button className="text-slate-500 hover:text-slate-300"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {col.tasks.map(task => (
                  <div key={task.id} className="bg-cosmic-950 p-4 rounded-lg border border-cosmic-800 cursor-grab active:cursor-grabbing hover:border-teal-500/50 transition-colors shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                        task.type === 'SYSTEM' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                        task.type === 'PROCESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {task.type}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                        task.priority === 'HIGH' ? 'bg-safety-alert/20 text-safety-alert border border-safety-alert/30' :
                        'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-1 leading-tight">{task.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{task.desc}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2d ago</div>
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-cosmic-800 border-2 border-cosmic-950 flex items-center justify-center text-[8px] font-bold">JD</div>
                      </div>
                    </div>
                  </div>
                ))}
                {col.tasks.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-cosmic-800 rounded-lg text-sm text-slate-500">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
