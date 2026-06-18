import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { DeliveryChannel, NotificationType } from '@prisma/client';
import { logger } from '../utils/logger';

export interface NotificationPayload {
  userId: string;
  createdBy?: string;
  title: string;
  message: string;
  type: NotificationType;
  channels: DeliveryChannel[];
}

export class NotificationQueue {
  private queue: Queue<NotificationPayload>;

  constructor() {
    this.queue = new Queue<NotificationPayload>('notification-queue', {
      connection: redisConnection,
    });

    // Handle Redis connection errors gracefully without crashing the server process
    this.queue.on('error', (err) => {
      logger.error('❌ Notification Queue Redis connection error:', err);
    });
  }

  /**
   * Enqueues a notification delivery task
   */
  async addNotification(payload: NotificationPayload) {
    await this.queue.add('send-notification', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}

export const notificationQueue = new NotificationQueue();
export default notificationQueue;
