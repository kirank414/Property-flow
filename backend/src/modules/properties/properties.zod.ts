import { z } from 'zod';
import { PropertyStatus } from '@prisma/client';

const uuidSchema = z.string().uuid('Invalid UUID format');

export const createPropertySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Property name is required').max(255),
    address: z.string().min(5, 'Address must be at least 5 characters long').max(500),
    ownerId: uuidSchema,
    status: z.nativeEnum(PropertyStatus).default(PropertyStatus.ACTIVE),
    type: z.string().optional(),
    units: z.number().optional(),
    image: z.string().optional(),
    imageUrl: z.string().optional()})});

export const updatePropertySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    address: z.string().min(5).max(500).optional(),
    ownerId: uuidSchema.optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    type: z.string().optional(),
    units: z.number().optional(),
    image: z.string().optional(),
    imageUrl: z.string().optional()}),
  params: z.object({
    id: uuidSchema})});

export const propertyIdParamSchema = z.object({
  params: z.object({
    id: uuidSchema})});
