import { prisma } from '../config/db';

export const notificationQueue = {
  addNotification: async (data: { userId: string, title: string, message: string, category: string, priority: string }) => {
    try {
      await prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          message: data.message,
          category: data.category,
          priority: data.priority
        }
      });
    } catch (e) {
      console.error('Failed to save notification', e);
    }
  }
};
