import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Edit, Clock, Layers } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function WorkflowCard({ workflow, onExecute }) {
  const nodeCount = workflow.nodes?.length || 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
              {workflow.name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.4' }}>
              {workflow.description || 'Custom multi-agent automated graph.'}
            </p>
          </div>
          <StatusBadge status={workflow.status} />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#171e2e',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <Layers style={{ width: '12px', height: '12px', color: '#818cf8' }} />
            {nodeCount} nodes
          </span>

          {(workflow.tags || []).map((t, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Clock style={{ width: '12px', height: '12px' }} />
          <span>
            {workflow.lastExecutedAt
              ? new Date(workflow.lastExecutedAt).toLocaleDateString()
              : 'Never executed'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {onExecute && (
            <button
              onClick={() => onExecute(workflow._id)}
              className="btn btn-success"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              <Play style={{ width: '12px', height: '12px', fill: 'currentColor' }} />
              <span>Run</span>
            </button>
          )}

          <Link
            to={`/workflows/${workflow._id}`}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Edit style={{ width: '12px', height: '12px' }} />
            <span>Open Canvas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
