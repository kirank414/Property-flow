import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';

const usersService = new UsersService();

export class UsersController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.createUser(
        {
          email: req.body.email,
          passwordHash: req.body.password, // Plain text password passed as password
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          role: req.body.role,
          propertyId: req.body.propertyId,
        },
        req.user?.id
      );

      res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.updateUser(req.params.id, req.body, req.user?.id);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await usersService.deleteUser(req.params.id, req.user?.id);
      res.status(200).json({
        status: 'success',
        message: 'User soft-deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, role } = req.query;
      const result = await usersService.listUsers({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        role: role as any,
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

export default UsersController;
