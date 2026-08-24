import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PromptInputPanel from '../components/workflow/PromptInputPanel';
import GraphPreviewPanel from '../components/workflow/GraphPreviewPanel';
import { api } from '../lib/api';
import { useWorkflowStore } from '../store/workflowStore';

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { setNodes, setEdges, setCurrentWorkflow } = useWorkflowStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleGenerate = async (prompt) => {
    try {
      setIsGenerating(true);
      const res = await api.generateWorkflow(prompt);
      const data = res.data;

      setGeneratedData(data);
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (err) {
      console.error('Failed to generate workflow graph', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToCanvas = async () => {
    if (!generatedData) return;
    try {
      setIsSaving(true);
      const res = await api.createWorkflow({
        name: generatedData.name || 'AI Generated Workflow',
        description: generatedData.description || '',
        nodes: generatedData.nodes || [],
        edges: generatedData.edges || [],
        tags: generatedData.tags || ['ai-generated']
      });

      setCurrentWorkflow(res.data);
      navigate(`/workflows/${res.data._id}`);
    } catch (err) {
      console.error('Failed to save workflow', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteNow = async () => {
    if (!generatedData) return;
    try {
      setIsSaving(true);
      const createRes = await api.createWorkflow({
        name: generatedData.name || 'AI Generated Workflow',
        description: generatedData.description || '',
        nodes: generatedData.nodes || [],
        edges: generatedData.edges || [],
        tags: generatedData.tags || ['ai-generated']
      });

      const workflowId = createRes.data._id;
      const execRes = await api.executeWorkflow(workflowId, { trigger: 'prompt_builder' });
      navigate(`/executions?id=${execRes.data._id}`);
    } catch (err) {
      console.error('Failed to save and execute workflow', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#ffffff' }}>
            AI Prompt-to-Workflow Builder
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Compile natural language automation prompts into connected React Flow visual graphs.
          </p>
        </div>

        {/* Input Prompt Section */}
        <PromptInputPanel
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Live Graph Canvas Preview */}
        <GraphPreviewPanel
          generatedData={generatedData}
          onSaveAndOpen={handleSaveToCanvas}
          onExecuteNow={handleExecuteNow}
          isSaving={isSaving}
        />
      </div>
    </AppShell>
  );
}
