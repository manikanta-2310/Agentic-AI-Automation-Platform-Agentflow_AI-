import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, Info, ShieldAlert } from 'lucide-react';
import AgentBadge from './AgentBadge';

const levelIcons = {
  success: { icon: CheckCircle2, color: 'var(--color-emerald)' },
  info: { icon: Info, color: 'var(--color-blue)' },
  warning: { icon: AlertTriangle, color: 'var(--color-amber)' },
  error: { icon: XCircle, color: 'var(--color-rose)' }
};

export default function ExecutionTimeline({ timeline = [] }) {
  if (timeline.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Clock style={{ width: '32px', height: '32px', opacity: 0.4, margin: '0 auto 0.5rem auto' }} />
        <p style={{ fontSize: '0.85rem' }}>No timeline events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.25rem' }}>
        Multi-Agent Audit Timeline ({timeline.length} Steps)
      </h3>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem' }}>
        {/* Timeline bar */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '10px',
            bottom: '10px',
            width: '2px',
            backgroundColor: 'var(--border-color)'
          }}
        />

        {timeline.map((item, idx) => {
          const lvlCfg = levelIcons[item.level] || levelIcons.info;
          const Icon = lvlCfg.icon;

          return (
            <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  top: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#090d16',
                  border: `2px solid ${lvlCfg.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: lvlCfg.color }} />
              </div>

              {/* Event Content Card */}
              <div
                className="glass-card"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderLeft: `3px solid ${lvlCfg.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AgentBadge agent={item.agent} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>
                      {item.eventType}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : `Step ${idx + 1}`}
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {item.message}
                </p>

                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <pre
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#090d16',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      overflowX: 'auto'
                    }}
                  >
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
