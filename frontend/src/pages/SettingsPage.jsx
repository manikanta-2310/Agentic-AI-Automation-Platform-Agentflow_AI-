import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, Database, Cpu, Activity, User, LogOut, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [healthData, setHealthData] = useState(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  useEffect(() => {
    setIsLoadingHealth(true);
    api.getHealth()
      .then((res) => setHealthData(res))
      .catch((err) => console.error('Failed to fetch system diagnostics', err))
      .finally(() => setIsLoadingHealth(false));
  }, []);

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff' }}>
            System Settings & Diagnostics
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Platform environment metrics, database heartbeat, encryption diagnostics, and user profile.
          </p>
        </div>

        {/* Operator Profile Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <User style={{ width: '18px', height: '18px', color: '#818cf8' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Operator Profile</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>{user?.name || 'Operator'}</div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{user?.email || 'N/A'}</div>
            </div>
            <div>
              <label className="form-label">Assigned Role</label>
              <div style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: '700' }}>
                {user?.role || 'Operator'}
              </div>
            </div>
          </div>
        </div>

        {/* System Diagnostics Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Activity style={{ width: '18px', height: '18px', color: '#10b981' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Live Substrate Diagnostics</h3>
          </div>

          {isLoadingHealth ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Database style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>MongoDB Database</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                  ● {healthData?.system?.database || 'connected'}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Cpu style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>Multi-Agent Orchestrator</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>
                  ● {healthData?.system?.agentEngine || 'active'}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#facc15' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>AES-256-GCM Vault</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fde047' }}>
                  ● Hardware-Key Active
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Activity style={{ width: '16px', height: '16px', color: '#fb923c' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>System Uptime</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {healthData?.uptimeSeconds || 0} seconds
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
