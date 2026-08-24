import { io } from 'socket.io-client';

const SOCKET_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SOCKET_URL) || 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket && typeof window !== 'undefined') {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log(`[Socket.IO Client] Connected to ${SOCKET_URL} (${socket.id})`);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.IO Client] Connection error:', err.message);
    });
  }

  return socket;
}

export const socketClient = {
  on: (event, cb) => {
    const s = getSocket();
    if (s) s.on(event, cb);
  },
  off: (event, cb) => {
    const s = getSocket();
    if (s) s.off(event, cb);
  },
  emit: (event, data) => {
    const s = getSocket();
    if (s) s.emit(event, data);
  }
};

export function subscribeToExecution(executionId) {
  const s = getSocket();
  if (s && executionId) {
    s.emit('subscribe:execution', executionId);
  }
}

export function unsubscribeFromExecution(executionId) {
  const s = getSocket();
  if (s && executionId) {
    s.emit('unsubscribe:execution', executionId);
  }
}

export function subscribeToUser(userId) {
  const s = getSocket();
  if (s && userId) {
    s.emit('subscribe:user', userId);
  }
}
