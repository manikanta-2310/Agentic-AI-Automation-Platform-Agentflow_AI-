/**
 * Planner Agent
 * Analyzes workflow topology, validates acyclicity, computes execution sequence,
 * and emits confidence scores.
 */
class PlannerAgent {
  constructor() {
    this.name = 'planner';
  }

  async plan(workflowSnapshot, inputPayload = {}) {
    const nodes = workflowSnapshot.nodes || [];
    const edges = workflowSnapshot.edges || [];

    if (nodes.length === 0) {
      throw new Error('Cannot plan an empty workflow graph');
    }

    // Build Adjacency List & In-degree map for Topological Sort
    const adj = new Map();
    const inDegree = new Map();
    const nodeMap = new Map();

    nodes.forEach((n) => {
      adj.set(n.id, []);
      inDegree.set(n.id, 0);
      nodeMap.set(n.id, n);
    });

    edges.forEach((e) => {
      if (adj.has(e.source) && inDegree.has(e.target)) {
        adj.get(e.source).push(e.target);
        inDegree.set(e.target, inDegree.get(e.target) + 1);
      }
    });

    // Kahn's Algorithm for Topological Sort
    const queue = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const executionOrder = [];
    while (queue.length > 0) {
      const currentId = queue.shift();
      executionOrder.push(currentId);

      const neighbors = adj.get(currentId) || [];
      for (const nextId of neighbors) {
        inDegree.set(nextId, inDegree.get(nextId) - 1);
        if (inDegree.get(nextId) === 0) {
          queue.push(nextId);
        }
      }
    }

    // Cycle detection check
    const hasCycle = executionOrder.length !== nodes.length;
    if (hasCycle) {
      // In case of cycles, append remaining unvisited nodes
      nodes.forEach((n) => {
        if (!executionOrder.includes(n.id)) {
          executionOrder.push(n.id);
        }
      });
    }

    // Compute Confidence Score based on connectivity and node configs
    let confidence = 0.95;
    if (hasCycle) confidence -= 0.25;
    if (edges.length < nodes.length - 1) confidence -= 0.15;

    const plannedSteps = executionOrder.map((nodeId, idx) => {
      const node = nodeMap.get(nodeId) || { id: nodeId, data: { label: nodeId } };
      return {
        stepIndex: idx + 1,
        nodeId,
        nodeType: node.data?.nodeType || node.type || 'unknown',
        label: node.data?.label || nodeId,
        category: node.data?.category || 'action',
        dependsOn: edges.filter((e) => e.target === nodeId).map((e) => e.source)
      };
    });

    return {
      success: true,
      confidenceScore: Math.max(0.1, Math.min(1.0, confidence)),
      orderedNodeIds: executionOrder,
      steps: plannedSteps,
      totalSteps: plannedSteps.length,
      estimatedDurationMs: plannedSteps.length * 450,
      hasCycle
    };
  }
}

module.exports = new PlannerAgent();
