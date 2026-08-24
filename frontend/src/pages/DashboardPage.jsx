import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Plus, RefreshCw, Layers } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import MetricGrid from '../components/dashboard/MetricGrid';
import WorkflowCard from '../components/dashboard/WorkflowCard';
import AIActivityFeed from '../components/dashboard/AIActivityFeed';
import RecentExecutions from '../components/dashboard/RecentExecutions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { api } from '../lib/api';
import { socketClient } from '../lib/socket';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getDashboardMetrics();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to live agent telemetry feed
    const handleAgentEvent = (evt) => {
      setActivities((prev) => [
        {
          agent: evt.agent || 'orchestrator',
          eventType: evt.eventType || 'STEP',
          message: evt.message || 'Processing node...',
          timestamp: new Date()
        },
        ...prev.slice(0, 19)
      ]);
    };

    socketClient.on('agent_activity', handleAgentEvent);
    return () => {
      socketClient.off('agent_activity', handleAgentEvent);
    };
  }, []);

  const handleExecuteWorkflow = async (workflowId) => {
    try {
      const res = await api.executeWorkflow(workflowId, { trigger: 'manual_dashboard' });
      navigate(`/executions?id=${res.data._id}`);
    } catch (err) {
      console.error('Failed to trigger execution', err);
    }
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Top Actions Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff' }}>
              Operations Dashboard
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time multi-agent execution telemetry & active automation graph metrics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={fetchDashboardData}
              className="btn btn-secondary"
              title="Refresh Dashboard"
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              <span>Refresh</span>
            </button>

            <Link to="/workflows/builder" className="btn btn-primary">
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>New AI Workflow</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <MetricGrid metrics={data?.metrics || {}} />

        {/* Main 2-Column Split: Workflows vs Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Active Workflows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers style={{ width: '18px', height: '18px', color: '#818cf8' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Active Workflows</h2>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {data?.workflows?.length || 0} Total
              </span>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <LoadingSpinner size="lg" />
              </div>
            ) : data?.workflows?.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <Sparkles style={{ width: '36px', height: '36px', opacity: 0.5, margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>No Workflows Created Yet</h3>
                <p style={{ fontSize: '0.8rem', maxWidth: '340px', margin: '0.5rem auto 1.25rem auto' }}>
                  Use the AI Workflow Builder to describe what you want automated in natural language.
                </p>
                <Link to="/workflows/builder" className="btn btn-primary">
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  <span>Generate with AI</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {data?.workflows?.map((wf) => (
                  <WorkflowCard
                    key={wf._id}
                    workflow={wf}
                    onExecute={handleExecuteWorkflow}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: AI Activity Feed & Recent Runs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AIActivityFeed activities={activities} />
            <RecentExecutions executions={data?.recentExecutions || []} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
