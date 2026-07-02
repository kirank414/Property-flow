import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid UUID format');
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const loginValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().regex(phoneRegex, 'Phone number must be in E.164 format (e.g. +1234567890)'),
});

export const propertyValidationSchema = z.object({
  name: z.string().min(1, 'Property name is required').max(255),
  address: z.string().min(5, 'Address must be at least 5 characters long').max(500),
  ownerId: uuidSchema,
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).default('ACTIVE'),
  type: z.string().min(1, 'Property type is required'),
  units: z.number().int().positive('Units must be a positive integer'),
  occupancyRate: z.number().min(0).max(100).default(100),
  imageUrl: z.string().optional().nullable(),
  revenue: z.number().nonnegative('Revenue cannot be negative').default(0),
});

export const bookingValidationSchema = z.object({
  amenityId: uuidSchema,
  tenantId: uuidSchema,
  startTime: z.string().datetime({ message: 'Start time must be a valid ISO 8601 string' }),
  endTime: z.string().datetime({ message: 'End time must be a valid ISO 8601 string' }),
  purpose: z.string().max(500).optional().nullable(),
  guestsCount: z.number().int().nonnegative().default(0),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const maintenanceValidationSchema = z.object({
  propertyId: uuidSchema,
  tenantId: uuidSchema,
  title: z.string().min(3, 'Title must be at least 3 characters long').max(255),
  description: z.string().min(10, 'Please provide a detailed description (min 10 chars)'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY']).default('MEDIUM'),
});
