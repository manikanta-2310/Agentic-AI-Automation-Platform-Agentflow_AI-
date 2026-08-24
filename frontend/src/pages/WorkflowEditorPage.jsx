import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import WorkflowCanvas from '../components/workflow/WorkflowCanvas';
import NodePalette from '../components/workflow/NodePalette';
import NodeConfigPanel from '../components/workflow/NodeConfigPanel';
import WorkflowToolbar from '../components/workflow/WorkflowToolbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { api } from '../lib/api';
import { useWorkflowStore } from '../store/workflowStore';

export default function WorkflowEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentWorkflow,
    nodes,
    edges,
    selectedNode,
    setCurrentWorkflow,
    setNodes,
    setEdges
  } = useWorkflowStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.getWorkflowById(id)
      .then((res) => {
        const wf = res.data;
        setCurrentWorkflow(wf);
        setNodes(wf.nodes || []);
        setEdges(wf.edges || []);
      })
      .catch((err) => console.error('Failed to load workflow', err))
      .finally(() => setIsLoading(false));
  }, [id, setCurrentWorkflow, setNodes, setEdges]);

  const handleSave = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await api.updateWorkflow(id, {
        nodes,
        edges
      });
    } catch (err) {
      console.error('Failed to save workflow', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!id) return;
    try {
      const res = await api.duplicateWorkflow(id);
      navigate(`/workflows/${res.data._id}`);
    } catch (err) {
      console.error('Failed to duplicate workflow', err);
    }
  };

  const handleExecute = async () => {
    if (!id) return;
    try {
      setIsExecuting(true);
      await handleSave();
      const res = await api.executeWorkflow(id, { trigger: 'canvas_editor' });
      navigate(`/executions?id=${res.data._id}`);
    } catch (err) {
      console.error('Failed to trigger execution', err);
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      <WorkflowToolbar
        workflowName={currentWorkflow?.name}
        onSave={handleSave}
        onExecute={handleExecute}
        onDuplicate={handleDuplicate}
        isSaving={isSaving}
        isExecuting={isExecuting}
      />

      {/* Editor Body: Left Palette + Center Canvas + Right Config Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <NodePalette />

        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <WorkflowCanvas readOnly={false} />
        </div>

        {selectedNode && <NodeConfigPanel />}
      </div>
    </div>
  );
}
