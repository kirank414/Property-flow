import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireRoles } from '../../middlewares/rbac';
import { validate } from '../../middlewares/validate';
import { createUserSchema, updateUserSchema } from './users.zod';

const router = Router();

// Only Admin or Property Manager can list users
router.get('/', requireAuth, requireRoles(['ADMIN', 'MANAGER']), UsersController.list);

// Authenticated users can retrieve details
router.get('/:id', requireAuth, UsersController.getById);

// Only Admin can create users
router.post('/', requireAuth, requireRoles(['ADMIN']), validate(createUserSchema), UsersController.create);

// Update route handles self-profile updates and admin updates (internal auth checks in service)
router.patch('/:id', requireAuth, validate(updateUserSchema), UsersController.update);

// Only Admin can delete users
router.delete('/:id', requireAuth, requireRoles(['ADMIN']), UsersController.delete);

export const usersRoutes = router;
export default usersRoutes;
