import { io } from 'socket.io-client';
import { API_URL } from './config';

/**
 * Create and return a singleton-like Socket.IO client instance.
 * Configured with reconnection + 8s timeout for resilience.
 */
export function createSocket() {
  return io(API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 8000,
  });
}
