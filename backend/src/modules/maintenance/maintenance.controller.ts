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
        data: { request }});
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
        data: { request }});
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
        data: { request }});
    } catch (error) {
      next(error);
    }
  }

  static async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const performer = req.user!;
      const requestDetails = await maintenanceService.getDetails(req.params.id);
      
      if (performer.role === 'TENANT' && requestDetails.tenantId !== performer.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to view this request history.' });
      }

      const timeline = await maintenanceService.getTimeline(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { timeline }});
    } catch (error) {
      next(error);
    }
  }

  static async rateRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.id;
      const { rating, reviewComment } = req.body;
      const request = await maintenanceService.rateRequest(req.params.id, tenantId, rating, reviewComment);

      res.status(200).json({
        status: 'success',
        data: { request }});
    } catch (error) {
      next(error);
    }
  }


  static async getSLA(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await maintenanceService.getSLAMetrics();
      res.status(200).json({
        status: 'success',
        data: { metrics }});
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const performer = req.user!;
      const { propertyId, tenantId, assignedTechnicianId, status, priority } = req.query;

      let targetTenantId = tenantId as string;
      if (performer.role === 'TENANT') {
        targetTenantId = performer.id;
      }

      const requests = await maintenanceService.listRequests({
        propertyId: propertyId as string,
        tenantId: targetTenantId,
        assignedTechnicianId: assignedTechnicianId as string,
        status: status as MaintenanceStatus,
        priority: priority as MaintenancePriority});

      res.status(200).json({
        status: 'success',
        data: { requests }});
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const performer = req.user!;
      const request = await maintenanceService.getDetails(req.params.id);

      if (performer.role === 'TENANT' && request.tenantId !== performer.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to view this request.' });
      }

      res.status(200).json({
        status: 'success',
        data: { request }});
    } catch (error) {
      next(error);
    }
  }
}

export default MaintenanceController;
