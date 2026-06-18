import { z } from 'zod';

export const createAmenitySchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID'),
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional().nullable(),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    location: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    rules: z.array(z.string()).default([]),
    operatingHours: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).default('ACTIVE'),
  }),
});

export const updateAmenitySchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID').optional(),
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional().nullable(),
    capacity: z.number().int().min(1).optional(),
    location: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    rules: z.array(z.string()).optional(),
    operatingHours: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
  }),
});
