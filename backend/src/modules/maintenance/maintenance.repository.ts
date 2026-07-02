import { prisma } from '../../config/db';
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

export class MaintenanceRepository {
  async create(data: {
    propertyId: string;
    tenantId: string;
    title: string;
    description: string;
    priority: MaintenancePriority;
  }) {
    return prisma.maintenanceRequest.create({
      data});
  }

  async update(
    id: string,
    data: Partial<{
      status: MaintenanceStatus;
      priority: MaintenancePriority;
      assignedTechnicianId: string | null;
    }>,
  ) {
    return prisma.maintenanceRequest.update({
      where: { id },
      data: data as any});
  }

  async findById(id: string) {
    return prisma.maintenanceRequest.findFirst({
      where: {
        id},
      include: {
        property: true,
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true}},
        technician: {
          select: { id: true, firstName: true, lastName: true, email: true}}}});
  }

  async findAll(options: {
    skip?: number;
    take?: number;
    propertyId?: string;
    tenantId?: string;
    assignedTechnicianId?: string;
    status?: MaintenanceStatus;
    priority?: MaintenancePriority;
  }) {
    const where: any = { };

    if (options.propertyId) where.propertyId = options.propertyId;
    if (options.tenantId) where.tenantId = options.tenantId;
    if (options.assignedTechnicianId) where.assignedTechnicianId = options.assignedTechnicianId;
    if (options.status) where.status = options.status;
    if (options.priority) where.priority = options.priority;

    return prisma.maintenanceRequest.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, name: true } },
        tenant: { select: { id: true, firstName: true, lastName: true } },
        technician: { select: { id: true, firstName: true, lastName: true } }}});
  }

  async findHistory(maintenanceRequestId: string) {
    return [];
  }

  /**
   * Generates basic SLA metrics: average resolution duration per priority level
   */
  async getSLATrackingData() {
    // Standard query calculating durations between creation and resolution in history
    const resolvedRequests = await prisma.maintenanceRequest.findMany({
      where: {
        status: MaintenanceStatus.COMPLETED},
      select: {
        id: true,
        priority: true,
        createdAt: true,
        resolvedAt: true}});

    const metricsByPriority = {
      LOW: { count: 0, totalHours: 0 },
      MEDIUM: { count: 0, totalHours: 0 },
      HIGH: { count: 0, totalHours: 0 },
      EMERGENCY: { count: 0, totalHours: 0 }};

    resolvedRequests.forEach((req) => {
      if (!req.resolvedAt) return;
      const durationMs = req.resolvedAt.getTime() - req.createdAt.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      const priority = req.priority as MaintenancePriority;
      if (metricsByPriority[priority]) {
        metricsByPriority[priority].count += 1;
        metricsByPriority[priority].totalHours += durationHours;
      }
    });

    return Object.keys(metricsByPriority).map((key) => {
      const entry = metricsByPriority[key as MaintenancePriority];
      return {
        priority: key,
        resolvedCount: entry.count,
        avgResolutionHours: entry.count > 0 ? parseFloat((entry.totalHours / entry.count).toFixed(2)) : 0};
    });
  }
}

export default MaintenanceRepository;
