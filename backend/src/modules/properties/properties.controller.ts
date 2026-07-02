import { Request, Response, NextFunction } from 'express';
import { PropertiesService } from './properties.service';
import { PropertyStatus } from '@prisma/client';

const propertiesService = new PropertiesService();

function sanitizePayload(payload: any) {
  if (!payload) return payload;
  const sanitized = { ...payload };
  if (typeof sanitized.imageUrl === 'string' && sanitized.imageUrl.startsWith('data:')) {
    sanitized.imageUrl = sanitized.imageUrl.substring(0, 50) + '... [Base64 Data Truncated]';
  }
  if (typeof sanitized.image === 'string' && sanitized.image.startsWith('data:')) {
    sanitized.image = sanitized.image.substring(0, 50) + '... [Base64 Data Truncated]';
  }
  return sanitized;
}

export class PropertiesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('[PropertiesController.create] Exact request payload received:', JSON.stringify(sanitizePayload(req.body), null, 2));
      const property = await propertiesService.createProperty(req.body, req.user?.id);
      res.status(201).json({
        status: 'success',
        data: { property }});
    } catch (error: any) {
      console.error('[PropertiesController.create] Exception in properties creation controller:', error.stack || error);
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`[PropertiesController.update] Exact request payload received for ID ${req.params.id}:`, JSON.stringify(sanitizePayload(req.body), null, 2));
      const property = await propertiesService.updateProperty(req.params.id, req.body, req.user?.id);
      res.status(200).json({
        status: 'success',
        data: { property }});
    } catch (error: any) {
      console.error(`[PropertiesController.update] Exception in properties update controller for ID ${req.params.id}:`, error.stack || error);
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await propertiesService.deleteProperty(req.params.id, req.user?.id);
      res.status(200).json({
        status: 'success',
        message: 'Success' });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.getPropertyDetails(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { property }});
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, status } = req.query;
      const result = await propertiesService.listProperties({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        status: status as PropertyStatus});

      res.status(200).json({
        status: 'success',
        data: result});
    } catch (error) {
      next(error);
    }
  }
}

export default PropertiesController;
