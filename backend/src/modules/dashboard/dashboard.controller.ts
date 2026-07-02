import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  static async getKPIs(req: Request, res: Response, next: NextFunction) {
    try {
      const kpis = await dashboardService.getKPIs();
      res.status(200).json({
        status: 'success',
        data: kpis});
    } catch (error) {
      next(error);
    }
  }
}

export default DashboardController;
