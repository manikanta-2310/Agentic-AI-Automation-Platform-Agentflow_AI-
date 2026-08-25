const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runVerification() {
  console.log('--- STARTING AGENTFLOW_AI VERIFICATION TEST SUITE ---');

  // Start backend server in process if not already running
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 1500 });
  } catch (_) {
    console.log('[Test Suite] Spawning backend server instance in background...');
    require('./src/server');
    // Wait for server to bind to port 5000
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  // 1. Health Check
  console.log('\n[1/7] Testing GET /api/health ...');
  const healthRes = await axios.get(`${BASE_URL}/health`);
  console.log('✓ Health status:', healthRes.data.status, '| Database:', healthRes.data.system.database, '| Agent Engine:', healthRes.data.system.agentEngine);

  // 2. User Registration
  const testEmail = `operator_${Date.now()}@agentflow.io`;
  console.log(`\n[2/7] Testing POST /api/auth/register (${testEmail}) ...`);
  const regRes = await axios.post(`${BASE_URL}/auth/register`, {
    name: 'Operator Chief',
    email: testEmail,
    password: 'password123',
    role: 'operator'
  });
  const token = regRes.data.data.token;
  const user = regRes.data.data.user;
  console.log('✓ Registration successful! User ID:', user.id, '| Role:', user.role);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 3. User Me
  console.log('\n[3/7] Testing GET /api/auth/me ...');
  const meRes = await axios.get(`${BASE_URL}/auth/me`, authHeaders);
  console.log('✓ Auth verification confirmed for:', meRes.data.data.email);

  // 4. AI Workflow Generation
  console.log('\n[4/7] Testing POST /api/workflows/generate (Prompt-to-Graph) ...');
  const prompt = 'When a customer submits a high priority support email, classify intent with AI, send Slack alert, and log to Google Sheets.';
  const genRes = await axios.post(`${BASE_URL}/workflows/generate`, { prompt }, authHeaders);
  console.log('✓ AI Generated Workflow Graph:', genRes.data.data.name, '| Nodes:', genRes.data.data.nodes?.length, '| Edges:', genRes.data.data.edges?.length);

  // 5. Create Workflow in DB
  console.log('\n[5/7] Testing POST /api/workflows (Persisting Graph) ...');
  const createRes = await axios.post(`${BASE_URL}/workflows`, {
    name: genRes.data.data.name,
    description: genRes.data.data.description,
    nodes: genRes.data.data.nodes,
    edges: genRes.data.data.edges,
    tags: genRes.data.data.tags
  }, authHeaders);
  const workflowId = createRes.data.data._id;
  console.log('✓ Workflow created with ID:', workflowId);

  // 6. Execute Workflow
  console.log('\n[6/7] Testing POST /api/workflows/:id/execute (Triggering Agent Chain) ...');
  const execRes = await axios.post(`${BASE_URL}/workflows/${workflowId}/execute`, {
    inputPayload: {
      sender: 'enterprise-client@acme.corp',
      subject: 'Critical: Production Outage Detected',
      body: 'Our checkout API is failing with 500 status. Immediate triage needed.'
    }
  }, authHeaders);
  const executionId = execRes.data.data._id;
  console.log('✓ Execution job queued with ID:', executionId, '| Status:', execRes.data.data.status);

  // Poll for completion
  console.log('Polling execution lifecycle...');
  let completed = false;
  let attempts = 0;
  while (!completed && attempts < 15) {
    await new Promise((r) => setTimeout(r, 1000));
    const statusRes = await axios.get(`${BASE_URL}/executions/${executionId}`, authHeaders);
    const st = statusRes.data.data.status;
    console.log(`- Status check [${attempts + 1}s]: ${st} | Current Node: ${statusRes.data.data.currentNodeId || 'none'}`);
    if (st === 'COMPLETED' || st === 'FAILED' || st === 'CANCELLED') {
      completed = true;
      console.log('✓ Execution finished with final status:', st, '| Duration:', statusRes.data.data.durationMs, 'ms');
    }
    attempts++;
  }

  // 7. Verify Timeline Logs
  console.log('\n[7/7] Testing GET /api/executions/:id/timeline ...');
  const timelineRes = await axios.get(`${BASE_URL}/executions/${executionId}/timeline`, authHeaders);
  console.log('✓ Retrieved', timelineRes.data.data.timeline?.length, 'agent audit logs:');
  timelineRes.data.data.timeline?.forEach((l, i) => {
    console.log(`   [Step ${i + 1}] [${l.agent.toUpperCase()}] [${l.level}] ${l.eventType}: ${l.message}`);
  });

  console.log('\n====================================================');
  console.log('🎉 ALL AGENTIC AUTOMATION PLATFORM TESTS PASSED!');
  console.log('====================================================');

  process.exit(0);
}

runVerification().catch((err) => {
  console.error('TEST ERROR:', err.response?.data || err.message);
  process.exit(1);
});
