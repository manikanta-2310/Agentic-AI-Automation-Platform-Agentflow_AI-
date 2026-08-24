import React from 'react';
import { Compass, Play, CheckCircle2, ShieldAlert, Activity, Sparkles } from 'lucide-react';

export default function AgentBadge({ agent }) {
  const norm = (agent || 'orchestrator').toLowerCase();

  const configs = {
    planner: {
      label: 'PLANNER',
      className: 'agent-planner',
      icon: Compass
    },
    execution: {
      label: 'EXECUTION',
      className: 'agent-execution',
      icon: Play
    },
    validation: {
      label: 'VALIDATION',
      className: 'agent-validation',
      icon: CheckCircle2
    },
    recovery: {
      label: 'RECOVERY',
      className: 'agent-recovery',
      icon: ShieldAlert
    },
    monitoring: {
      label: 'MONITORING',
      className: 'agent-monitoring',
      icon: Activity
    },
    orchestrator: {
      label: 'ORCHESTRATOR',
      className: 'agent-orchestrator',
      icon: Sparkles
    }
  };

  const cfg = configs[norm] || configs.orchestrator;
  const Icon = cfg.icon;

  return (
    <span className={`agent-badge ${cfg.className}`}>
      <Icon style={{ width: '12px', height: '12px' }} />
      <span>{cfg.label}</span>
    </span>
  );
}
