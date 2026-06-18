import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis';
import { logger } from '../../utils/logger';
import path from 'path';

// Resolve sandboxed processor path dynamically
const isTypeScript = __filename.endsWith('.ts');
const processorPath = path.resolve(
  __dirname,
  isTypeScript ? 'sandbox.ts' : 'sandbox.js',
);

export const notificationWorker = new Worker(
  'notification-queue',
  processorPath,
  {
    connection: redisConnection,
    concurrency: 8, // Throttling concurrency to prevent CPU overloading
    limiter: {
      max: 100, // Max 100 jobs
      duration: 1000, // Per 1 second
    },
  },
);

notificationWorker.on('completed', (job) => {
  logger.info(`✅ Notification Job ${job.id} has completed successfully.`);
});

notificationWorker.on('failed', (job, err) => {
  logger.error({
    message: `❌ Notification Job ${job?.id} failed`,
    error: err.message,
  });
});

notificationWorker.on('error', (err) => {
  logger.error('❌ Notification Worker Redis connection error:', err);
});

export default notificationWorker;
