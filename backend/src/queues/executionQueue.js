const { Queue, Worker } = require('bullmq');
const { getRedisClient, isRedisAvailable } = require('../config/redis');
const agentOrchestrator = require('../agents/agentOrchestrator');

let executionQueue = null;
let executionWorker = null;

function initExecutionQueue() {
  const redis = getRedisClient();

  if (redis && isRedisAvailable()) {
    try {
      console.log('[Queue] Initializing BullMQ execution queue on Redis...');
      executionQueue = new Queue('workflow-executions', { connection: redis });

      executionWorker = new Worker(
        'workflow-executions',
        async (job) => {
          const { executionId } = job.data;
          console.log(`[BullMQ Worker] Processing execution job ${executionId}`);
          return agentOrchestrator.runWorkflow(executionId);
        },
        { connection: redis, concurrency: 5 }
      );

      executionWorker.on('completed', (job) => {
        console.log(`[BullMQ Worker] Job ${job.id} for execution ${job.data.executionId} completed`);
      });

      executionWorker.on('failed', (job, err) => {
        console.error(`[BullMQ Worker] Job ${job.id} failed:`, err.message);
      });

      return;
    } catch (err) {
      console.warn('[Queue] Failed to initialize BullMQ worker:', err.message);
    }
  }

  console.log('[Queue] Operating in Async In-Memory Queue mode (Zero-Redis dependency)');
}

async function addExecutionJob(executionId, data = {}) {
  if (executionQueue && isRedisAvailable()) {
    try {
      const job = await executionQueue.add('run-workflow', { executionId, ...data }, {
        attempts: 1, // Retries are handled internally by the Recovery Agent
        removeOnComplete: true
      });
      return { jobId: job.id, mode: 'bullmq' };
    } catch (err) {
      console.warn('[Queue] BullMQ enqueue failed, falling back to direct async runner:', err.message);
    }
  }

  // In-Memory Asynchronous Job Runner
  setImmediate(() => {
    agentOrchestrator.runWorkflow(executionId).catch((err) => {
      console.error(`[In-Memory Queue] Unhandled execution failure for ${executionId}:`, err.message);
    });
  });

  return { jobId: `mem_${Date.now()}`, mode: 'in-memory' };
}

module.exports = {
  initExecutionQueue,
  addExecutionJob
};
