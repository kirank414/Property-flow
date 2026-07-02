import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

const uuidSchema = z.string().uuid('Invalid UUID format');

export const createBookingSchema = z.object({
  body: z.object({
    amenityId: uuidSchema,
    tenantId: uuidSchema,
    startTime: z.string().datetime({ message: 'Invalid start time' }),
    endTime: z.string().datetime({ message: 'Invalid end time' })
  }).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime']
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus)
  }),
  params: z.object({
    id: uuidSchema
  })
});

export const bookingIdParamSchema = z.object({
  params: z.object({
    id: uuidSchema
  })
});

export const checkAvailabilitySchema = z.object({
  query: z.object({
    amenityId: uuidSchema,
    startTime: z.string().datetime({ message: 'Invalid start time' }),
    endTime: z.string().datetime({ message: 'Invalid end time' })
  }).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime']
  })
});
