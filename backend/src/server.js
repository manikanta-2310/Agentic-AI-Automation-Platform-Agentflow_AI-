const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');
const { initExecutionQueue } = require('./queues/executionQueue');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const server = http.createServer(app);

// 1. Security & Core Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Dynamically allow all incoming web origins (Vercel, localhost, Render)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(compression());
app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Auth Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. API Routes
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

// 4. Fallback & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Bootstrap Server
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
