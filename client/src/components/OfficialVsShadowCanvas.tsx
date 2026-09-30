import React, { useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, MarkerType, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProcessGraphData } from '../types';
import { Activity, Clock, Clock4, AlertTriangle } from 'lucide-react';

interface OfficialVsShadowCanvasProps {
  data: ProcessGraphData | null;
  viewMode: 'split' | 'overlay';
}

const CustomNode = ({ data }: any) => {
  const isBottleneck = data.node.is_bottleneck;
  
  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[220px] shadow-lg transition-all ${
      isBottleneck ? 'border-amber-500 bg-amber-950/40 shadow-glow-amber' : 
      data.node.is_required ? 'border-teal-500/50 bg-cosmic-900 shadow-glow-teal' : 'border-cosmic-700 bg-cosmic-800'
    }`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-teal-400" />
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">{data.node.department}</span>
          {isBottleneck && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
        </div>
        
        <h3 className="text-sm font-semibold text-slate-100 leading-tight mb-2">{data.node.label}</h3>
        
        <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1 text-slate-400" title="Median Queue Time">
            <Clock4 className="w-3 h-3" />
            <span className={isBottleneck ? 'text-amber-400 font-medium' : ''}>{data.node.queue_time_minutes}m w</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400" title="Median Service Time">
            <Activity className="w-3 h-3" />
            <span>{data.node.service_time_minutes}m s</span>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-teal-400" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function OfficialVsShadowCanvas({ data, viewMode }: OfficialVsShadowCanvasProps) {
  if (!data) return <div className="flex items-center justify-center h-full text-slate-500">No process data available.</div>;

  // Simple auto-layout algorithm for nodes
  const buildElements = () => {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    // Position official nodes in a straight vertical line
    const offNodes = data.process_model.official_graph.nodes;
    const ySpacing = 160;
    
    // Map to quickly look up official Y positions
    const officialYMap = new Map<string, number>();
    
    offNodes.forEach((n, idx) => {
      const yPos = idx * ySpacing;
      officialYMap.set(n.id, yPos);
      
      const statNode = data.nodes.find(sn => sn.id === n.id) || { ...n, frequency: 0, median_duration_minutes: 0, queue_time_minutes: 0, service_time_minutes: 0, is_bottleneck: false };
      
      nodes.push({
        id: n.id,
        type: 'custom',
        position: { x: 300, y: yPos },
        data: { node: statNode }
      });
    });
    
    // Position shadow/unofficial nodes offset to the right
    let shadowIndex = 0;
    data.nodes.forEach(n => {
      if (!officialYMap.has(n.id)) {
        nodes.push({
          id: n.id,
          type: 'custom',
          position: { x: 700, y: (shadowIndex + 0.5) * ySpacing },
          data: { node: n }
        });
        shadowIndex++;
      }
    });
    
    // Add edges
    data.edges.forEach(e => {
      const isShadow = e.is_shadow;
      const isWhatsApp = e.channel === 'WhatsApp';
      
      // Edge thickness based on frequency
      const strokeWidth = Math.max(1, Math.min(6, (e.frequency_pct / 100) * 10));
      
      edges.push({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: isShadow,
        style: { 
          strokeWidth,
          stroke: isWhatsApp ? '#F59E0B' : (isShadow ? '#8B5CF6' : '#14B8A6'),
          strokeDasharray: isShadow ? '6 4' : 'none'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isWhatsApp ? '#F59E0B' : (isShadow ? '#8B5CF6' : '#14B8A6'),
        },
        className: isShadow ? 'shadow-flow-edge' : 'official-flow-edge'
      });
    });

    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildElements(), [data, viewMode]);
  
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] rounded-xl border border-cosmic-800 bg-cosmic-950 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-cosmic-950"
      >
        <Background color="#1E293B" gap={20} size={1} />
        <Controls className="bg-cosmic-900 border-cosmic-700 fill-slate-300" />
        <MiniMap 
          nodeColor={(n: any) => n.data?.node?.is_bottleneck ? '#F59E0B' : '#14B8A6'} 
          maskColor="rgba(11, 15, 25, 0.7)"
          className="bg-cosmic-900 border-cosmic-800"
        />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 glass-panel p-3 rounded-lg text-xs space-y-2">
        <h4 className="font-semibold text-slate-200 mb-2">Flow Legend</h4>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-6 h-0.5 bg-teal-500"></div> <span>Official SOP Step</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-6 h-0.5 bg-violet-500 border-t-2 border-dashed border-violet-500"></div> <span>Shadow Workaround</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-6 h-0.5 bg-amber-500 border-t-2 border-dashed border-amber-500"></div> <span>WhatsApp / Off-System</span>
        </div>
      </div>
    </div>
  );
}
