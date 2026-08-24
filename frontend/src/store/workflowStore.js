import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { api } from '../lib/api';

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isDirty: false,
  isLoading: false,
  isSaving: false,
  isGenerating: false,
  isExecuting: false,
  activeRunningNodeId: null,
  error: null,

  setWorkflows: (workflows) => set({ workflows }),

  setNodes: (nodesOrUpdater) => {
    set((state) => ({
      nodes: typeof nodesOrUpdater === 'function' ? nodesOrUpdater(state.nodes) : nodesOrUpdater,
      isDirty: true
    }));
  },

  setEdges: (edgesOrUpdater) => {
    set((state) => ({
      edges: typeof edgesOrUpdater === 'function' ? edgesOrUpdater(state.edges) : edgesOrUpdater,
      isDirty: true
    }));
  },

  setCurrentWorkflow: (workflow) => {
    set({
      currentWorkflow: workflow,
      nodes: workflow?.nodes || [],
      edges: workflow?.edges || [],
      selectedNodeId: null,
      isDirty: false
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDirty: true
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true
    });
  },

  onConnect: (connection) => {
    const edge = {
      ...connection,
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 }
    };
    set({
      edges: addEdge(edge, get().edges),
      isDirty: true
    });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setActiveRunningNodeId: (nodeId) => {
    set({ activeRunningNodeId: nodeId });
  },

  addNode: (catalogItem, position = { x: 250, y: 150 }) => {
    const newId = `node-${catalogItem.nodeType}-${Date.now().toString(36)}`;
    const newNode = {
      id: newId,
      type: catalogItem.type,
      position,
      data: {
        label: catalogItem.label,
        nodeType: catalogItem.nodeType,
        category: catalogItem.category,
        description: catalogItem.description,
        icon: catalogItem.icon,
        color: catalogItem.color,
        config: { ...catalogItem.defaultConfig }
      }
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: newId,
      isDirty: true
    });

    return newNode;
  },

  updateNodeData: (nodeId, updatedData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
              config: {
                ...(node.data.config || {}),
                ...(updatedData.config || {})
              }
            }
          };
        }
        return node;
      }),
      isDirty: true
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      isDirty: true
    });
  },

  fetchWorkflows: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getWorkflows(params);
      if (res.success && res.data) {
        set({ workflows: res.data.workflows, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchWorkflowById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getWorkflow(id);
      if (res.success && res.data) {
        get().setCurrentWorkflow(res.data);
        set({ isLoading: false });
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  saveWorkflow: async (overrides = {}) => {
    const { currentWorkflow, nodes, edges } = get();
    if (!currentWorkflow) return;

    set({ isSaving: true });
    try {
      const payload = {
        name: overrides.name || currentWorkflow.name,
        description: overrides.description !== undefined ? overrides.description : currentWorkflow.description,
        status: overrides.status || currentWorkflow.status,
        nodes,
        edges,
        tags: overrides.tags || currentWorkflow.tags
      };

      const res = await api.updateWorkflow(currentWorkflow._id, payload);
      if (res.success && res.data) {
        set({
          currentWorkflow: res.data,
          isDirty: false,
          isSaving: false
        });
        return res.data;
      }
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  generateWorkflowFromPrompt: async (prompt) => {
    set({ isGenerating: true, error: null });
    try {
      const res = await api.generateWorkflow(prompt);
      if (res.success && res.data) {
        set({
          nodes: res.data.nodes || [],
          edges: res.data.edges || [],
          isGenerating: false,
          isDirty: true
        });
        return res.data;
      }
      throw new Error('No graph generated');
    } catch (err) {
      set({ isGenerating: false, error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null })
}));
