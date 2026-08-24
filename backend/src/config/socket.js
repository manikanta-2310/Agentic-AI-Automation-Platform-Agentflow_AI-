const { Server } = require('socket.io');
const config = require('./index');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('subscribe:execution', (executionId) => {
      if (executionId) {
        socket.join(`execution_${executionId}`);
        console.log(`[Socket.IO] ${socket.id} subscribed to execution_${executionId}`);
      }
    });

    socket.on('unsubscribe:execution', (executionId) => {
      if (executionId) {
        socket.leave(`execution_${executionId}`);
      }
    });

    socket.on('subscribe:user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO] ${socket.id} subscribed to user_${userId}`);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

function emitExecutionEvent(executionId, eventName, data) {
  if (io) {
    io.to(`execution_${executionId}`).emit(eventName, data);
    // Also broadcast globally for dashboard live updates
    io.emit(`global:${eventName}`, { executionId, ...data });
  }
}

function emitUserEvent(userId, eventName, data) {
  if (io) {
    io.to(`user_${userId}`).emit(eventName, data);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitExecutionEvent,
  emitUserEvent
};
