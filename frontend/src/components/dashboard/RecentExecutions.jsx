import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowUpRight, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function RecentExecutions({ executions = [] }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
            Recent Multi-Agent Runs
          </h3>
        </div>
        <Link
          to="/executions"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#818cf8', fontWeight: '600' }}
        >
          <span>View All</span>
          <ArrowUpRight style={{ width: '14px', height: '14px' }} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {executions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            No executions recorded yet. Run a workflow to view live telemetry.
          </div>
        ) : (
          executions.map((exec) => (
            <Link
              key={exec._id}
              to={`/executions?id=${exec._id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(23, 30, 46, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                transition: 'background 0.15s ease'
              }}
              className="glass-card"
            >
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ffffff' }}>
                  {exec.workflow?.name || 'Automated Pipeline Run'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                  <Clock style={{ width: '10px', height: '10px' }} />
                  <span>{new Date(exec.createdAt).toLocaleTimeString()}</span>
                  <span>•</span>
                  <span>{exec.durationMs ? `${exec.durationMs}ms` : 'In-flight'}</span>
                </div>
              </div>

              <StatusBadge status={exec.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
