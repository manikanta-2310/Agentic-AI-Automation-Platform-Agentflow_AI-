import React, { useEffect } from 'react';
import { X, CheckCheck, Bell, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

const typeIcons = {
  success: { icon: CheckCircle2, color: 'var(--color-emerald)' },
  error: { icon: AlertCircle, color: 'var(--color-rose)' },
  warning: { icon: AlertTriangle, color: 'var(--color-amber)' },
  escalation: { icon: AlertTriangle, color: '#fb923c' },
  info: { icon: Info, color: 'var(--color-blue)' }
};

export default function NotificationsDrawer() {
  const {
    notifications,
    isOpen,
    setOpen,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    listenForNewNotifications
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    listenForNewNotifications();
  }, [fetchNotifications, listenForNewNotifications]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#0c101a',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>System Notifications</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{unreadCount} unread alerts</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}
                title="Mark all as read"
              >
                <CheckCheck style={{ width: '14px', height: '14px' }} />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem' }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Bell style={{ width: '32px', height: '32px', marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No notifications yet</p>
              <p style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Workflow execution alerts will appear here</p>
            </div>
          ) : (
            notifications.map((n) => {
              const typeCfg = typeIcons[n.type] || typeIcons.info;
              const Icon = typeCfg.icon;

              return (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className="glass-card"
                  style={{
                    padding: '0.85rem',
                    cursor: 'pointer',
                    opacity: n.isRead ? 0.7 : 1,
                    borderLeft: `3px solid ${typeCfg.color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <Icon style={{ width: '16px', height: '16px', color: typeCfg.color, flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{n.title}</h4>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
