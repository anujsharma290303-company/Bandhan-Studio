import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/roleGuard';
import { validateBody } from '../../middleware/validate';
import { createClientSchema, updateClientSchema } from '../../schemas/client.schema';
import {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from './client.controller';

console.log('Client routes loaded');
const router = Router();

// All client routes require admin
// router.use(authenticate, requireAdmin);

router.get('/',           listClients);
router.get('/:id',        getClient);
router.post('/',          validateBody(createClientSchema), createClient);
router.put('/:id',        validateBody(updateClientSchema), updateClient);
router.delete('/:id',     deleteClient);

export default router;
