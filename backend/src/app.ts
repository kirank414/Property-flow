import './utils/prisma-shim';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { v4 as uuidv4 } from 'uuid';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './errors/errorHandler';
import { limitApi } from './middlewares/rateLimiter';
import { prisma } from './config/db';
import { redisClient } from './config/redis';

// Routes imports
import { authRoutes } from './modules/auth/auth.routes';
import { propertiesRoutes } from './modules/properties/properties.routes';
import { maintenanceRoutes } from './modules/maintenance/maintenance.routes';
import { bookingsRoutes } from './modules/bookings/bookings.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { usersRoutes } from './modules/users/users.routes';
import { amenitiesRoutes } from './modules/amenities/amenities.routes';
import { auditRoutes } from './modules/audit/audit.routes';

// Load Swagger document
import swaggerDocument from './swagger.json';

export const app = express();

// 1. Correlation ID Middleware
app.use((req, res, next) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
});

// 2. Security Middlewares
app.use(helmet());
app.use(cors({ 
  origin: true, // Allow all origins for the internship demo to prevent CORS blocks
  credentials: true 
}));

// 3. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Request Logging (Morgan stream directed into Winston)
const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
app.use(
  morgan(
    ':remote-addr - :method :url :status :res[content-length] - :response-time ms (Correlation: :req[x-correlation-id])',
    { stream: morganStream },
  ),
);

// 5. Global API Rate Limiter
app.use(limitApi);

// 6. Swagger API Docs Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 7. Health check endpoint (for Kubernetes liveness/readiness probes)
app.get('/health', async (_req, res, next) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    const redisHealthy = redisClient.isOpen;

    if (!redisHealthy) {
      return res.status(503).json({
        status: 'fail',
        services: { database: 'healthy', redis: 'unhealthy' },
      });
    }

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      services: { database: 'healthy', redis: 'healthy' },
    });
  } catch (error) {
    next(error);
  }
});

// 8. Mount Modules Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/properties`, propertiesRoutes);
app.use(`${env.API_PREFIX}/maintenance`, maintenanceRoutes);
app.use(`${env.API_PREFIX}/bookings`, bookingsRoutes);
app.use(`${env.API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${env.API_PREFIX}/users`, usersRoutes);
app.use(`${env.API_PREFIX}/amenities`, amenitiesRoutes);
app.use(`${env.API_PREFIX}/audit-logs`, auditRoutes);

// 9. Error Handler Middleware
app.use(errorHandler);

export default app;
