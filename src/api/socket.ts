import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('access_token') || '',
  },
  autoConnect: false,
});

// Helper to reconnect socket when token changes
export const reconnectSocket = (token: string) => {
  socket.auth = { token };
  if (socket.connected) {
    socket.disconnect();
  }
  socket.connect();
};

export default socket;
