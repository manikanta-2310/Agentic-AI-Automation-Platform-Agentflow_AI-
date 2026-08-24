import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Clock, RefreshCw, Layers } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import ExecutionControls from '../components/execution/ExecutionControls';
import ExecutionTimeline from '../components/execution/ExecutionTimeline';
import ExecutionLogViewer from '../components/execution/ExecutionLogViewer';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { api } from '../lib/api';
import { useExecutionStore } from '../store/executionStore';

export default function ExecutionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const {
    executions,
    currentExecution,
    timeline,
    fetchExecutions,
    fetchExecutionDetails,
    setCurrentExecution,
    subscribeToExecution,
    pauseExecution,
    resumeExecution,
    cancelExecution
  } = useExecutionStore();

  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setIsLoadingList(true);
    fetchExecutions().finally(() => setIsLoadingList(false));
  }, [fetchExecutions]);

  useEffect(() => {
    if (queryId) {
      fetchExecutionDetails(queryId);
      const unsub = subscribeToExecution(queryId);
      return () => {
        if (unsub) unsub();
      };
    } else if (executions.length > 0 && !currentExecution) {
      setSearchParams({ id: executions[0]._id });
    }
  }, [queryId, executions, fetchExecutionDetails, subscribeToExecution, setSearchParams, currentExecution]);

  const handleSelectExecution = (exec) => {
    setSearchParams({ id: exec._id });
    setCurrentExecution(exec);
  };

  const handlePause = async () => {
    if (!currentExecution) return;
    setIsMutating(true);
    await pauseExecution(currentExecution._id);
    setIsMutating(false);
  };

  const handleResume = async () => {
    if (!currentExecution) return;
    setIsMutating(true);
    await resumeExecution(currentExecution._id);
    setIsMutating(false);
  };

  const handleCancel = async () => {
    if (!currentExecution) return;
    setIsMutating(true);
    await cancelExecution(currentExecution._id);
    setIsMutating(false);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff' }}>
              Observability & Execution Timeline
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live multi-agent execution audit trail, runtime states, and step latency.
            </p>
          </div>

          <button
            onClick={() => fetchExecutions()}
            className="btn btn-secondary"
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 2-Column Layout: Left Runs List + Right Execution Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Runs Sidebar */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Execution Runs</div>

            {isLoadingList ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <LoadingSpinner size="md" />
              </div>
            ) : executions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                No executions recorded yet.
              </div>
            ) : (
              executions.map((exec) => {
                const isSelected = currentExecution?._id === exec._id;
                return (
                  <div
                    key={exec._id}
                    onClick={() => handleSelectExecution(exec)}
                    className="glass-card"
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(23, 30, 46, 0.4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>
                        {exec.workflow?.name || 'Automated Pipeline'}
                      </span>
                      <StatusBadge status={exec.status} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <span>{new Date(exec.createdAt).toLocaleTimeString()}</span>
                      <span>{exec.durationMs ? `${exec.durationMs}ms` : 'In-flight'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Execution View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentExecution ? (
              <>
                <ExecutionControls
                  execution={currentExecution}
                  onPause={handlePause}
                  onResume={handleResume}
                  onCancel={handleCancel}
                  isMutating={isMutating}
                />

                <ExecutionTimeline timeline={timeline} />

                <ExecutionLogViewer logs={timeline} />
              </>
            ) : (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Play style={{ width: '36px', height: '36px', opacity: 0.4, margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Select an Execution Run
                </h3>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Pick a run from the left panel to inspect its live multi-agent audit trail.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
