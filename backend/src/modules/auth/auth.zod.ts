import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().regex(phoneRegex, 'Phone number must be in E.164 format (e.g. +1234567890)')})});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')})});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address')})});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long')})});
