import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Play,
  Plug,
  Settings,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workflows/builder', label: 'AI Builder', icon: Sparkles, badge: 'AI' },
  { href: '/executions', label: 'Executions', icon: Play },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="nav-group-title">Operations Console</div>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <div className="nav-item-left">
                  <Icon style={{ width: '16px', height: '16px', color: active ? '#818cf8' : 'var(--text-secondary)' }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      color: '#a5b4fc',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Multi-Agent Substrate Card */}
      <div
        className="glass-panel"
        style={{ padding: '1rem', background: '#0e1320' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>
          <ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
          <span>Multi-Agent Engine</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
          Planner, Execution, Validation, Recovery & Monitoring agents active.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Native Agent Pipeline</span>
          <span style={{ color: '#10b981', fontWeight: '700' }}>● Live</span>
        </div>
      </div>
    </aside>
  );
}
