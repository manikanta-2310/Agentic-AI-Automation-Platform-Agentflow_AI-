import React, { useState } from 'react';
import { Terminal, Copy, Check, Filter } from 'lucide-react';

export default function ExecutionLogViewer({ logs = [] }) {
  const [copied, setCopied] = useState(false);
  const [filterLevel, setFilterLevel] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterLevel === 'ALL') return true;
    return (l.level || '').toUpperCase() === filterLevel;
  });

  const handleCopy = () => {
    const text = JSON.stringify(logs, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Raw Telemetry Stream</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="select"
            style={{ padding: '2px 8px', fontSize: '0.7rem', width: 'auto' }}
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>

          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem' }}
          >
            {copied ? <Check style={{ width: '12px', height: '12px', color: 'var(--color-emerald)' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      <div
        style={{
          maxHeight: '340px',
          overflowY: 'auto',
          backgroundColor: '#070a10',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
            No logs matching filter.
          </div>
        ) : (
          filteredLogs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', lineHeight: '1.4' }}>
              <span style={{ color: 'var(--text-muted)' }}>[{new Date(l.timestamp || Date.now()).toLocaleTimeString()}]</span>
              <span style={{ color: '#818cf8', fontWeight: '700' }}>[{l.agent?.toUpperCase() || 'ORCHESTRATOR'}]</span>
              <span style={{ color: l.level === 'error' ? 'var(--color-rose)' : l.level === 'success' ? 'var(--color-emerald)' : '#cbd5e1' }}>
                {l.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
