import { MaintenanceRepository } from './maintenance.repository';
import { notificationQueue } from '../../queues/notification.queue';
import { socketService } from '../../sockets/socket.service';
import { AppError } from '../../errors/AppError';
import { prisma } from '../../config/db';
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

export class MaintenanceService {
  private repo = new MaintenanceRepository();

  /**
   * Files a new maintenance request and inserts the initial PENDING trace into audit history
   */
  async createRequest(data: {
    propertyId: string;
    tenantId: string;
    title: string;
    description: string;
    priority: MaintenancePriority;
  }) {
    // Validate property exists
    const propertyExists = await prisma.property.findFirst({
      where: { id: data.propertyId, deletedAt: null },
    });
    if (!propertyExists) {
      throw new AppError('The specified property does not exist.', 400);
    }

    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.create({
        data,
      });

      // Log initialization
      await tx.maintenanceRequestHistory.create({
        data: {
          maintenanceRequestId: request.id,
          newStatus: 'PENDING',
          newPriority: data.priority,
          actionType: 'system_action',
          performedBy: data.tenantId,
          notes: 'Maintenance ticket created.',
        },
      });

      // Notify property managers about the new request
      // (For this mock, we fetch property owner and queue a notification to them)
      await notificationQueue.addNotification({
        userId: propertyExists.ownerId,
        title: 'New Maintenance Request Filed',
        message: `A new ticket has been filed for ${propertyExists.name}: "${data.title}"`,
        type: 'MAINTENANCE',
        channels: ['IN_APP', 'EMAIL'],
      });

      // Broadcast dashboard cache invalidation globally
      socketService.broadcast('dashboard.invalidate', {});

      return request;
    });
  }

  /**
   * Assigns a technician to a request, upgrades status to IN_PROGRESS, and logs history
   */
  async assignTechnician(requestId: string, technicianId: string, performerId: string) {
    const techUser = await prisma.user.findFirst({
      where: { id: technicianId, deletedAt: null },
    });
    if (!techUser) {
      throw new AppError('The assigned technician user ID does not exist.', 400);
    }

    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.findUnique({
        where: { id: requestId },
      });
      if (!request) {
        throw new AppError('Maintenance request not found.', 404);
      }

      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          assignedTechnicianId: technicianId,
          status: 'IN_PROGRESS',
        },
      });

      await tx.maintenanceRequestHistory.create({
        data: {
          maintenanceRequestId: requestId,
          oldStatus: request.status,
          newStatus: 'IN_PROGRESS',
          oldTechnicianId: request.assignedTechnicianId,
          newTechnicianId: technicianId,
          actionType: 'technician_reassigned',
          performedBy: performerId,
          notes: 'Technician assigned to request.',
        },
      });

      // Queue asynchronous notifications
      await notificationQueue.addNotification({
        userId: technicianId,
        createdBy: performerId,
        title: 'New Task Assignment',
        message: `You have been assigned to: "${request.title}"`,
        type: 'MAINTENANCE',
        channels: ['IN_APP', 'EMAIL'],
      });

      await notificationQueue.addNotification({
        userId: request.tenantId,
        createdBy: performerId,
        title: 'Technician Assigned',
        message: `A technician has been assigned to your request: "${request.title}"`,
        type: 'MAINTENANCE',
        channels: ['IN_APP'],
      });

      // Dispatch Socket.io real-time update
      socketService.toUser(request.tenantId, 'maintenance:updated', {
        id: requestId,
        status: 'IN_PROGRESS',
        assignedTechnicianId: technicianId,
      });

      // Broadcast dashboard cache invalidation globally
      socketService.broadcast('dashboard.invalidate', {});

      return updatedRequest;
    });
  }

  /**
   * Updates request status (e.g. COMPLETED) and creates a history audit trail entry
   */
  async updateStatus(requestId: string, status: MaintenanceStatus, notes: string | undefined, performerId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.findUnique({
        where: { id: requestId },
      });
      if (!request) {
        throw new AppError('Maintenance request not found.', 404);
      }

      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id: requestId },
        data: { 
          status,
          ...(status === 'COMPLETED' ? { resolvedAt: new Date() } : {})
        },
      });

      await tx.maintenanceRequestHistory.create({
        data: {
          maintenanceRequestId: requestId,
          oldStatus: request.status,
          newStatus: status,
          actionType: 'status_change',
          performedBy: performerId,
          notes: notes || 'Ticket status updated.',
        },
      });

      // Notify the tenant of the status transition
      await notificationQueue.addNotification({
        userId: request.tenantId,
        createdBy: performerId,
        title: `Maintenance Request ${status}`,
        message: `The status of your request "${request.title}" has changed to ${status}.`,
        type: 'MAINTENANCE',
        channels: ['IN_APP', 'EMAIL'],
      });

      // Dispatch Socket.io real-time update
      socketService.toUser(request.tenantId, 'maintenance:updated', {
        id: requestId,
        status,
      });

      // Broadcast dashboard cache invalidation globally
      socketService.broadcast('dashboard.invalidate', {});

      return updatedRequest;
    });
  }

  async getTimeline(requestId: string) {
    const request = await this.repo.findById(requestId);
    if (!request) {
      throw new AppError('Maintenance request not found.', 404);
    }
    return this.repo.findHistory(requestId);
  }

  async getSLAMetrics() {
    return this.repo.getSLATrackingData();
  }

  async listRequests(filters: {
    propertyId?: string;
    tenantId?: string;
    assignedTechnicianId?: string;
    status?: MaintenanceStatus;
    priority?: MaintenancePriority;
  }) {
    return this.repo.findAll(filters);
  }

  async getDetails(id: string) {
    const request = await this.repo.findById(id);
    if (!request) {
      throw new AppError('Maintenance request not found.', 404);
    }
    return request;
  }
}

export default MaintenanceService;
