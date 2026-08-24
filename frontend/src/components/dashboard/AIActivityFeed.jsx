import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import AgentBadge from '../execution/AgentBadge';

export default function AIActivityFeed({ activities = [] }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
            Live Agent Reasoning Feed
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1.5s infinite' }}></span>
          STREAMING
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '340px', overflowY: 'auto' }}>
        {activities.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', color: 'var(--text-muted)' }}>
            <Terminal style={{ width: '24px', height: '24px', opacity: 0.5, marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>No agent events in stream yet.</p>
          </div>
        ) : (
          activities.map((act, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(23, 30, 46, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem'
              }}
            >
              <AgentBadge agent={act.agent || 'orchestrator'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>{act.eventType || 'STEP'}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  {act.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
