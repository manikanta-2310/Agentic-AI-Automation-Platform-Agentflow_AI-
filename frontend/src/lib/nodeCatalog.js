export const NODE_CATALOG = [
  // 1. TRIGGERS
  {
    type: 'triggerNode',
    nodeType: 'webhook',
    category: 'trigger',
    label: 'Webhook Trigger',
    icon: 'Webhook',
    color: '#3b82f6',
    description: 'Triggers execution on incoming HTTP webhook POST request',
    defaultConfig: {
      event: 'http_post',
      authRequired: true,
      payloadExample: { message: 'Sample event payload', source: 'external_api' }
    },
    fields: [
      { name: 'event', label: 'Event Identifier', type: 'text', placeholder: 'e.g. order_created' },
      { name: 'authRequired', label: 'Require Authentication', type: 'boolean' }
    ]
  },
  {
    type: 'triggerNode',
    nodeType: 'email_trigger',
    category: 'trigger',
    label: 'Gmail New Email',
    icon: 'Mail',
    color: '#ea4335',
    description: 'Triggers when a new matching email arrives in Gmail',
    defaultConfig: {
      filterQuery: 'is:unread',
      pollIntervalMinutes: 5
    },
    fields: [
      { name: 'filterQuery', label: 'Gmail Search Filter', type: 'text', placeholder: 'label:inbox is:unread' },
      { name: 'pollIntervalMinutes', label: 'Polling Interval (min)', type: 'number' }
    ]
  },
  {
    type: 'triggerNode',
    nodeType: 'schedule_trigger',
    category: 'trigger',
    label: 'Scheduled Cron',
    icon: 'Clock',
    color: '#6366f1',
    description: 'Triggers periodically on a recurring cron schedule',
    defaultConfig: {
      cron: '0 9 * * 1-5',
      timezone: 'UTC'
    },
    fields: [
      { name: 'cron', label: 'Cron Expression', type: 'text', placeholder: '0 * * * *' },
      { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'UTC' }
    ]
  },
  {
    type: 'triggerNode',
    nodeType: 'sheet_trigger',
    category: 'trigger',
    label: 'Google Sheet Row',
    icon: 'Sheet',
    color: '#10b981',
    description: 'Triggers when a new row is appended to a Google Sheet',
    defaultConfig: {
      spreadsheetId: 'default-sheet-id',
      sheetName: 'Sheet1'
    },
    fields: [
      { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text' },
      { name: 'sheetName', label: 'Sheet Name', type: 'text' }
    ]
  },

  // 2. AI NODES
  {
    type: 'aiNode',
    nodeType: 'ai_classifier',
    category: 'ai',
    label: 'AI Intent Classifier',
    icon: 'Brain',
    color: '#8b5cf6',
    description: 'Categorizes input data, detects sentiment and assigns urgency scores',
    defaultConfig: {
      model: 'gemini-1.5-flash',
      categories: ['Support', 'Billing', 'Bug Report', 'Feature Request'],
      urgencyLevels: ['low', 'medium', 'high', 'critical']
    },
    fields: [
      { name: 'model', label: 'Model Provider', type: 'select', options: ['gemini-1.5-flash', 'gpt-4o-mini', 'claude-3-5-haiku'] },
      { name: 'temperature', label: 'Temperature', type: 'number', min: 0, max: 1, step: 0.1 }
    ]
  },
  {
    type: 'aiNode',
    nodeType: 'ai_extractor',
    category: 'ai',
    label: 'AI Data Extractor',
    icon: 'Cpu',
    color: '#a855f7',
    description: 'Extracts structured JSON entities, invoices, dates, and amounts from text',
    defaultConfig: {
      schemaTemplate: '{\n  "name": "string",\n  "amount": "number",\n  "date": "string"\n}'
    },
    fields: [
      { name: 'schemaTemplate', label: 'Extraction Schema (JSON)', type: 'textarea' }
    ]
  },
  {
    type: 'aiNode',
    nodeType: 'ai_summarizer',
    category: 'ai',
    label: 'AI Text Summarizer',
    icon: 'Sparkles',
    color: '#ec4899',
    description: 'Synthesizes lengthy inputs into actionable bullet points or executive summaries',
    defaultConfig: {
      maxWords: 100,
      format: 'bullet_points'
    },
    fields: [
      { name: 'maxWords', label: 'Max Word Count', type: 'number' },
      { name: 'format', label: 'Summary Format', type: 'select', options: ['bullet_points', 'paragraph', 'tldr'] }
    ]
  },
  {
    type: 'aiNode',
    nodeType: 'ai_reasoner',
    category: 'ai',
    label: 'Agentic Reasoner',
    icon: 'Orbit',
    color: '#06b6d4',
    description: 'Multi-step reasoning engine with tool planning and autonomous decision making',
    defaultConfig: {
      systemPrompt: 'Evaluate operational parameters and select optimal action plan.',
      maxReasoningSteps: 3
    },
    fields: [
      { name: 'systemPrompt', label: 'System Instructions', type: 'textarea' },
      { name: 'maxReasoningSteps', label: 'Reasoning Depth', type: 'number' }
    ]
  },

  // 3. LOGIC NODES
  {
    type: 'logicNode',
    nodeType: 'condition_branch',
    category: 'logic',
    label: 'Condition Branch',
    icon: 'GitBranch',
    color: '#f59e0b',
    description: 'Branches execution flow based on boolean expressions and data fields',
    defaultConfig: {
      field: 'urgency',
      operator: 'equals',
      value: 'high'
    },
    fields: [
      { name: 'field', label: 'Variable Field Path', type: 'text', placeholder: 'e.g. urgency' },
      { name: 'operator', label: 'Operator', type: 'select', options: ['equals', 'contains', 'greater_than', 'less_than'] },
      { name: 'value', label: 'Target Value', type: 'text' }
    ]
  },
  {
    type: 'logicNode',
    nodeType: 'filter',
    category: 'logic',
    label: 'Data Filter',
    icon: 'Filter',
    color: '#eab308',
    description: 'Filters array data items according to specified threshold rules',
    defaultConfig: {
      filterExpression: 'item.score > 0.7'
    },
    fields: [
      { name: 'filterExpression', label: 'Filter Rule Expression', type: 'text' }
    ]
  },
  {
    type: 'logicNode',
    nodeType: 'delay',
    category: 'logic',
    label: 'Execution Delay',
    icon: 'Hourglass',
    color: '#fb923c',
    description: 'Pauses workflow execution for a designated duration before proceeding',
    defaultConfig: {
      delaySeconds: 10
    },
    fields: [
      { name: 'delaySeconds', label: 'Delay (seconds)', type: 'number' }
    ]
  },

  // 4. ACTION NODES
  {
    type: 'actionNode',
    nodeType: 'gmail_send_email',
    category: 'action',
    label: 'Send Gmail',
    icon: 'Send',
    color: '#ea4335',
    description: 'Dispatches automated emails via connected Gmail OAuth integration',
    defaultConfig: {
      to: '{{node-trigger.output.sender}}',
      subject: 'Automated Agentflow Notification',
      body: 'Hello,\n\nYour task has been processed.\n{{node-ai.output.summary}}'
    },
    fields: [
      { name: 'to', label: 'Recipient (To)', type: 'text', placeholder: 'user@example.com or {{variable}}' },
      { name: 'subject', label: 'Email Subject', type: 'text' },
      { name: 'body', label: 'Email Body Content', type: 'textarea' }
    ]
  },
  {
    type: 'actionNode',
    nodeType: 'slack_send_message',
    category: 'action',
    label: 'Post Slack Alert',
    icon: 'MessageSquare',
    color: '#10b981',
    description: 'Sends real-time messages and status cards to Slack channels',
    defaultConfig: {
      channel: '#ops-alerts',
      messageTemplate: '🚀 [Agentflow Alert] {{node-ai.output.summary}}'
    },
    fields: [
      { name: 'channel', label: 'Channel Name', type: 'text', placeholder: '#ops-alerts' },
      { name: 'messageTemplate', label: 'Message Template', type: 'textarea' }
    ]
  },
  {
    type: 'actionNode',
    nodeType: 'discord_send_message',
    category: 'action',
    label: 'Discord Broadcast',
    icon: 'Bot',
    color: '#5865f2',
    description: 'Dispatches rich embed notifications to Discord servers',
    defaultConfig: {
      channel: 'general-alerts',
      embedTitle: 'Agentflow Automation Triggered'
    },
    fields: [
      { name: 'channel', label: 'Channel / Webhook', type: 'text' },
      { name: 'embedTitle', label: 'Embed Title / Message', type: 'textarea' }
    ]
  },
  {
    type: 'actionNode',
    nodeType: 'sheets_append_row',
    category: 'action',
    label: 'Append Google Sheet',
    icon: 'Table',
    color: '#10b981',
    description: 'Inserts row records into Google Sheets spreadsheets',
    defaultConfig: {
      spreadsheetId: 'ops-ledger-v1',
      sheetName: 'AuditLogs',
      valuesTemplate: ['{{timestamp}}', '{{node-ai.output.classification}}', '{{node-ai.output.summary}}']
    },
    fields: [
      { name: 'spreadsheetId', label: 'Spreadsheet ID', type: 'text' },
      { name: 'sheetName', label: 'Sheet / Tab Name', type: 'text' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Nodes' },
  { id: 'trigger', label: 'Triggers', color: 'text-blue-400' },
  { id: 'ai', label: 'AI Intelligence', color: 'text-purple-400' },
  { id: 'logic', label: 'Flow & Logic', color: 'text-amber-400' },
  { id: 'action', label: 'Integrations & Actions', color: 'text-emerald-400' }
];

export const NODE_CATEGORIES = {
  trigger: { label: 'Triggers' },
  ai: { label: 'AI Nodes' },
  logic: { label: 'Logic' },
  action: { label: 'Actions' }
};

export function getNodeDefinition(nodeType) {
  return NODE_CATALOG.find((n) => n.nodeType === nodeType) || {
    label: nodeType,
    category: 'action',
    description: 'Custom node element',
    defaultConfig: {},
    fields: []
  };
}
