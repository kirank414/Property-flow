import { SandboxedJob } from 'bullmq';
import { PrismaClient, DeliveryStatus, DeliveryChannel } from '@prisma/client';
import { emailService } from '../../utils/email';
import { socketService } from '../../sockets/socket.service';
import { NotificationPayload } from '../notification.queue';

// Instantiate an isolated PrismaClient within the sandbox thread
const prisma = new PrismaClient();

export default async function (job: SandboxedJob<NotificationPayload>) {
  const { userId, createdBy, title, message, type, channels } = job.data;

  // Retrieve user contact info
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new Error(`Worker Error: Target user ID ${userId} does not exist.`);
  }

  for (const channel of channels) {
    // 1. Create a database record for this notification delivery stream
    const record = await prisma.notification.create({
      data: {
        userId,
        createdBy,
        title,
        message,
        type,
        channel,
        status: DeliveryStatus.PENDING,
      },
    });

    try {
      if (channel === DeliveryChannel.IN_APP) {
        // Dispatch real-time socket
        socketService.toUser(userId, 'notification:new', {
          id: record.id,
          title,
          message,
          type,
          createdAt: record.createdAt,
        });

        await prisma.notification.update({
          where: { id: record.id },
          data: { status: DeliveryStatus.SENT },
        });
      } else if (channel === DeliveryChannel.EMAIL) {
        // Send email
        await emailService.sendEmail(user.email, title, message);

        await prisma.notification.update({
          where: { id: record.id },
          data: { status: DeliveryStatus.SENT },
        });
      } else {
        // Fallback for future channels (PUSH, SMS)
        await prisma.notification.update({
          where: { id: record.id },
          data: { status: DeliveryStatus.SENT },
        });
      }
    } catch (error: any) {
      await prisma.notification.update({
        where: { id: record.id },
        data: {
          status: DeliveryStatus.FAILED,
          deliveryAttempts: { increment: 1 },
          lastDeliveryAttemptAt: new Date(),
        },
      });

      // Re-throw so BullMQ flags the job as failed and schedule a retry
      throw new Error(`Notification delivery failed on channel ${channel}: ${error.message}`);
    }
  }
}
