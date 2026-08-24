import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode.jsx';
import AINode from './nodes/AINode.jsx';
import LogicNode from './nodes/LogicNode.jsx';
import ActionNode from './nodes/ActionNode.jsx';
import { useWorkflowStore } from '../../store/workflowStore';

function FlowInner({ readOnly, customNodes, customEdges }) {
  const store = useWorkflowStore();

  const nodes = customNodes || store.nodes;
  const edges = customEdges || store.edges;

  const { fitView } = useReactFlow();

  // Auto fit view whenever nodes update
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.25, duration: 400 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  const nodeTypes = useMemo(
    () => ({
      triggerNode: TriggerNode,
      aiNode: AINode,
      logicNode: LogicNode,
      actionNode: ActionNode
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes) => {
      if (readOnly) return;
      store.setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, store, readOnly]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (readOnly) return;
      store.setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, store, readOnly]
  );

  const onConnect = useCallback(
    (params) => {
      if (readOnly) return;
      store.setEdges(
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 }
          },
          edges
        )
      );
    },
    [edges, store, readOnly]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      store.selectNode(node);
    },
    [store]
  );

  const onPaneClick = useCallback(() => {
    store.selectNode(null);
  }, [store]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (readOnly) return;

      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      try {
        const item = JSON.parse(rawData);
        const position = {
          x: event.clientX - 320,
          y: event.clientY - 120
        };

        const newNode = {
          id: `node_${Date.now()}`,
          type: item.type || 'actionNode',
          position,
          data: {
            label: item.label,
            nodeType: item.nodeType,
            config: { ...item.defaultConfig }
          }
        };

        store.addNode(newNode);
      } catch (err) {
        console.error('Failed to parse dropped node payload', err);
      }
    },
    [store, readOnly]
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#090d16' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 }
        }}
      >
        <Background color="#161e31" gap={20} size={1.5} />
        <Controls />
        <MiniMap
          nodeStrokeColor="#6366f1"
          nodeColor="#182032"
          nodeBorderRadius={6}
          maskColor="rgba(9, 13, 22, 0.85)"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas({ readOnly = false, customNodes, customEdges }) {
  return (
    <ReactFlowProvider>
      <FlowInner readOnly={readOnly} customNodes={customNodes} customEdges={customEdges} />
    </ReactFlowProvider>
  );
}
