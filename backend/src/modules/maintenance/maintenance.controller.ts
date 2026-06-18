import { Request, Response, NextFunction } from 'express';
import { MaintenanceService } from './maintenance.service';
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await maintenanceService.createRequest(req.body);
      res.status(201).json({
        status: 'success',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const performerId = req.user!.id;
      const request = await maintenanceService.assignTechnician(
        req.params.id,
        req.body.technicianId,
        performerId,
      );

      res.status(200).json({
        status: 'success',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const performerId = req.user!.id;
      const { status, notes } = req.body;
      const request = await maintenanceService.updateStatus(req.params.id, status, notes, performerId);

      res.status(200).json({
        status: 'success',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await maintenanceService.getTimeline(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { timeline },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSLA(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await maintenanceService.getSLAMetrics();
      res.status(200).json({
        status: 'success',
        data: { metrics },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, tenantId, assignedTechnicianId, status, priority } = req.query;
      const requests = await maintenanceService.listRequests({
        propertyId: propertyId as string,
        tenantId: tenantId as string,
        assignedTechnicianId: assignedTechnicianId as string,
        status: status as MaintenanceStatus,
        priority: priority as MaintenancePriority,
      });

      res.status(200).json({
        status: 'success',
        data: { requests },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await maintenanceService.getDetails(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default MaintenanceController;
