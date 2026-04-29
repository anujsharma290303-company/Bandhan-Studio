import Client    from '../../models/Client';
import Quotation from '../../models/Quotation';
import { calculateTotals }       from '../../services/totals.service';
import { generateQuotNumber }    from '../../services/numbering.service';
import {
  CreateQuotationInput,
  UpdateQuotationInput,
} from '../../schemas/quotation.schema';

export const getAllQuotations = async (filters: {
  status?:    string;
  client_id?: string;
}) => {
  const where: Record<string, unknown> = {};
  if (filters.status)    where.status    = filters.status;
  if (filters.client_id) where.client_id = filters.client_id;

  return Quotation.findAll({
    where,
    include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'phone'] }],
    order:   [['created_at', 'DESC']],
  });
};

export const getQuotationById = async (id: string) => {
  return Quotation.findByPk(id, {
    include: [{ model: Client, as: 'client' }],
  });
};

export const createQuotation = async (data: CreateQuotationInput) => {
  const totals     = calculateTotals(data as any);
  const quot_number = await generateQuotNumber();

  return Quotation.create({
    client_id:      data.client_id,
    quot_number,
    status:         'DRAFT',
    subject:        data.subject        || null,
    line_items:     data.line_items,
    discount_type:  data.discount_type  || 'NONE',
    discount_value: data.discount_value || 0,
    tax_type:       data.tax_type       || 'NONE',
    tax_rate:       data.tax_rate       || 0,
    notes:          data.notes          || null,
    valid_till:     data.valid_till ? new Date(data.valid_till) : null,
    ...totals,
  });
};

export const updateQuotation = async (
  id:   string,
  data: UpdateQuotationInput
) => {
  const quotation = await Quotation.findByPk(id);
  if (!quotation)               return null;
  if (quotation.status !== 'DRAFT') {
    throw new Error('CANNOT_EDIT_FINALISED');
  }

  const merged = {
    line_items:     data.line_items     ?? quotation.line_items,
    discount_type:  data.discount_type  ?? quotation.discount_type,
    discount_value: data.discount_value ?? quotation.discount_value,
    tax_type:       data.tax_type       ?? quotation.tax_type,
    tax_rate:       data.tax_rate       ?? quotation.tax_rate,
  };

  const totals = calculateTotals(merged as any);

  return quotation.update({
    subject:    data.subject    ?? quotation.subject,
    notes:      data.notes      ?? quotation.notes,
    valid_till: data.valid_till ? new Date(data.valid_till) : quotation.valid_till,
    ...merged,
    ...totals,
  });
};

export const finaliseQuotation = async (id: string) => {
  const quotation = await Quotation.findByPk(id);
  if (!quotation) return null;
  if (quotation.status !== 'DRAFT') {
    throw new Error('ALREADY_FINALISED');
  }
  return quotation.update({ status: 'FINALISED' });
};
