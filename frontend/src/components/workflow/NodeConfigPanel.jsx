import React, { useState, useEffect } from 'react';
import { X, Trash2, Settings, Sparkles } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export default function NodeConfigPanel() {
  const { selectedNode, selectNode, updateNodeData, removeNode } = useWorkflowStore();
  const [config, setConfig] = useState({});
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data?.label || '');
      setConfig(selectedNode.data?.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleConfigChange = (key, value) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      config: updated
    });
  };

  const handleLabelChange = (newLabel) => {
    setLabel(newLabel);
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      label: newLabel
    });
  };

  const nodeType = selectedNode.data?.type || '';

  return (
    <div
      style={{
        width: '320px',
        height: '100%',
        backgroundColor: 'rgba(9, 13, 22, 0.95)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        gap: '1rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings style={{ width: '16px', height: '16px', color: '#818cf8' }} />
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Node Inspector</h3>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="btn btn-secondary"
          style={{ padding: '0.25rem 0.5rem' }}
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Node Label */}
        <div>
          <label className="form-label">Display Title</label>
          <input
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="input"
          />
        </div>

        {/* Node ID */}
        <div>
          <label className="form-label">Node Identifier</label>
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)'
            }}
          >
            {selectedNode.id}
          </div>
        </div>

        {/* Type-Specific Configurations */}
        {nodeType.startsWith('ai_') && (
          <div>
            <label className="form-label">AI Model Configuration</label>
            <select
              value={config.model || 'gpt-4o-mini'}
              onChange={(e) => handleConfigChange('model', e.target.value)}
              className="select"
              style={{ marginBottom: '0.75rem' }}
            >
              <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini (Fast)</option>
              <option value="anthropic/claude-3-5-haiku">Claude 3.5 Haiku (Reasoning)</option>
              <option value="google/gemini-1.5-flash">Gemini 1.5 Flash (Balanced)</option>
            </select>

            <label className="form-label">System Prompt / Instructions</label>
            <textarea
              rows={4}
              value={config.prompt || ''}
              onChange={(e) => handleConfigChange('prompt', e.target.value)}
              placeholder="e.g. Classify customer intent as Billing, Technical, or Sales..."
              className="textarea"
            />
          </div>
        )}

        {nodeType.startsWith('slack_') && (
          <div>
            <label className="form-label">Slack Channel</label>
            <input
              type="text"
              value={config.channel || '#general'}
              onChange={(e) => handleConfigChange('channel', e.target.value)}
              placeholder="#alerts"
              className="input"
              style={{ marginBottom: '0.75rem' }}
            />

            <label className="form-label">Message Template</label>
            <textarea
              rows={3}
              value={config.message || ''}
              onChange={(e) => handleConfigChange('message', e.target.value)}
              placeholder="Alert: New high-priority ticket {{node_1.output.title}}"
              className="textarea"
            />
          </div>
        )}

        {nodeType.startsWith('gmail_') && (
          <div>
            <label className="form-label">Recipient Email</label>
            <input
              type="text"
              value={config.to || ''}
              onChange={(e) => handleConfigChange('to', e.target.value)}
              placeholder="operator@company.io"
              className="input"
              style={{ marginBottom: '0.75rem' }}
            />

            <label className="form-label">Subject</label>
            <input
              type="text"
              value={config.subject || ''}
              onChange={(e) => handleConfigChange('subject', e.target.value)}
              placeholder="Automated Notification"
              className="input"
              style={{ marginBottom: '0.75rem' }}
            />
          </div>
        )}

        {nodeType === 'condition_branch' && (
          <div>
            <label className="form-label">Condition Field</label>
            <input
              type="text"
              value={config.field || 'intent'}
              onChange={(e) => handleConfigChange('field', e.target.value)}
              className="input"
              style={{ marginBottom: '0.75rem' }}
            />

            <label className="form-label">Operator</label>
            <select
              value={config.operator || '=='}
              onChange={(e) => handleConfigChange('operator', e.target.value)}
              className="select"
              style={{ marginBottom: '0.75rem' }}
            >
              <option value="==">Equals (==)</option>
              <option value="!=">Not Equals (!=)</option>
              <option value="contains">Contains Substring</option>
              <option value=">">Greater Than (&gt;)</option>
            </select>

            <label className="form-label">Target Value</label>
            <input
              type="text"
              value={config.value || 'urgent'}
              onChange={(e) => handleConfigChange('value', e.target.value)}
              className="input"
            />
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => removeNode(selectedNode.id)}
        className="btn btn-danger"
        style={{ width: '100%', marginTop: 'auto' }}
      >
        <Trash2 style={{ width: '14px', height: '14px' }} />
        <span>Delete Node</span>
      </button>
    </div>
  );
}
