import { z } from 'zod';
import { MaintenancePriority, MaintenanceStatus } from '@prisma/client';

const uuidSchema = z.string().uuid('Invalid UUID format');

export const createRequestSchema = z.object({
  body: z.object({
    propertyId: uuidSchema,
    tenantId: uuidSchema,
    title: z.string().min(3, 'Title must be at least 3 characters long').max(255),
    description: z.string().min(10, 'Please provide a detailed description (min 10 chars)'),
    priority: z.nativeEnum(MaintenancePriority).default(MaintenancePriority.MEDIUM)})});

export const assignTechnicianSchema = z.object({
  body: z.object({
    technicianId: uuidSchema}),
  params: z.object({
    id: uuidSchema})});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(MaintenanceStatus),
    notes: z.string().max(1000).optional()}),
  params: z.object({
    id: uuidSchema})});

export const requestIdParamSchema = z.object({
  params: z.object({
    id: uuidSchema})});
