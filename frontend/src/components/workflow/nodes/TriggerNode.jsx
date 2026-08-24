import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Mail, Webhook, Clock } from 'lucide-react';

const icons = {
  webhook_trigger: Webhook,
  webhook: Webhook,
  email_trigger: Mail,
  schedule_trigger: Clock,
  default: Zap
};

function TriggerNode({ data, selected }) {
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
        backgroundColor: '#0d1322',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon style={{ width: '16px', height: '16px' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', color: '#fbbf24' }}>
            TRIGGER
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data?.label || 'Trigger Event'}
          </div>
        </div>
      </div>

      {data?.config?.source && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Source: {data.config.source}
        </div>
      )}

      {/* Handles */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#fbbf24' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#fbbf24' }} />
    </div>
  );
}

export default memo(TriggerNode);
