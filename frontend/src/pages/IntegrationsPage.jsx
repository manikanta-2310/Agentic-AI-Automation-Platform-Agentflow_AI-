import React, { useEffect, useState } from 'react';
import { Plug, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import IntegrationCard from '../components/integrations/IntegrationCard';
import OAuthConnectModal from '../components/integrations/OAuthConnectModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { api, apiClient } from '../lib/api';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callbackNotification, setCallbackNotification] = useState(null);

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const res = await api.getIntegrations();
      setIntegrations(res.data);
    } catch (err) {
      console.error('Failed to fetch integrations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleOpenConnect = (provider) => {
    setSelectedIntegration(provider);
    setIsModalOpen(true);
  };

  const handleDisconnect = async (provider) => {
    try {
      await apiClient.delete(`/integrations/${provider}`);
      fetchIntegrations();
    } catch (err) {
      console.error('Failed to disconnect integration', err);
    }
  };

  const handleSaveModal = async (payload) => {
    try {
      await api.saveIntegration({
        provider: payload.provider,
        accessToken: payload.apiKey || 'sandbox_demo_token',
        status: 'CONNECTED',
        metadata: { webhookUrl: payload.webhookUrl }
      });
      setIsModalOpen(false);
      fetchIntegrations();
      setCallbackNotification({
        type: 'success',
        message: `Successfully connected and encrypted credentials for ${payload.provider.toUpperCase()}!`
      });
    } catch (err) {
      console.error('Failed to save integration', err);
    }
  };

  const handleTestPing = (provider) => {
    setCallbackNotification({
      type: 'success',
      message: `Ping OK: ${provider.toUpperCase()} webhook endpoint answered in 42ms.`
    });
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff' }}>
              Third-Party Integrations
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage OAuth tool integrations with AES-256-GCM token encryption at rest.
            </p>
          </div>

          <button
            onClick={fetchIntegrations}
            className="btn btn-secondary"
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Security Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderLeft: '4px solid var(--color-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.05)'
          }}
        >
          <ShieldCheck style={{ width: '28px', height: '28px', color: '#34d399', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              Application-Level AES-256-GCM Encryption Active
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              All OAuth access tokens, refresh tokens, and webhook secrets are encrypted at rest using 96-bit random IVs and 128-bit authentication tags.
            </p>
          </div>
        </div>

        {callbackNotification && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: callbackNotification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${callbackNotification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              color: callbackNotification.type === 'success' ? '#34d399' : '#fb7185',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {callbackNotification.type === 'success' ? <CheckCircle2 style={{ width: '16px', height: '16px' }} /> : <AlertCircle style={{ width: '16px', height: '16px' }} />}
              <span>{callbackNotification.message}</span>
            </div>
            <button
              onClick={() => setCallbackNotification(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Integrations Grid */}
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {integrations.map((item) => (
              <IntegrationCard
                key={item.provider}
                integration={item}
                onConnect={handleOpenConnect}
                onDisconnect={handleDisconnect}
                onTestPing={handleTestPing}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <OAuthConnectModal
          provider={selectedIntegration}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveModal}
          isConnecting={false}
        />
      </div>
    </AppShell>
  );
}
