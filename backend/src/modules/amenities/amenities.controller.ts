import { Request, Response, NextFunction } from 'express';
import { AmenitiesService } from './amenities.service';

const amenitiesService = new AmenitiesService();

export class AmenitiesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await amenitiesService.createAmenity(req.body, req.user?.id);
      res.status(201).json({
        status: 'success',
        data: { amenity }});
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await amenitiesService.updateAmenity(req.params.id, req.body, req.user?.id);
      res.status(200).json({
        status: 'success',
        data: { amenity }});
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await amenitiesService.deleteAmenity(req.params.id, req.user?.id);
      res.status(200).json({
        status: 'success',
        message: 'Success' });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const amenity = await amenitiesService.getAmenityById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { amenity }});
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, propertyId } = req.query;
      const result = await amenitiesService.listAmenities({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        propertyId: propertyId as string});

      res.status(200).json({
        status: 'success',
        data: result});
    } catch (error) {
      next(error);
    }
  }
}

export default AmenitiesController;
