import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ProcessGraphData } from '../types/processMining';
import { Activity, Clock4, AlertTriangle } from 'lucide-react';

interface OfficialVsShadowCanvasProps {
  data: ProcessGraphData | null;
  viewMode?: 'split' | 'overlay';
}

const CustomNode = ({ data }: any) => {
  const isBottleneck = data.node.is_bottleneck;

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '10px',
        border: isBottleneck ? '2px solid #F59E0B' : data.node.is_required ? '2px solid #14B8A6' : '1px solid #CBD5E1',
        backgroundColor: isBottleneck ? '#FEF3C7' : data.node.is_required ? '#F0FDFA' : '#FFFFFF',
        minWidth: '220px',
        boxShadow: isBottleneck ? '0 4px 14px rgba(245, 158, 11, 0.25)' : '0 4px 12px rgba(15, 23, 42, 0.08)',
        color: '#0F172A',
        transition: 'all 0.2s ease'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#14B8A6', width: '8px', height: '8px' }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', color: '#64748B' }}>
            {data.node.department}
          </span>
          {isBottleneck && <AlertTriangle size={14} color="#D97706" />}
        </div>

        <h3 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px 0', lineHeight: 1.3, color: '#0F172A' }}>
          {data.node.label}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isBottleneck ? '#B45309' : '#64748B' }}>
            <Clock4 size={12} />
            <span>{data.node.queue_time_minutes ?? 0}m queue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
            <Activity size={12} />
            <span>{data.node.service_time_minutes ?? 0}m svc</span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#14B8A6', width: '8px', height: '8px' }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function OfficialVsShadowCanvas({ data, viewMode = 'overlay' }: OfficialVsShadowCanvasProps) {
  if (!data) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#94A3B8' }}>No clinical process flow loaded.</div>;

  const buildElements = () => {
    const nodes: any[] = [];
    const edges: any[] = [];

    const offNodes = data.process_model.official_graph?.nodes || [];
    const ySpacing = 150;
    const officialYMap = new Map<string, number>();

    offNodes.forEach((n, idx) => {
      const yPos = idx * ySpacing;
      officialYMap.set(n.id, yPos);

      const statNode = data.nodes.find((sn) => sn.id === n.id) || {
        ...n,
        frequency: 0,
        median_duration_minutes: 0,
        queue_time_minutes: 0,
        service_time_minutes: 0,
        is_bottleneck: false
      };

      nodes.push({
        id: n.id,
        type: 'custom',
        position: { x: 260, y: yPos },
        data: { node: statNode }
      });
    });

    let shadowIndex = 0;
    data.nodes.forEach((n) => {
      if (!officialYMap.has(n.id)) {
        nodes.push({
          id: n.id,
          type: 'custom',
          position: { x: 620, y: (shadowIndex + 0.5) * ySpacing },
          data: { node: n }
        });
        shadowIndex++;
      }
    });

    data.edges.forEach((e) => {
      const isShadow = e.is_shadow;
      const isWhatsApp = e.channel === 'WhatsApp';
      const strokeWidth = Math.max(1.5, Math.min(5, (e.frequency_pct / 100) * 8));

      edges.push({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: isShadow,
        style: {
          strokeWidth,
          stroke: isWhatsApp ? '#F59E0B' : isShadow ? '#8B5CF6' : '#0F6CBD',
          strokeDasharray: isShadow ? '5 5' : 'none'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isWhatsApp ? '#F59E0B' : isShadow ? '#8B5CF6' : '#0F6CBD'
        }
      });
    });

    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildElements(), [data, viewMode]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      style={{
        width: '100%',
        height: '560px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#CBD5E1" gap={24} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(n: any) => (n.data?.node?.is_bottleneck ? '#F59E0B' : '#0F6CBD')}
          maskColor="rgba(241, 245, 249, 0.7)"
        />
      </ReactFlow>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Workflow Legend</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '3px', backgroundColor: '#0F6CBD' }}></span>
            <span>Official SOP BPMN Step</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '3px', borderTop: '2px dashed #8B5CF6' }}></span>
            <span>Shadow Workaround Variant</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '3px', borderTop: '2px dashed #F59E0B' }}></span>
            <span>WhatsApp / Paper Indent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
