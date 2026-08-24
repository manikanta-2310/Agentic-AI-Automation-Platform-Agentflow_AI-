import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, BrainCircuit, FileText, CheckSquare, Brain } from 'lucide-react';

const icons = {
  ai_classifier: BrainCircuit,
  ai_extractor: FileText,
  ai_summarizer: CheckSquare,
  ai_reasoner: Brain,
  default: Sparkles
};

function AINode({ data, selected }) {
  const Icon = icons[data?.nodeType] || icons[data?.type] || icons.default;
  const isRunning = data?.isCurrentNode;

  return (
    <div
      className={`glass-card ${isRunning ? 'pulse-glow' : ''}`}
      style={{
        minWidth: '230px',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        border: selected ? '2px solid #6366f1' : isRunning ? '2px solid #10b981' : '1px solid var(--border-color)',
        backgroundColor: '#0f1426',
        position: 'relative'
      }}
    >
      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#818cf8' }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#818cf8' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#a5b4fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon style={{ width: '16px', height: '16px' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', color: '#a5b4fc' }}>
            AI AGENT / LLM
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data?.label || 'AI Transformation'}
          </div>
        </div>
      </div>

      {data?.config?.model && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Model: {data.config.model}
        </div>
      )}

      {/* Output Handles */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#818cf8' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#818cf8' }} />
    </div>
  );
}

export default memo(AINode);
