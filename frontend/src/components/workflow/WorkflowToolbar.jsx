import React from 'react';
import { Save, Play, Copy, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkflowStore } from '../../store/workflowStore';

export default function WorkflowToolbar({ workflowName, onSave, onExecute, onDuplicate, isSaving, isExecuting }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'rgba(9, 13, 22, 0.95)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.6rem' }}
          title="Back to Dashboard"
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
        </button>

        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
            {workflowName || 'Untitled Workflow'}
          </h2>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Visual Graph Editor (React Flow)
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem' }}
            title="Duplicate Workflow"
          >
            <Copy style={{ width: '14px', height: '14px' }} />
            <span>Duplicate</span>
          </button>
        )}

        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.85rem' }}
        >
          <Save style={{ width: '14px', height: '14px' }} />
          <span>{isSaving ? 'Saving...' : 'Save Graph'}</span>
        </button>

        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="btn btn-success"
          style={{ padding: '0.45rem 1rem' }}
        >
          <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
          <span>{isExecuting ? 'Starting Agent...' : 'Execute Now'}</span>
        </button>
      </div>
    </div>
  );
}
