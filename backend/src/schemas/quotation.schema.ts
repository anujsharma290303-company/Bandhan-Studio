import { z } from 'zod';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  qty:         z.number().positive('Qty must be positive'),
  unit:        z.string().min(1, 'Unit required'),
  rate:        z.number().min(0, 'Rate must be 0 or more'),
  amount:      z.number().min(0),
});

export const createQuotationSchema = z.object({
  client_id:      z.string().uuid('Invalid client ID'),
  subject:        z.string().max(255).optional(),
  line_items:     z.array(lineItemSchema).min(1, 'Add at least one item'),
  discount_type:  z.enum(['PERCENT', 'FLAT', 'NONE']).default('NONE'),
  discount_value: z.number().min(0).default(0),
  tax_type:       z.enum(['IGST', 'CGST_SGST', 'NONE']).default('NONE'),
  tax_rate:       z.number().min(0).max(100).default(0),
  notes:          z.string().optional(),
  valid_till:     z.string().optional(),
});

export const updateQuotationSchema = createQuotationSchema.partial();

export type CreateQuotationInput = z.infer<typeof createQuotationSchema>;
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>;
