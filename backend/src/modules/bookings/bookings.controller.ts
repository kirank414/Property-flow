import { Request, Response, NextFunction } from 'express';
import { BookingsService } from './bookings.service';
import { BookingStatus } from '@prisma/client';

const bookingsService = new BookingsService();

export class BookingsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await bookingsService.createBooking(req.body);
      res.status(201).json({
        status: 'success',
        data: { booking }});
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const performerId = req.user!.id;
      const { status } = req.body;
      const booking = await bookingsService.updateStatus(req.params.id, status, performerId);

      res.status(200).json({
        status: 'success',
        data: { booking }});
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.user!.id;
      const booking = await bookingsService.cancelBooking(req.params.id, tenantId);

      res.status(200).json({
        status: 'success',
        data: { booking }});
    } catch (error) {
      next(error);
    }
  }

  static async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { amenityId, startTime, endTime } = req.query;
      const result = await bookingsService.checkAvailability(
        amenityId as string,
        startTime as string,
        endTime as string,
      );

      res.status(200).json({
        status: 'success',
        data: result});
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const performer = req.user!;
      const { tenantId, amenityId, status } = req.query;
      
      let targetTenantId = tenantId as string;
      if (performer.role === 'TENANT') {
        targetTenantId = performer.id;
      }

      const bookings = await bookingsService.listBookings({
        tenantId: targetTenantId,
        amenityId: amenityId as string,
        status: status as BookingStatus});

      res.status(200).json({
        status: 'success',
        data: { bookings }});
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const booking = await bookingsService.checkInBooking(req.params.id, userId);

      res.status(200).json({
        status: 'success',
        data: { booking }});
    } catch (error) {
      next(error);
    }
  }

  static async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const booking = await bookingsService.checkOutBooking(req.params.id, userId);

      res.status(200).json({
        status: 'success',
        data: { booking }});
    } catch (error) {
      next(error);
    }
  }
}

export default BookingsController;
