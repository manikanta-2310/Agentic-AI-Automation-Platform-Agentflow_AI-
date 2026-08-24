import { create } from 'zustand';
import { api } from '../lib/api';
import { getSocket, subscribeToExecution, unsubscribeFromExecution } from '../lib/socket';
import { useWorkflowStore } from './workflowStore';

export const useExecutionStore = create((set, get) => ({
  executions: [],
  currentExecution: null,
  activeExecution: null,
  timeline: [],
  timelineLogs: [],
  isLoading: false,
  isExecuting: false,
  error: null,
  activeExecutionId: null,

  fetchExecutions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getExecutions(params);
      if (res.success && res.data) {
        const list = res.data.executions || [];
        set({ executions: list, isLoading: false });
        return list;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchExecutionDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const [execRes, timelineRes] = await Promise.all([
        api.getExecution(id),
        api.getExecutionTimeline(id)
      ]);

      if (execRes.success) {
        const logs = timelineRes?.data?.timeline || [];
        set({
          currentExecution: execRes.data,
          activeExecution: execRes.data,
          timeline: logs,
          timelineLogs: logs,
          isLoading: false
        });
        get().listenToExecutionEvents(id);
      }
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  setCurrentExecution: (execution) => {
    set({
      currentExecution: execution,
      activeExecution: execution
    });
  },

  subscribeToExecution: (executionId) => {
    get().listenToExecutionEvents(executionId);
    return () => get().stopListening();
  },

  listenToExecutionEvents: (executionId) => {
    const socket = getSocket();
    if (!socket || !executionId) return;

    subscribeToExecution(executionId);
    set({ activeExecutionId: executionId });

    // Clean previous listeners to avoid duplicates
    socket.off('agent:event');
    socket.off('execution:start');
    socket.off('execution:node_start');
    socket.off('execution:node_complete');
    socket.off('execution:finish');

    socket.on('agent:event', (log) => {
      set((state) => {
        const newLogs = [...state.timeline, log];
        return {
          timeline: newLogs,
          timelineLogs: newLogs
        };
      });
    });

    socket.on('execution:node_start', (data) => {
      useWorkflowStore.getState().setActiveRunningNodeId(data.nodeId);
    });

    socket.on('execution:node_complete', () => {
      useWorkflowStore.getState().setActiveRunningNodeId(null);
    });

    socket.on('execution:finish', (data) => {
      useWorkflowStore.getState().setActiveRunningNodeId(null);
      set((state) => {
        const updatedExec = state.currentExecution
          ? { ...state.currentExecution, status: data.status, durationMs: data.durationMs }
          : null;
        return {
          currentExecution: updatedExec,
          activeExecution: updatedExec,
          isExecuting: false
        };
      });
      // Refresh execution list in background
      get().fetchExecutions();
    });
  },

  stopListening: () => {
    const { activeExecutionId } = get();
    if (activeExecutionId) {
      unsubscribeFromExecution(activeExecutionId);
      set({ activeExecutionId: null });
    }
  },

  triggerRun: async (workflowId, inputPayload = {}) => {
    set({ isExecuting: true, error: null, timeline: [], timelineLogs: [] });
    try {
      const res = await api.executeWorkflow(workflowId, inputPayload);
      if (res.success && res.data) {
        const execution = res.data;
        set({ currentExecution: execution, activeExecution: execution });
        get().listenToExecutionEvents(execution._id);
        return execution;
      }
    } catch (err) {
      set({ isExecuting: false, error: err.message });
      throw err;
    }
  },

  pauseExecution: async (id) => {
    try {
      await api.pauseExecution(id);
      set((state) => {
        const updated = state.currentExecution ? { ...state.currentExecution, status: 'PAUSED' } : null;
        return { currentExecution: updated, activeExecution: updated };
      });
    } catch (err) {
      console.error('Pause execution failed:', err);
    }
  },

  resumeExecution: async (id) => {
    try {
      await api.resumeExecution(id);
      set((state) => {
        const updated = state.currentExecution ? { ...state.currentExecution, status: 'RUNNING' } : null;
        return { currentExecution: updated, activeExecution: updated };
      });
    } catch (err) {
      console.error('Resume execution failed:', err);
    }
  },

  cancelExecution: async (id) => {
    try {
      await api.cancelExecution(id);
      useWorkflowStore.getState().setActiveRunningNodeId(null);
      set((state) => {
        const updated = state.currentExecution ? { ...state.currentExecution, status: 'CANCELLED' } : null;
        return { currentExecution: updated, activeExecution: updated, isExecuting: false };
      });
    } catch (err) {
      console.error('Cancel execution failed:', err);
    }
  }
}));
