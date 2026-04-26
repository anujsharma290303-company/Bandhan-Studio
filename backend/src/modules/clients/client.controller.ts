import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as clientService from './client.service';

export const listClients = async (req: AuthRequest, res: Response): Promise<void> => {
  const search = req.query.search as string | undefined;
  const clients = await clientService.getAllClients(search);
  res.json({ success: true, data: clients });
};

export const getClient = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await clientService.getClientById(String(req.params.id));
  if (!client) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  res.json({ success: true, data: client });
};

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await clientService.createClient(req.body);
  res.status(201).json({ success: true, data: client, message: 'Client created' });
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await clientService.updateClient(String(req.params.id), req.body);
  if (!client) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  res.json({ success: true, data: client, message: 'Client updated' });
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  const deleted = await clientService.deleteClient(String(req.params.id));
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Client not found' });
    return;
  }
  res.json({ success: true, message: 'Client deleted' });
};
