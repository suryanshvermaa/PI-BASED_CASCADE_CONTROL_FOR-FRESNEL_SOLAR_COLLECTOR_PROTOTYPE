import { io } from 'socket.io-client';
import { API_URL } from './config';

export function createSocket() {
  return io(API_URL, {
    autoConnect: true,
    reconnection: true,
    timeout: 8000
  });
}
