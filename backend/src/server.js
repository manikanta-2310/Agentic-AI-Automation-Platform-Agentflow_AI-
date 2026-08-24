const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const config = require('./config');
const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const { initExecutionQueue } = require('./queues/executionQueue');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// 1. Unrestricted Clean CORS for Cloud Deployments
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(compression());
app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. API Routes
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    platform: 'Agentic AI Automation Platform (Agentflow_AI)',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 3. Fallback & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 4. Bootstrap Server
async function startServer() {
  try {
    console.log('[System] Initializing Agentflow_AI backend...');
    
    // Connect Database (MongoDB or In-Memory fallback)
    await connectDB();

    // Initialize Socket.IO
    initSocket(server);

    // Initialize Background Execution Queue
    initExecutionQueue();

    const PORT = config.PORT;
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Agentflow_AI Backend Engine listening on port ${PORT}`);
      console.log(`📡 WebSocket server initialized`);
      console.log(`🌐 Health check endpoint: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[System] Fatal server initialization error:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { app, server };
