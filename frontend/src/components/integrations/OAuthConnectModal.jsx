import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function OAuthConnectModal({ provider, isOpen, onClose, onSave, isConnecting }) {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  if (!isOpen || !provider) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      provider,
      apiKey,
      webhookUrl
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0c101a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Key style={{ width: '18px', height: '18px', color: '#818cf8' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
              Connect {provider.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.55rem' }}
          >
            <X style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck style={{ width: '16px', height: '16px', color: '#818cf8', flexShrink: 0 }} />
            <span>Credentials are encrypted using AES-256-GCM before database storage.</span>
          </div>

          <div>
            <label className="form-label">API Key / Access Token</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste token or leave blank for sandbox demo..."
              className="input"
            />
          </div>

          <div>
            <label className="form-label">Webhook URL (Optional)</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="btn btn-primary"
            >
              {isConnecting ? <LoadingSpinner size="sm" /> : <Check style={{ width: '14px', height: '14px' }} />}
              <span>Save & Encrypt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
