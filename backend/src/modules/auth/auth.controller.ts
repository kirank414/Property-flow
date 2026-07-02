import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

const COOKIE_NAME = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 3600 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tokens } = await authService.register(req.body);
      
      // Set secure HTTP-only cookie for refresh token
      res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            propertyId: user.propertyId},
          accessToken: tokens.accessToken}});
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await authService.login(email, password);

      res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            propertyId: user.propertyId},
          accessToken: tokens.accessToken}});
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Pull refresh token from cookies first, fallback to request body
      const refreshToken = req.cookies?.[COOKIE_NAME] || req.body.refreshToken;

      const tokens = await authService.refresh(refreshToken);

      res.cookie(COOKIE_NAME, tokens.refreshToken, COOKIE_OPTIONS);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: tokens.accessToken}});
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.[COOKIE_NAME] || req.body.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'});

      res.status(200).json({
        status: 'success',
        message: 'Success' });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json({
        status: 'success',
        message: 'Success'
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.status(200).json({
        status: 'success',
        message: 'Success' });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ status: 'fail', message: 'Success' });
        return;
      }
      const user = await authService.getCurrentUser(userId);
      res.status(200).json({
        status: 'success',
        data: {
          user}});
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
