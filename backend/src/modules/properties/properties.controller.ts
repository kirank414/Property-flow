import { Request, Response, NextFunction } from 'express';
import { PropertiesService } from './properties.service';
import { PropertyStatus } from '@prisma/client';

const propertiesService = new PropertiesService();

export class PropertiesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.createProperty(req.body, req.user?.id);
      res.status(201).json({
        status: 'success',
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.updateProperty(req.params.id, req.body, req.user?.id);
      res.status(200).json({
        status: 'success',
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await propertiesService.deleteProperty(req.params.id, req.user?.id);
      res.status(200).json({
        status: 'success',
        message: 'Property and its associated amenities/requests soft-deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.getPropertyDetails(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { property },
      });
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
        status: status as PropertyStatus,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PropertiesController;
