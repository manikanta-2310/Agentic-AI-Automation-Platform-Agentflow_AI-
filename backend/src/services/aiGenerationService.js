const axios = require('axios');
const config = require('../config');

// Deterministic fallback generator for instant, zero-API-key local execution
function buildDeterministicWorkflow(prompt) {
  const p = prompt.toLowerCase();

  let workflowName = 'AI Automated Workflow';
  let description = `Generated from prompt: "${prompt}"`;
  let nodes = [];
  let edges = [];

  // Default coordinate offsets
  let x = 100;
  let y = 150;
  const xStep = 320;

  // 1. Determine Trigger
  let triggerType = 'webhook';
  let triggerLabel = 'Webhook Trigger';
  let triggerDesc = 'Triggers on incoming HTTP POST payload';

  if (p.includes('email') || p.includes('gmail') || p.includes('inbox')) {
    triggerType = 'email_trigger';
    triggerLabel = 'New Email Trigger';
    triggerDesc = 'Triggers when a new customer email arrives';
  } else if (p.includes('schedule') || p.includes('every') || p.includes('daily') || p.includes('cron')) {
    triggerType = 'schedule_trigger';
    triggerLabel = 'Scheduled Cron';
    triggerDesc = 'Runs periodically on schedule';
  } else if (p.includes('sheet') || p.includes('row')) {
    triggerType = 'sheet_trigger';
    triggerLabel = 'Sheet Row Added';
    triggerDesc = 'Triggers when a new row is appended';
  }

  nodes.push({
    id: 'node-trigger',
    type: 'triggerNode',
    position: { x, y },
    data: {
      label: triggerLabel,
      nodeType: triggerType,
      category: 'trigger',
      description: triggerDesc,
      config: {
        event: 'on_receive',
        payloadExample: { sender: 'operator@agentflow.io', subject: 'Urgent Request', body: prompt }
      }
    }
  });
  x += xStep;

  // 2. Determine AI Processing Node
  let aiType = 'ai_classifier';
  let aiLabel = 'AI Intent Classifier';
  let aiDesc = 'Classifies incoming request category and urgency';

  if (p.includes('extract') || p.includes('invoice') || p.includes('parse') || p.includes('json')) {
    aiType = 'ai_extractor';
    aiLabel = 'AI Structured Extractor';
    aiDesc = 'Extracts key entities, amounts, and dates';
  } else if (p.includes('summarize') || p.includes('digest')) {
    aiType = 'ai_summarizer';
    aiLabel = 'AI Summarizer';
    aiDesc = 'Generates concise summary of the incoming message';
  } else if (p.includes('reason') || p.includes('agent') || p.includes('decision')) {
    aiType = 'ai_reasoner';
    aiLabel = 'Agentic Reasoning Engine';
    aiDesc = 'Multi-step reasoning and strategy determination';
  }

  nodes.push({
    id: 'node-ai',
    type: 'aiNode',
    position: { x, y },
    data: {
      label: aiLabel,
      nodeType: aiType,
      category: 'ai',
      description: aiDesc,
      config: {
        model: 'gemini-1.5-pro',
        systemPrompt: 'You are an AI Operations Agent. Analyze the input and output structured JSON result.',
        temperature: 0.2
      }
    }
  });

  edges.push({
    id: 'edge-trigger-ai',
    source: 'node-trigger',
    target: 'node-ai',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 }
  });
  x += xStep;

  // 3. Optional Condition or Filter
  if (p.includes('if') || p.includes('condition') || p.includes('urgent') || p.includes('filter') || p.includes('priority')) {
    nodes.push({
      id: 'node-logic',
      type: 'logicNode',
      position: { x, y: y - 50 },
      data: {
        label: 'Priority Filter',
        nodeType: 'condition_branch',
        category: 'logic',
        description: 'Branches based on AI urgency score',
        config: {
          field: 'urgency',
          operator: 'gte',
          value: 'high'
        }
      }
    });

    edges.push({
      id: 'edge-ai-logic',
      source: 'node-ai',
      target: 'node-logic',
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2 }
    });
    x += xStep;
  }

  // 4. Action Destinations (Slack, Discord, Gmail, Sheets)
  const previousNodeId = nodes[nodes.length - 1].id;
  let actionCount = 0;

  if (p.includes('slack') || (!p.includes('discord') && !p.includes('gmail') && !p.includes('sheet'))) {
    actionCount++;
    const actionId = `node-slack-${actionCount}`;
    nodes.push({
      id: actionId,
      type: 'actionNode',
      position: { x, y: y - 80 * (actionCount - 1) },
      data: {
        label: 'Slack Notification',
        nodeType: 'slack_send_message',
        category: 'action',
        description: 'Dispatches message to #ops-alerts channel',
        config: {
          channel: '#ops-alerts',
          messageTemplate: '🚨 [Agentflow Alert] {{node-ai.output.summary}}'
        }
      }
    });
    edges.push({
      id: `edge-${previousNodeId}-${actionId}`,
      source: previousNodeId,
      target: actionId,
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    });
  }

  if (p.includes('discord')) {
    actionCount++;
    const actionId = `node-discord-${actionCount}`;
    nodes.push({
      id: actionId,
      type: 'actionNode',
      position: { x, y: y + 80 * (actionCount - 1) },
      data: {
        label: 'Discord Bot Broadcast',
        nodeType: 'discord_send_message',
        category: 'action',
        description: 'Sends rich embed notification to Discord server',
        config: {
          channel: 'general-alerts',
          embedTitle: 'Agentflow Automated Action'
        }
      }
    });
    edges.push({
      id: `edge-${previousNodeId}-${actionId}`,
      source: previousNodeId,
      target: actionId,
      animated: true,
      style: { stroke: '#5865f2', strokeWidth: 2 }
    });
  }

  if (p.includes('sheet') || p.includes('log') || p.includes('record')) {
    actionCount++;
    const actionId = `node-sheets-${actionCount}`;
    nodes.push({
      id: actionId,
      type: 'actionNode',
      position: { x, y: y + 100 },
      data: {
        label: 'Append to Google Sheet',
        nodeType: 'sheets_append_row',
        category: 'action',
        description: 'Appends audit record to operations ledger',
        config: {
          spreadsheetId: 'ops-ledger-v1',
          sheetName: 'AuditLogs',
          valuesTemplate: ['{{timestamp}}', '{{node-ai.output.classification}}', '{{node-ai.output.summary}}']
        }
      }
    });
    edges.push({
      id: `edge-${previousNodeId}-${actionId}`,
      source: previousNodeId,
      target: actionId,
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    });
  }

  if (p.includes('email') || p.includes('gmail') || p.includes('reply') || p.includes('send to')) {
    actionCount++;
    const actionId = `node-gmail-${actionCount}`;
    nodes.push({
      id: actionId,
      type: 'actionNode',
      position: { x, y: y - 100 },
      data: {
        label: 'Send Gmail Response',
        nodeType: 'gmail_send_email',
        category: 'action',
        description: 'Sends confirmation response via Gmail',
        config: {
          to: '{{node-trigger.output.sender}}',
          subject: 'Re: {{node-trigger.output.subject}} - Processed',
          body: 'Hello,\n\nYour request has been processed by Agentflow AI:\n{{node-ai.output.summary}}'
        }
      }
    });
    edges.push({
      id: `edge-${previousNodeId}-${actionId}`,
      source: previousNodeId,
      target: actionId,
      animated: true,
      style: { stroke: '#ea4335', strokeWidth: 2 }
    });
  }

  // Derive workflow name from prompt
  const words = prompt.trim().split(' ').slice(0, 5).join(' ');
  workflowName = words.length > 0 ? `${words.charAt(0).toUpperCase() + words.slice(1)} Workflow` : 'Automated Workflow';

  return {
    name: workflowName,
    description: `Automated agent graph generated from: "${prompt}"`,
    tags: ['ai-generated', triggerType, aiType],
    nodes,
    edges,
    generatorSource: 'deterministic-rule-builder'
  };
}

// Generate workflow graph using OpenRouter
async function generateWithOpenRouter(prompt) {
  if (!config.OPENROUTER_API_KEY) return null;

  const systemPrompt = `You are an expert AI Operations Workflow Architect. Given a natural language description, you must return a valid JSON object representing an executable workflow graph with nodes and edges compatible with React Flow.
Return ONLY valid JSON matching this schema:
{
  "name": "string",
  "description": "string",
  "tags": ["string"],
  "nodes": [
    {
      "id": "string",
      "type": "triggerNode" | "actionNode" | "aiNode" | "logicNode",
      "position": { "x": number, "y": number },
      "data": {
        "label": "string",
        "nodeType": "string",
        "category": "trigger" | "action" | "ai" | "logic",
        "description": "string",
        "config": {}
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "nodeId",
      "target": "nodeId",
      "animated": true,
      "style": { "stroke": "#6366f1", "strokeWidth": 2 }
    }
  ]
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a full visual automation graph for this request: "${prompt}"` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      if (parsed.nodes && parsed.edges) {
        parsed.generatorSource = 'openrouter';
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[AIGenerationService] OpenRouter failed, trying fallback provider:', err.message);
  }
  return null;
}

// Generate workflow graph using Google Gemini
async function generateWithGemini(prompt) {
  if (!config.GEMINI_API_KEY) return null;

  const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

  const systemPrompt = `You are an expert AI Operations Workflow Architect. Generate a JSON object containing { name, description, tags, nodes, edges } for React Flow based on this automation requirement: "${prompt}".
Output valid raw JSON only without markdown formatting.
Available node categories:
- triggerNode (webhook, email_trigger, schedule_trigger)
- aiNode (ai_classifier, ai_extractor, ai_summarizer, ai_reasoner)
- logicNode (condition_branch, delay, filter)
- actionNode (gmail_send_email, slack_send_message, discord_send_message, sheets_append_row, http_request)
Ensure nodes are laid out left to right (x starts at 100, increases by 320 for each step).`;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text().trim();
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.nodes && parsed.edges) {
        parsed.generatorSource = `gemini (${modelName})`;
        return parsed;
      }
    } catch (err) {
      // Continue to next candidate model
      console.warn(`[AIGenerationService] Gemini model ${modelName} attempt failed (${err.message}). Trying next...`);
    }
  }

  return null;
}

async function generateWorkflow(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required for workflow generation');
  }

  // 1. Try OpenRouter
  let workflow = await generateWithOpenRouter(prompt);
  if (workflow) return workflow;

  // 2. Try Gemini
  workflow = await generateWithGemini(prompt);
  if (workflow) return workflow;

  // 3. Deterministic Rule-Based Graph Builder
  console.log('[AIGenerationService] Generating workflow with Deterministic Rule Builder');
  return buildDeterministicWorkflow(prompt);
}

module.exports = {
  generateWorkflow,
  buildDeterministicWorkflow
};
