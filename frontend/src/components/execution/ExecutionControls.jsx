import React from 'react';
import { Play, Pause, Square, RefreshCw } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ExecutionControls({ execution, onPause, onResume, onCancel, isMutating }) {
  if (!execution) return null;

  const status = execution.status;
  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';
  const isTerminated = ['COMPLETED', 'FAILED', 'CANCELLED'].includes(status);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
            {execution.workflow?.name || 'Workflow Execution'}
          </h2>
          <StatusBadge status={status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <span>Run ID: {execution._id}</span>
          <span>•</span>
          <span>Duration: {execution.durationMs ? `${execution.durationMs}ms` : 'In-flight'}</span>
          <span>•</span>
          <span>Retries: {execution.retryCount || 0}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isRunning && onPause && (
          <button
            onClick={onPause}
            disabled={isMutating}
            className="btn btn-secondary"
          >
            <Pause style={{ width: '14px', height: '14px' }} />
            <span>Pause Run</span>
          </button>
        )}

        {isPaused && onResume && (
          <button
            onClick={onResume}
            disabled={isMutating}
            className="btn btn-success"
          >
            <Play style={{ width: '14px', height: '14px' }} />
            <span>Resume Run</span>
          </button>
        )}

        {!isTerminated && onCancel && (
          <button
            onClick={onCancel}
            disabled={isMutating}
            className="btn btn-danger"
          >
            <Square style={{ width: '14px', height: '14px' }} />
            <span>Cancel Run</span>
          </button>
        )}
      </div>
    </div>
  );
}
