import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  phone: z.string().min(7, 'Phone is required').max(20),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  gstin: z.string().max(20).optional(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
