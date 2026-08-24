const plannerAgent = require('./plannerAgent');
const executionAgent = require('./executionAgent');
const validationAgent = require('./validationAgent');
const recoveryAgent = require('./recoveryAgent');
const monitoringAgent = require('./monitoringAgent');
const Execution = require('../models/Execution');
const Workflow = require('../models/Workflow');
const notificationService = require('../services/notificationService');
const { emitExecutionEvent } = require('../config/socket');

// Detect LangGraph availability
let langGraphStatus = 'not-installed';
try {
  require('@langchain/langgraph');
  langGraphStatus = 'available';
} catch (e) {
  langGraphStatus = 'not-installed';
}

// In-memory registry of active execution cancellation tokens
const activeExecutions = new Map();

class AgentOrchestrator {
  constructor() {
    this.langGraphStatus = langGraphStatus;
  }

  getLangGraphStatus() {
    return this.langGraphStatus;
  }

  async runWorkflow(executionId) {
    const execution = await Execution.findById(executionId).populate('workflow');
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    const workflow = execution.workflow;
    const ownerId = execution.owner;
    const executionIdStr = String(execution._id);
    const workflowIdStr = String(workflow._id);

    // Track active execution controller
    const executionControl = { isCancelled: false, isPaused: false };
    activeExecutions.set(executionIdStr, executionControl);

    execution.status = 'RUNNING';
    execution.startedAt = new Date();
    execution.langGraphStatus = this.langGraphStatus;
    await execution.save();

    emitExecutionEvent(executionIdStr, 'execution:start', {
      executionId: executionIdStr,
      status: 'RUNNING',
      langGraph: this.langGraphStatus,
      startedAt: execution.startedAt
    });

    // 1. MONITORING: Orchestrator Initialized
    await monitoringAgent.emitEvent({
      executionId: executionIdStr,
      workflowId: workflowIdStr,
      agent: 'orchestrator',
      level: 'info',
      eventType: 'ORCHESTRATOR_START',
      message: `Multi-agent orchestration pipeline started (LangGraph: ${this.langGraphStatus})`,
      metadata: { workflowName: workflow.name, nodesCount: workflow.nodes.length }
    });

    const executionContext = {
      input: execution.inputPayload || {},
      nodes: {},
      lastOutput: null
    };

    try {
      // 2. PLANNER AGENT: Graph topology analysis and planning
      await monitoringAgent.emitEvent({
        executionId: executionIdStr,
        workflowId: workflowIdStr,
        agent: 'planner',
        level: 'info',
        eventType: 'PLANNING_START',
        message: 'Planner Agent analyzing graph topology and dependency resolution...'
      });

      const plan = await plannerAgent.plan(execution.workflowSnapshot || workflow, execution.inputPayload);

      await monitoringAgent.emitEvent({
        executionId: executionIdStr,
        workflowId: workflowIdStr,
        agent: 'planner',
        level: 'success',
        eventType: 'PLAN_COMPLETED',
        message: `Plan generated with ${plan.totalSteps} steps (Confidence Score: ${(plan.confidenceScore * 100).toFixed(0)}%)`,
        metadata: { steps: plan.steps, confidenceScore: plan.confidenceScore, estimatedDurationMs: plan.estimatedDurationMs }
      });

      const nodeMap = new Map();
      (execution.workflowSnapshot?.nodes || workflow.nodes).forEach((n) => nodeMap.set(n.id, n));

      // 3. EXECUTE PLANNED STEPS SEQUENTIALLY
      for (const step of plan.steps) {
        // Check for cancellation
        if (executionControl.isCancelled) {
          execution.status = 'CANCELLED';
          execution.completedAt = new Date();
          execution.durationMs = Date.now() - execution.startedAt.getTime();
          await execution.save();

          await monitoringAgent.emitEvent({
            executionId: executionIdStr,
            workflowId: workflowIdStr,
            nodeId: step.nodeId,
            agent: 'orchestrator',
            level: 'warning',
            eventType: 'EXECUTION_CANCELLED',
            message: 'Workflow execution cancelled by operator'
          });
          return execution;
        }

        // Check for pause
        while (executionControl.isPaused) {
          await new Promise((r) => setTimeout(r, 500));
        }

        const node = nodeMap.get(step.nodeId);
        if (!node) continue;

        execution.currentNodeId = node.id;
        await execution.save();

        emitExecutionEvent(executionIdStr, 'execution:node_start', {
          executionId: executionIdStr,
          nodeId: node.id,
          stepIndex: step.stepIndex,
          label: node.data?.label || node.id
        });

        await monitoringAgent.emitEvent({
          executionId: executionIdStr,
          workflowId: workflowIdStr,
          nodeId: node.id,
          agent: 'execution',
          level: 'info',
          eventType: 'NODE_START',
          message: `Executing node [${node.data?.label || node.id}] (${node.data?.nodeType || node.type})`,
          metadata: { stepIndex: step.stepIndex, nodeType: node.data?.nodeType }
        });

        let stepSuccess = false;
        let retryAttempt = 0;
        let lastError = null;
        let execResult = null;

        while (!stepSuccess && retryAttempt <= execution.maxRetries) {
          try {
            // EXECUTION AGENT
            execResult = await executionAgent.executeNode(node, executionContext, {
              executionId: executionIdStr,
              workflowId: workflowIdStr,
              ownerId
            });

            // VALIDATION AGENT
            const validation = await validationAgent.validateNodeOutput(node, execResult);
            if (!validation.isValid) {
              const valError = new Error(validation.message);
              valError.code = 'MISSING_FIELDS';
              valError.details = validation.missingFields;
              throw valError;
            }

            await monitoringAgent.emitEvent({
              executionId: executionIdStr,
              workflowId: workflowIdStr,
              nodeId: node.id,
              agent: 'validation',
              level: 'success',
              eventType: 'VALIDATION_PASSED',
              message: `Validation Agent confirmed node output integrity (Confidence: ${(validation.confidence * 100).toFixed(0)}%)`,
              metadata: { checksPassed: validation.checksPassed }
            });

            stepSuccess = true;
          } catch (err) {
            lastError = err;
            const recoveryDecision = await recoveryAgent.handleFailure(err, node, {
              retryCount: retryAttempt,
              maxRetries: execution.maxRetries
            });

            await monitoringAgent.emitEvent({
              executionId: executionIdStr,
              workflowId: workflowIdStr,
              nodeId: node.id,
              agent: 'recovery',
              level: recoveryDecision.action === 'escalate' ? 'error' : 'warning',
              eventType: `RECOVERY_${recoveryDecision.action.toUpperCase()}`,
              message: recoveryDecision.reason,
              metadata: {
                errorClassification: recoveryDecision.errorClassification,
                action: recoveryDecision.action,
                backoffMs: recoveryDecision.backoffMs,
                errorMessage: err.message
              }
            });

            if (recoveryDecision.action === 'retry_with_backoff') {
              retryAttempt++;
              execution.retryCount = (execution.retryCount || 0) + 1;
              await execution.save();
              await new Promise((r) => setTimeout(r, recoveryDecision.backoffMs));
            } else {
              // Escalate -> Abort execution with failure
              throw err;
            }
          }
        }

        // Store step output into execution context
        executionContext.nodes[node.id] = execResult?.output;
        executionContext.lastOutput = execResult?.output;

        await monitoringAgent.emitEvent({
          executionId: executionIdStr,
          workflowId: workflowIdStr,
          nodeId: node.id,
          agent: 'monitoring',
          level: 'success',
          eventType: 'NODE_COMPLETE',
          message: `Node [${node.data?.label || node.id}] finished in ${execResult?.durationMs || 100}ms`,
          metadata: { output: execResult?.output }
        });

        emitExecutionEvent(executionIdStr, 'execution:node_complete', {
          executionId: executionIdStr,
          nodeId: node.id,
          output: execResult?.output
        });
      }

      // 4. WORKFLOW COMPLETION
      execution.status = 'COMPLETED';
      execution.completedAt = new Date();
      execution.durationMs = Date.now() - execution.startedAt.getTime();
      execution.currentNodeId = null;
      execution.outputPayload = executionContext.nodes;
      await execution.save();

      // Update workflow statistics
      await Workflow.updateOne(
        { _id: workflow._id },
        {
          $set: { lastExecutedAt: new Date() },
          $inc: { executionCount: 1, successCount: 1 }
        }
      );

      await monitoringAgent.emitEvent({
        executionId: executionIdStr,
        workflowId: workflowIdStr,
        agent: 'orchestrator',
        level: 'success',
        eventType: 'WORKFLOW_COMPLETED',
        message: `Workflow completed successfully in ${execution.durationMs}ms across all agents`,
        metadata: { durationMs: execution.durationMs, totalNodes: plan.totalSteps }
      });

      emitExecutionEvent(executionIdStr, 'execution:finish', {
        executionId: executionIdStr,
        status: 'COMPLETED',
        durationMs: execution.durationMs
      });

      await notificationService.createNotification({
        ownerId,
        workflowId: workflow._id,
        executionId: execution._id,
        type: 'success',
        title: 'Workflow Execution Completed',
        message: `Workflow "${workflow.name}" finished in ${(execution.durationMs / 1000).toFixed(1)}s.`
      });

      return execution;
    } catch (finalError) {
      execution.status = 'FAILED';
      execution.completedAt = new Date();
      execution.durationMs = Date.now() - execution.startedAt.getTime();
      execution.error = {
        message: finalError.message,
        code: finalError.code || 'EXECUTION_ERROR',
        details: finalError.details || null
      };
      await execution.save();

      await Workflow.updateOne(
        { _id: workflow._id },
        {
          $set: { lastExecutedAt: new Date() },
          $inc: { executionCount: 1, failureCount: 1 }
        }
      );

      await monitoringAgent.emitEvent({
        executionId: executionIdStr,
        workflowId: workflowIdStr,
        agent: 'orchestrator',
        level: 'error',
        eventType: 'WORKFLOW_FAILED',
        message: `Workflow execution failed: ${finalError.message}`,
        metadata: { errorCode: finalError.code, message: finalError.message }
      });

      emitExecutionEvent(executionIdStr, 'execution:finish', {
        executionId: executionIdStr,
        status: 'FAILED',
        error: execution.error
      });

      await notificationService.createNotification({
        ownerId,
        workflowId: workflow._id,
        executionId: execution._id,
        type: 'error',
        title: 'Workflow Execution Failed',
        message: `Workflow "${workflow.name}" encountered an error: ${finalError.message}`
      });

      return execution;
    } finally {
      activeExecutions.delete(executionIdStr);
    }
  }

  pauseExecution(executionId) {
    const control = activeExecutions.get(String(executionId));
    if (control) {
      control.isPaused = true;
      return true;
    }
    return false;
  }

  resumeExecution(executionId) {
    const control = activeExecutions.get(String(executionId));
    if (control) {
      control.isPaused = false;
      return true;
    }
    return false;
  }

  cancelExecution(executionId) {
    const control = activeExecutions.get(String(executionId));
    if (control) {
      control.isCancelled = true;
      control.isPaused = false;
      return true;
    }
    return false;
  }
}

module.exports = new AgentOrchestrator();
