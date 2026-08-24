import React from 'react';
import { Layers, Save, Play } from 'lucide-react';
import WorkflowCanvas from './WorkflowCanvas';

export default function GraphPreviewPanel({ generatedData, onSaveAndOpen, onExecuteNow, isSaving }) {
  if (!generatedData) {
    return (
      <div
        className="glass-panel"
        style={{
          height: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--text-muted)',
          padding: '2rem'
        }}
      >
        <Layers style={{ width: '40px', height: '40px', opacity: 0.4, marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
          No Workflow Generated Yet
        </h3>
        <p style={{ fontSize: '0.8rem', maxWidth: '380px', marginTop: '0.25rem' }}>
          Enter a prompt above and click "Generate Workflow Graph" to preview your live multi-agent canvas.
        </p>
      </div>
    );
  }

  const nodeCount = generatedData.nodes?.length || 0;
  const edgeCount = generatedData.edges?.length || 0;

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'rgba(9, 13, 22, 0.9)'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
            {generatedData.name || 'AI Generated Graph'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {generatedData.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
            {nodeCount} Nodes | {edgeCount} Edges
          </span>

          <button
            onClick={onSaveAndOpen}
            disabled={isSaving}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Save style={{ width: '14px', height: '14px' }} />
            <span>Save to Canvas</span>
          </button>

          <button
            onClick={onExecuteNow}
            disabled={isSaving}
            className="btn btn-success"
            style={{ padding: '0.45rem 1rem' }}
          >
            <Play style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
            <span>Save & Execute Now</span>
          </button>
        </div>
      </div>

      {/* Interactive Preview Canvas */}
      <div style={{ height: '420px', width: '100%', position: 'relative' }}>
        <WorkflowCanvas
          readOnly={false}
          customNodes={generatedData.nodes}
          customEdges={generatedData.edges}
        />
      </div>
    </div>
  );
}
