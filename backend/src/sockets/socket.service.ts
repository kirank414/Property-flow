import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisClient, subClient } from '../config/redis';
import { TokenService } from '../utils/tokens';
import { logger } from '../utils/logger';

export class SocketService {
  private io!: SocketServer;

  /**
   * Initializes the Socket.io Server with Redis Pub/Sub adapter for horizontal clustering
   */
  init(server: any) {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*', // Customize based on client URL in production
        methods: ['GET', 'POST'],
      },
    });

    // Connect Redis Adapter if Redis clients are open
    if (redisClient.isOpen && subClient.isOpen) {
      this.io.adapter(createAdapter(redisClient, subClient));
      logger.info('🔌 Socket.io Redis Adapter configured successfully.');
    } else {
      logger.warn('⚠️ Socket.io Redis adapter bypassed: Redis connections not active. Running on Local Memory.');
    }

    // Token-based Authentication Guard
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
          return next(new Error('Authentication error: Token credentials required.'));
        }

        const decoded = TokenService.verifyAccessToken(token);
        socket.data.userId = decoded.id;
        next();
      } catch (_err) {
        return next(new Error('Authentication error: Invalid token signature.'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      logger.info(`⚡ Socket Client connected: ${socket.id} (User: ${userId})`);

      // Bind connection to private user room channel
      socket.join(`user:${userId}`);

      // Handle custom property channel joins (for real-time property management scopes)
      socket.on('join:property', (propertyId: string) => {
        socket.join(`property:${propertyId}`);
        logger.debug(`Socket ${socket.id} joined room: property:${propertyId}`);
      });

      socket.on('leave:property', (propertyId: string) => {
        socket.leave(`property:${propertyId}`);
        logger.debug(`Socket ${socket.id} left room: property:${propertyId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`⚡ Socket Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emits a real-time event directly to a private user room
   */
  toUser(userId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, payload);
    }
  }

  /**
   * Emits a real-time event to all connections in a specific property scope
   */
  toProperty(propertyId: string, event: string, payload: any) {
    if (this.io) {
      this.io.to(`property:${propertyId}`).emit(event, payload);
    }
  }

  /**
   * Broadcasts a real-time event to all connected sockets
   */
  broadcast(event: string, payload: any) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
