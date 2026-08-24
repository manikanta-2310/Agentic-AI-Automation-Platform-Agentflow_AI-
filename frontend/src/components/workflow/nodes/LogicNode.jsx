import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitFork, Filter, RefreshCw, GitBranch } from 'lucide-react';

const icons = {
  condition_branch: GitBranch,
  filter_data: Filter,
  filter: Filter,
  delay: RefreshCw,
  default: GitFork
};

function LogicNode({ data, selected }) {
  const Icon = icons[data?.nodeType] || icons[data?.type] || icons.default;
  const isRunning = data?.isCurrentNode;

  return (
    <div
      className={`glass-card ${isRunning ? 'pulse-glow' : ''}`}
      style={{
        minWidth: '220px',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        border: selected ? '2px solid #6366f1' : isRunning ? '2px solid #10b981' : '1px solid var(--border-color)',
        backgroundColor: '#121226',
        position: 'relative'
      }}
    >
      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#c084fc' }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#c084fc' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon style={{ width: '16px', height: '16px' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', color: '#c084fc' }}>
            LOGIC & ROUTING
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data?.label || 'Condition Branch'}
          </div>
        </div>
      </div>

      {data?.config?.field && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          If: {data.config.field} {data.config.operator || '=='} {data.config.value || 'true'}
        </div>
      )}

      {/* Output Handles */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#c084fc' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#c084fc' }} />
    </div>
  );
}

export default memo(LogicNode);
