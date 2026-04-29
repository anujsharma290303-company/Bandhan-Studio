import { Router } from 'express';
import { authenticate }           from '../../middleware/auth';
import { requireAdmin }           from '../../middleware/roleGuard';
import { validateBody }           from '../../middleware/validate';
import {
  createQuotationSchema,
  updateQuotationSchema,
} from '../../schemas/quotation.schema';
import {
  listQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  finaliseQuotation,
} from './quotation.controller';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/',                  listQuotations);
router.get('/:id',               getQuotation);
router.post('/',                 validateBody(createQuotationSchema), createQuotation);
router.put('/:id',               validateBody(updateQuotationSchema), updateQuotation);
router.post('/:id/finalise',     finaliseQuotation);

export default router;
