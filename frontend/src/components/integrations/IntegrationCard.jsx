import React from 'react';
import { Mail, MessageSquare, Send, Table, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const providerDetails = {
  gmail: {
    name: 'Gmail API',
    description: 'Send automated transactional emails and trigger flows on incoming unread mail.',
    icon: Mail,
    color: '#ea4335'
  },
  slack: {
    name: 'Slack Webhooks & Bot',
    description: 'Post structured alerts to channels and subscribe to team conversations.',
    icon: MessageSquare,
    color: '#4a154b'
  },
  discord: {
    name: 'Discord Bot',
    description: 'Dispatch rich embeds and notifications to operational Discord servers.',
    icon: Send,
    color: '#5865f2'
  },
  'google-sheets': {
    name: 'Google Sheets',
    description: 'Append audit rows, sync tabular datasets, and update live business sheets.',
    icon: Table,
    color: '#0f9d58'
  }
};

export default function IntegrationCard({ integration, onConnect, onDisconnect, onTestPing }) {
  const details = providerDetails[integration.provider] || {
    name: integration.provider,
    description: 'Custom third-party OAuth service provider.',
    icon: Mail,
    color: '#6366f1'
  };

  const Icon = details.icon;
  const isConnected = integration.status === 'CONNECTED';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: details.color
              }}
            >
              <Icon style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>{details.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                <ShieldCheck style={{ width: '10px', height: '10px', color: '#10b981' }} />
                <span style={{ color: 'var(--text-muted)' }}>AES-256-GCM Encrypted</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: isConnected ? '#34d399' : '#fb7185',
              border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
            }}
          >
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {details.description}
        </p>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <button
          onClick={() => onTestPing && onTestPing(integration.provider)}
          disabled={!isConnected}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem' }}
        >
          <span>Test Ping</span>
        </button>

        {isConnected ? (
          <button
            onClick={() => onDisconnect && onDisconnect(integration.provider)}
            className="btn btn-danger"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
          >
            <span>Disconnect</span>
          </button>
        ) : (
          <button
            onClick={() => onConnect && onConnect(integration.provider)}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.7rem' }}
          >
            <ExternalLink style={{ width: '12px', height: '12px' }} />
            <span>Connect OAuth</span>
          </button>
        )}
      </div>
    </div>
  );
}
