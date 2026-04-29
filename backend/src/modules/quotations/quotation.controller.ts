import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as quotationService from './quotation.service';

export const listQuotations = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, client_id } = req.query as Record<string, string>;
  const quotations = await quotationService.getAllQuotations({ status, client_id });
  res.json({ success: true, data: quotations });
};

export const getQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const q = await quotationService.getQuotationById(id);
  if (!q) {
    res.status(404).json({ success: false, message: 'Quotation not found' });
    return;
  }
  res.json({ success: true, data: q });
};

export const createQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  const q = await quotationService.createQuotation(req.body);
  res.status(201).json({ success: true, data: q, message: 'Quotation created' });
};

export const updateQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const q = await quotationService.updateQuotation(id, req.body);
    if (!q) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }
    res.json({ success: true, data: q });
  } catch (err: any) {
    if (err.message === 'CANNOT_EDIT_FINALISED') {
      res.status(409).json({ success: false, message: 'Cannot edit a finalised quotation' });
      return;
    }
    throw err;
  }
};

export const finaliseQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const q = await quotationService.finaliseQuotation(id);
    if (!q) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }
    res.json({ success: true, data: q, message: 'Quotation finalised' });
  } catch (err: any) {
    if (err.message === 'ALREADY_FINALISED') {
      res.status(409).json({ success: false, message: 'Quotation already finalised' });
      return;
    }
    throw err;
  }
};
