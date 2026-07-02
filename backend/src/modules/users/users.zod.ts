import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().regex(phoneRegex, 'Phone number must be in E.164 format (e.g. +1234567890)'),
    role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']),
    propertyId: z.string().uuid('Invalid property ID').optional().nullable()})});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phone: z.string().regex(phoneRegex).optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'TENANT']).optional(),
    propertyId: z.string().uuid('Invalid property ID').optional().nullable(),
    avatarUrl: z.string().url().optional().nullable()})});
