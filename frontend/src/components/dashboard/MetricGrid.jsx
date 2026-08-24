import React from 'react';
import { GitBranch, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MetricGrid({ metrics = {} }) {
  const cards = [
    {
      label: 'Total Workflows',
      value: metrics.totalWorkflows || 0,
      sub: `${metrics.activeWorkflows || 0} active in production`,
      icon: GitBranch,
      accentColor: 'var(--color-blue)',
      iconBg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      label: 'Total Executions',
      value: metrics.totalExecutions || 0,
      sub: 'All-time agent runs',
      icon: Play,
      accentColor: 'var(--brand-primary)',
      iconBg: 'rgba(99, 102, 241, 0.15)'
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate ?? 100}%`,
      sub: `${metrics.completedExecutions || 0} succeeded runs`,
      icon: CheckCircle2,
      accentColor: 'var(--color-emerald)',
      iconBg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      label: 'Failed Executions',
      value: metrics.failedExecutions || 0,
      sub: 'Escalated to recovery',
      icon: AlertCircle,
      accentColor: 'var(--color-rose)',
      iconBg: 'rgba(244, 63, 94, 0.15)'
    }
  ];

  return (
    <div className="metric-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="metric-card">
            <div className="metric-header">
              <span className="metric-title">{c.label}</span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: c.iconBg,
                  color: c.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
              </div>
            </div>

            <div>
              <div className="metric-value">{c.value}</div>
              <div className="metric-sub">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
