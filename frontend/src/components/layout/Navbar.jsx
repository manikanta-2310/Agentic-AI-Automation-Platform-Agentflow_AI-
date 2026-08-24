import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Sparkles, LogOut, Cpu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { api } from '../../lib/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleOpen } = useNotificationStore();
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    api.getHealth()
      .then((res) => setHealthStatus(res.system))
      .catch(() => setHealthStatus(null));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left: Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <Sparkles style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </div>
          <span>
            Agentflow<span style={{ color: '#818cf8' }}>.AI</span>
          </span>
        </Link>

        {/* Engine Heartbeat Pill */}
        <div className="navbar-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span>Engine Active</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: '#a5b4fc', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Cpu style={{ width: '12px', height: '12px' }} /> LangGraph: {healthStatus?.langGraph || 'available'}
          </span>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="navbar-actions">
        <Link to="/workflows/builder" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem' }}>
          <Sparkles style={{ width: '14px', height: '14px' }} />
          <span>AI Workflow Builder</span>
        </Link>

        {/* Notifications Drawer Toggle */}
        <button
          onClick={toggleOpen}
          className="btn btn-secondary"
          style={{ position: 'relative', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
          title="Notifications"
        >
          <Bell style={{ width: '16px', height: '16px' }} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--color-rose)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '1px 5px',
                borderRadius: '9999px'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Pill / Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#a5b4fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#818cf8', textTransform: 'uppercase' }}>
                  {user.role || 'Operator'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}
              title="Sign Out"
            >
              <LogOut style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
