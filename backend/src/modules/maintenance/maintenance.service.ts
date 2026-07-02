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
      where: { id: data.propertyId }});
    if (!propertyExists) {
      throw new AppError('The specified property does not exist.', 400);
    }

    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.create({
        data});

      // Log initialization
      

      // Notify property managers about the new request
      // (For this mock, we fetch property owner and queue a notification to them)
      await notificationQueue.addNotification({
        userId: propertyExists.ownerId,
        title: 'New Maintenance Request Filed',
        message: `A new ticket has been filed for ${propertyExists.name}: "${data.title}"`,
        category: 'GENERAL',
        priority: 'NORMAL'
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
      where: { id: technicianId }});
    if (!techUser) {
      throw new AppError('The assigned technician user ID does not exist.', 400);
    }

    return prisma.$transaction(async (tx) => {
      const request = await tx.maintenanceRequest.findUnique({
        where: { id: requestId }});
      if (!request) {
        throw new AppError('Maintenance request not found.', 404);
      }

      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          assignedTechnicianId: technicianId,
          status: 'IN_PROGRESS'}});

      

      // Queue asynchronous notifications
      await notificationQueue.addNotification({
        userId: technicianId,
        
        title: 'New Task Assignment',
        message: `You have been assigned to: "${request.title}"`,
        category: 'GENERAL',
        priority: 'NORMAL'
      });

      await notificationQueue.addNotification({
        userId: request.tenantId,
        
        title: 'Technician Assigned',
        message: `A technician has been assigned to your request: "${request.title}"`,
        category: 'GENERAL',
        priority: 'NORMAL'
      });

      // Dispatch Socket.io real-time update
      socketService.toUser(request.tenantId, 'maintenance:updated', {
        id: requestId,
        status: 'IN_PROGRESS',
        assignedTechnicianId: technicianId});

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
        where: { id: requestId }});
      if (!request) {
        throw new AppError('Maintenance request not found.', 404);
      }

      const updatedRequest = await tx.maintenanceRequest.update({
        where: { id: requestId },
        data: { 
          status,
          ...(status === 'COMPLETED' ? { resolvedAt: new Date() } : {})
        }});

      

      // Notify the tenant of the status transition
      await notificationQueue.addNotification({
        userId: request.tenantId,
        
        title: `Maintenance Request ${status}`,
        message: `The status of your request "${request.title}" has changed to ${status}.`,
        category: 'GENERAL',
        priority: 'NORMAL'
      });

      // Dispatch Socket.io real-time update
      socketService.toUser(request.tenantId, 'maintenance:updated', {
        id: requestId,
        status});

      // Broadcast dashboard cache invalidation globally
      socketService.broadcast('dashboard.invalidate', {});

      return updatedRequest;
    });
  }
  async rateRequest(id: string, tenantId: string, rating: number, reviewComment?: string) {
    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5 stars.', 400);
    }

    const request = await this.repo.findById(id);
    if (!request) {
      throw new AppError('Maintenance request not found.', 404);
    }

    if (request.tenantId !== tenantId) {
      throw new AppError('You are not authorized to rate this request.', 403);
    }

    if (request.status !== 'COMPLETED') {
      throw new AppError('Only completed requests can be rated.', 400);
    }

    if (request.rating !== null) {
      throw new AppError('You have already submitted a rating for this request.', 400);
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        rating,
        reviewComment,
        ratedAt: new Date()
      }
    });

    // Notify operations dashboard in real-time
    socketService.broadcast('dashboard.invalidate', {
      type: 'rating_submitted',
      requestId: id
    });

    return updatedRequest;
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
