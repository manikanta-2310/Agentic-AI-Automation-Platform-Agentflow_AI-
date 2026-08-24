import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, PlayCircle, PauseCircle, Ban } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'unknown').toUpperCase();

  const configs = {
    RUNNING: {
      label: 'RUNNING',
      className: 'status-running',
      icon: PlayCircle,
      dotColor: 'var(--color-emerald)'
    },
    COMPLETED: {
      label: 'COMPLETED',
      className: 'status-completed',
      icon: CheckCircle2,
      dotColor: 'var(--color-emerald)'
    },
    FAILED: {
      label: 'FAILED',
      className: 'status-failed',
      icon: XCircle,
      dotColor: 'var(--color-rose)'
    },
    PENDING: {
      label: 'PENDING',
      className: 'status-pending',
      icon: Clock,
      dotColor: 'var(--color-amber)'
    },
    RETRYING: {
      label: 'RETRYING',
      className: 'status-pending',
      icon: AlertTriangle,
      dotColor: '#f97316'
    },
    PAUSED: {
      label: 'PAUSED',
      className: 'status-pill',
      icon: PauseCircle,
      dotColor: 'var(--text-muted)'
    },
    CANCELLED: {
      label: 'CANCELLED',
      className: 'status-pill',
      icon: Ban,
      dotColor: 'var(--text-muted)'
    },
    ACTIVE: {
      label: 'Active',
      className: 'status-completed',
      icon: CheckCircle2,
      dotColor: 'var(--color-emerald)'
    },
    DRAFT: {
      label: 'Draft',
      className: 'status-pill',
      icon: Clock,
      dotColor: 'var(--text-muted)'
    },
    CONNECTED: {
      label: 'Connected',
      className: 'status-completed',
      icon: CheckCircle2,
      dotColor: 'var(--color-emerald)'
    },
    DISCONNECTED: {
      label: 'Disconnected',
      className: 'status-pill',
      icon: XCircle,
      dotColor: 'var(--text-muted)'
    }
  };

  const cfg = configs[normalized] || {
    label: status || 'Unknown',
    className: 'status-pill',
    icon: Clock,
    dotColor: 'var(--text-muted)'
  };

  const Icon = cfg.icon;

  return (
    <span className={`status-pill ${cfg.className}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cfg.dotColor }}></span>
      <span>{cfg.label}</span>
    </span>
  );
}
