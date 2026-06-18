import './utils/prisma-shim';
import http from 'http';
import { app } from './app';
import { env } from './config/env';
import { connectRedis, redisClient } from './config/redis';
import { socketService } from './sockets/socket.service';
import { notificationWorker } from './queues/workers/notification.worker';
import { prisma } from './config/db';
import { logger } from './utils/logger';

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Establish Redis Connections
    await connectRedis();

    // 2. Initialize Socket.io WebSocket channels
    socketService.init(server);

    // 3. Start BullMQ background worker listener
    // By invoking worker getter, we trigger the process thread pool startup
    logger.info(`👷 BullMQ Sandboxed Notification worker active. Concurrency: ${notificationWorker.opts.concurrency}`);

    server.listen(env.PORT, () => {
      logger.info(`🚀 Zillow API Gateway listening on port ${env.PORT} in ${env.NODE_ENV} mode.`);
      logger.info(`📖 API documentation spec available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error: any) {
    logger.error('❌ Failed to boot Zillow API Gateway:', error);
    process.exit(1);
  }
};

// Graceful Shutdown Lifecycle
const handleGracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Starting shutdown sequence...`);

  // Step A: Stop accepting new connection requests
  server.close(() => {
    logger.info('HTTP Server stopped accepting new connections.');
  });

  // Step B: Terminate background task loops and wait for current tasks
  try {
    logger.info('Draining background worker threads...');
    await notificationWorker.close();
    logger.info('Notification worker shutdown completed.');
  } catch (err: any) {
    logger.error('Error draining notification worker:', err);
  }

  // Step C: Terminate storage layer client bindings
  try {
    logger.info('Closing database connection pools...');
    await prisma.$disconnect();
    logger.info('Prisma connection closed.');

    logger.info('Closing cache clusters...');
    await redisClient.quit();
    logger.info('Redis client disconnected.');
  } catch (err: any) {
    logger.error('Error closing storage gateways:', err);
  }

  logger.info('Zillow API Gateway exited cleanly.');
  process.exit(0);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();
