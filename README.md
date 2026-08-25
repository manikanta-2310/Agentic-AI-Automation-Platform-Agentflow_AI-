# 🚀 Agentflow_AI — Autonomous Multi-Agent Operations Automation Platform

<div align="center">

[![CI/CD Pipeline](https://github.com/manikanta-2310/Agentic-AI-Automation-Platform-Agentflow_AI-/actions/workflows/ci.yml/badge.svg)](https://github.com/manikanta-2310/Agentic-AI-Automation-Platform-Agentflow_AI-/actions)
[![Live Frontend Demo](https://img.shields.io/badge/Live_App-Vercel-000000?logo=vercel&logoColor=white)](https://agentic-ai-automation-platform-agen.vercel.app)
[![Live Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?logo=render&logoColor=black)](https://agentflow-backend-p03g.onrender.com)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vanilla CSS](https://img.shields.io/badge/Styling-Pure_Vanilla_CSS-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![Multi-Agent Engine](https://img.shields.io/badge/Multi--Agent_Engine-Native_5--Agent_Pipeline-purple.svg)](#-five-agent-autonomous-orchestration)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <b>Enterprise-Grade Multi-Agent AI Automation Platform</b><br>
  <i>Transforming Natural Language Prompts into Executable, Auditable React Flow Directed Acyclic Graphs (DAGs)</i>
</p>

</div>

---

## 🌐 Live Production Deployment

| Service | Cloud Platform | Live Link |
| :--- | :---: | :--- |
| **Frontend Web Application** | **Vercel** | 🔗 **[https://agentic-ai-automation-platform-agen.vercel.app](https://agentic-ai-automation-platform-agen.vercel.app)** |
| **Backend API Engine** | **Render** | 🔗 **[https://agentflow-backend-p03g.onrender.com](https://agentflow-backend-p03g.onrender.com)** |
| **Realtime WebSockets** | **Render / Socket.IO** | 📡 `wss://agentflow-backend-p03g.onrender.com` |
| **Cloud Database** | **MongoDB Atlas** | 🍃 Managed Cluster (`cluster0.0lkmd0a.mongodb.net`) |

---

## 📖 Overview

**Agentflow_AI** is a full-stack, enterprise-grade AI Operations Automation Platform. It enables operators to describe complex business workflows in plain English and automatically compiles them into executable, visual **React Flow DAGs**.

The platform executes workflow graphs through a cooperating chain of **5 specialized AI agents**, integrates with third-party tools (**Gmail**, **Slack**, **Discord**, **Google Sheets**) over OAuth with **AES-256-GCM** encryption at rest, provides live execution telemetry over WebSockets, and persists a complete audit trail to **MongoDB Atlas**.

---

## 📸 Platform Capabilities & Live Telemetry

### 1. ⚡ AI Prompt-to-Workflow Builder (`/workflows/builder`)
- **Natural Language Compilation**: Compiles English prompts like *"When a high-priority customer email arrives, classify intent with AI, send an urgent Slack message, and log to Google Sheets"* into a 6-node DAG.
- **Interactive Visual Canvas**: Powered by React Flow with custom animated handles, drag-and-drop node palettes, and instant zooming/centering.

### 2. 👁️ Observability & 5-Agent Execution Timeline (`/executions`)
- **Step-by-Step Multi-Agent Telemetry**: Streams real-time audit logs over WebSockets with latency metrics (`100ms`, `57ms`) and structured JSON payloads for every decision.
- **Lifecycle Controls**: Real-time pause, resume, and cancel capabilities.

### 3. 🔌 Third-Party OAuth Integrations (`/integrations`)
- **Extensible Adapters**: Built on a modular `BaseIntegration` architecture for Gmail, Slack, Discord, and Google Sheets.
- **Enterprise Security**: All OAuth tokens and secrets are encrypted at rest using application-level **AES-256-GCM** with 96-bit random IVs.

---

## 🏛️ Multi-Agent Architecture

```
                                  ┌───────────────────────────┐
                                  │   Operator Prompt / UI    │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   AI Workflow Generator   │
                                  │ (OpenRouter/Gemini/Rules) │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   React Flow Canvas UI    │
                                  └─────────────┬─────────────┘
                                                │ Execute
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    5-AGENT ORCHESTRATION PIPELINE                                      │
├─────────────────┬──────────────────┬──────────────────┬──────────────────┬─────────────────────────────┤
│ 1. PLANNER      │ 2. EXECUTION     │ 3. VALIDATION    │ 4. RECOVERY      │ 5. MONITORING               │
│ Analyzes graph  │ Computes nodes,  │ Enforces JSON    │ Classifies error │ Emits live telemetry        │
│ topology & Kahn │ resolves template│ output schemas & │ & executes retry │ & persists audit logs       │
│ dependency sort │ bindings & tools │ contracts        │ backoff/escalate │ to MongoDB & WebSockets     │
└─────────────────┴──────────────────┴──────────────────┴──────────────────┴─────────────────────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Third-Party OAuth Tools   │
                                  │ Gmail | Slack | Discord   │
                                  │      Google Sheets        │
                                  └───────────────────────────┘
```

### The 5 Agent Roles
1. **🧭 Planner Agent**: Analyzes workflow graph topology, performs Kahn's topological sort, detects cycles, and emits an execution plan with a confidence score (e.g. 95%).
2. **⚡ Execution Agent**: Executes node logic, evaluates conditions, resolves mustache variables (`{{nodeId.output.field}}`), and dispatches integration calls.
3. **✅ Validation Agent**: Verifies node outputs against required schemas and structural contracts before downstream progression (e.g. 98% confidence).
4. **🛡️ Recovery Agent**: Classifies runtime errors (`MISSING_FIELDS`, `API_FAILURE`, `AUTH_EXPIRED`, `RATE_LIMIT`, `TRANSIENT`) and applies exponential backoff or escalates.
5. **👁️ Monitoring Agent**: Emits live WebSocket telemetry to browser subscribers and writes structured `ExecutionLog` documents to MongoDB.

---

## ⚡ Quickstart: Local Setup

### 📋 Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher

### Step 1: Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### Step 2: Configure Environment
Copy `.env.example` to `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agentflow_ai?appName=Cluster0
JWT_SECRET=agentflow-jwt-secure-secret-key-32-chars-min
JWT_EXPIRES_IN=7d
CREDENTIAL_ENCRYPTION_KEY=12345678901234567890123456789012
```
*(Note: Leaving `MONGODB_URI` blank will automatically activate the zero-config In-Memory MongoDB fallback).*

### Step 3: Run the Application
From the root directory:
```bash
npm run dev
```

- **Frontend Console**: [http://localhost:3000](http://localhost:3000)
- **Backend API & WebSockets**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Testing & CI/CD

Run the full end-to-end multi-agent verification test suite:
```bash
node backend/test_flow.js
```

This verifies:
1. Backend heartbeat & health diagnostics (`GET /api/health`)
2. Operator account registration & JWT issuance (`POST /api/auth/register`)
3. User profile verification (`GET /api/auth/me`)
4. AI Prompt-to-Workflow graph generation (`POST /api/workflows/generate`)
5. Workflow persistence (`POST /api/workflows`)
6. Multi-agent execution orchestration (`POST /api/workflows/:id/execute`)
7. Full 5-agent audit log timeline stream (`GET /api/executions/:id/timeline`)

---

## 📂 Project Structure

```
Agentflow_AI/
├── .github/
│   └── workflows/
│       └── ci.yml                      # Automated GitHub Actions CI/CD Pipeline
├── backend/
│   ├── src/
│   │   ├── agents/                     # 5-Agent Multi-Agent Subsystem
│   │   │   ├── agentOrchestrator.js    # Master multi-agent coordinator & event pipeline
│   │   │   ├── plannerAgent.js         # Graph topology & confidence scoring
│   │   │   ├── executionAgent.js       # Node execution & template resolution
│   │   │   ├── validationAgent.js      # Schema verification & contract checks
│   │   │   ├── recoveryAgent.js        # Error taxonomy & exponential backoff
│   │   │   └── monitoringAgent.js      # Audit logs & WebSocket telemetry
│   │   ├── config/                     # System configs (DB, Redis, Socket.IO)
│   │   ├── controllers/                # REST Controllers
│   │   ├── integrations/               # Gmail, Slack, Discord, Google Sheets
│   │   ├── middlewares/                # Auth, express-validator, error handler
│   │   ├── models/                     # Mongoose schemas (User, Workflow, Execution)
│   │   ├── queues/                     # In-Memory & Redis queue runners
│   │   ├── routes/                     # Express routes
│   │   ├── services/                   # Business logic layer
│   │   └── server.js                   # Express + Socket.IO server entry point
│   ├── .env.example
│   ├── package.json
│   └── test_flow.js                    # Automated verification suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                 # LoadingSpinner, StatusBadge, SkeletonLoader
│   │   │   ├── dashboard/              # MetricGrid, WorkflowCard, AIActivityFeed
│   │   │   ├── execution/              # AgentBadge, ExecutionControls, Timeline, LogViewer
│   │   │   ├── integrations/           # IntegrationCard, OAuthConnectModal
│   │   │   ├── layout/                 # AppShell, Navbar, Sidebar, NotificationsDrawer
│   │   │   └── workflow/               # Canvas, Palette, ConfigPanel, Custom Nodes
│   │   ├── lib/                        # API client, Socket client, Node Catalog
│   │   ├── pages/                      # React Router DOM pages
│   │   ├── store/                      # Zustand state stores (auth, workflow, execution)
│   │   ├── styles/                     # Pure Vanilla CSS Design System (main.css)
│   │   ├── App.jsx                     # React Router tree
│   │   └── main.jsx                    # React 19 bootstrap entry
│   ├── index.html                      # Root SPA template
│   ├── package.json                    # Vite + React 19 dependencies
│   ├── vercel.json                     # Vercel SPA client-side routing
│   └── vite.config.js                  # Vite configuration
├── package.json                        # Monorepo root scripts
├── spec.md                             # Specification sheet
└── README.md                           # Documentation & Portfolio Guide
```

---

## 🔒 Security & Compliance
- **Password Hashing**: Bcrypt cost 12
- **JWT Authentication**: Signed with `JWT_SECRET`, 7-day expiration
- **Credential Storage**: AES-256-GCM encryption at rest with application-level key (`CREDENTIAL_ENCRYPTION_KEY`)
- **HTTP Hardening**: Custom CORS reflection + Compression
- **Rate Limiting**: `express-rate-limit` active on auth routes
- **Request Validation**: `express-validator` schema enforcement on all mutation endpoints

---

## 🤝 License
MIT License. Copyright (c) 2026 Manikanta Banoth.
