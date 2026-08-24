import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mail, MessageSquare, Send, Table, Globe } from 'lucide-react';

const icons = {
  slack_send_message: MessageSquare,
  slack: MessageSquare,
  gmail_send_email: Mail,
  gmail: Mail,
  discord_post_message: Send,
  discord_send_message: Send,
  discord: Send,
  sheets_append_row: Table,
  sheets: Table,
  default: Globe
};

function ActionNode({ data, selected }) {
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
        backgroundColor: '#0c161d',
        position: 'relative'
      }}
    >
      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#34d399' }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#34d399' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon style={{ width: '16px', height: '16px' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', color: '#34d399' }}>
            ACTION / TOOL
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data?.label || 'Action Dispatch'}
          </div>
        </div>
      </div>

      {data?.config?.channel && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Target: {data.config.channel}
        </div>
      )}

      {/* Output Handles */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#34d399' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#34d399' }} />
    </div>
  );
}

export default memo(ActionNode);
