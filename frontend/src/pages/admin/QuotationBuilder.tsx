import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClients }          from '../../hooks/useClients';
import { useCreateQuotation }  from '../../hooks/useQuotations';

import { Modal } from '../../components/ui/Modal';
import { useCreateClient } from '../../hooks/useClients';
import { calculateTotals, formatCurrency } from '../../utils/totals';
import type{ DiscountType, TaxType } from '../../api/quotations';


const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  qty:         z.coerce.number().positive('Must be > 0'),
  unit:        z.string().min(1, 'Required'),
  rate:        z.coerce.number().min(0),
  amount:      z.coerce.number().min(0),
});


const schema = z.object({
  client_id:      z.string().min(1, 'Select a client'),
  subject:        z.string().optional(),
  line_items:     z.array(lineItemSchema).min(1, 'Add at least one item'),
  discount_type:  z.enum(['PERCENT', 'FLAT', 'NONE']),
  discount_value: z.coerce.number().min(0),
  tax_type:       z.enum(['IGST', 'CGST_SGST', 'NONE']),
  tax_rate:       z.coerce.number().min(0).max(100),
  notes:          z.string().optional(),
  valid_till:     z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const QuotationBuilder = () => {
  const navigate = useNavigate();
  const { data: clients = [] } = useClients();
  const createMutation = useCreateQuotation();
  const createClientMutation = useCreateClient();
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as any,
      defaultValues: {
        line_items:     [{ description: '', qty: 1, unit: 'Pcs', rate: 0, amount: 0 }],
        discount_type:  'NONE',
        discount_value: 0,
        tax_type:       'NONE',
        tax_rate:       0,
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: 'line_items' });

  // Watch all fields for live totals
  const watchedItems    = watch('line_items');
  const discountType    = watch('discount_type') as DiscountType;
  const discountValue   = watch('discount_value');
  const taxType         = watch('tax_type') as TaxType;
  const taxRate         = watch('tax_rate');

  // Auto-calculate each line item amount
  useEffect(() => {
    watchedItems.forEach((item, idx) => {
      const amount = Math.round((Number(item.qty) * Number(item.rate)) * 100) / 100;
      if (item.amount !== amount) {
        setValue(`line_items.${idx}.amount`, amount);
      }
    });
  }, [watchedItems.map(i => `${i.qty}-${i.rate}`).join(',')]);

  const totals = calculateTotals({
    line_items:     watchedItems,
    discount_type:  discountType,
    discount_value: Number(discountValue),
    tax_type:       taxType,
    tax_rate:       Number(taxRate),
  });

  const onSubmit = async (data: FormValues) => {
    await createMutation.mutateAsync(data as any);
    navigate('/admin/quotations');
  };

  const taxLabel = taxType === 'IGST' ? 'IGST' : taxType === 'CGST_SGST' ? 'CGST+SGST' : 'Tax';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">New Quotation</h1>
          <p className="text-sm text-slate-500 mt-1">Auto-numbered on save</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/quotations')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            form="quot-form"
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary"
          >
            {createMutation.isPending ? 'Saving...' : 'Save as Draft'}
          </button>
        </div>
      </div>

      <form id="quot-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-6">
          {/* Left column — main form */}
          <div className="col-span-2 space-y-5">

            {/* Client + subject */}
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-slate-700">Client Details</h2>
              <div>
                <label className="label">Client *</label>
                <div className="flex gap-2 items-center">
                  <select {...register('client_id')} className="input-field">
                    <option value="">— Select client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-secondary px-2 py-1 text-xs"
                    onClick={() => setClientModalOpen(true)}
                  >
                    + New
                  </button>
                </div>
                {errors.client_id && (
                  <p className="text-xs text-red-500 mt-1">{errors.client_id.message}</p>
                )}
              </div>
              <div>
                <label className="label">Subject</label>
                <input
                  {...register('subject')}
                  className="input-field"
                  placeholder="e.g. Wedding photography package"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valid Till</label>
                  <input {...register('valid_till')} type="date" className="input-field" />
                </div>
              </div>
            </div>

            {/* Modal for new client */}
            <Modal open={clientModalOpen} onClose={() => setClientModalOpen(false)} title="Add New Client">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await createClientMutation.mutateAsync(newClient, {
                    onSuccess: (client) => {
                      setValue('client_id', client.id);
                      setClientModalOpen(false);
                      setNewClient({ name: '', phone: '' });
                    },
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="label">Name</label>
                  <input
                    className="input-field"
                    value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input-field"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-primary flex-1" disabled={createClientMutation.isPending}>
                    {createClientMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn-secondary flex-1" onClick={() => setClientModalOpen(false)}>
                    Cancel
                  </button>
                </div>
                {createClientMutation.isError && (
                  <p className="text-xs text-red-500 mt-2">Failed to create client. Try again.</p>
                )}
              </form>
            </Modal>

            {/* Line items */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-700">Line Items</h2>
                <button
                  type="button"
                  onClick={() => append({ description: '', qty: 1, unit: 'Pcs', rate: 0, amount: 0 })}
                  className="text-xs text-navy-600 hover:text-navy-700 font-semibold border border-navy-600 px-3 py-1.5 rounded-md"
                >
                  + Add Item
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <div className="col-span-4">Description</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-2">Rate (₹)</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1" />
              </div>

              {/* Rows */}
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-slate-100 items-center"
                >
                  <div className="col-span-4">
                    <input
                      {...register(`line_items.${idx}.description`)}
                      className="input-field text-xs py-2"
                      placeholder="Description"
                    />
                    {errors.line_items?.[idx]?.description && (
                      <p className="text-xs text-red-500 mt-0.5">Required</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <input
                      {...register(`line_items.${idx}.qty`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      {...register(`line_items.${idx}.unit`)}
                      className="input-field text-xs py-2"
                      placeholder="Pcs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      {...register(`line_items.${idx}.rate`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold text-slate-700">
                    {formatCurrency(watchedItems[idx]?.amount ?? 0)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-slate-300 hover:text-red-400 text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {errors.line_items?.message && (
                <p className="px-5 py-2 text-xs text-red-500">{errors.line_items.message}</p>
              )}
            </div>

            {/* Discount + Tax */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-700 mb-4">Discount & Tax</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="label">Discount Type</label>
                  <select {...register('discount_type')} className="input-field">
                    <option value="NONE">No Discount</option>
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                {discountType !== 'NONE' && (
                  <div>
                    <label className="label">
                      {discountType === 'PERCENT' ? 'Discount %' : 'Discount Amount (₹)'}
                    </label>
                    <input
                      {...register('discount_value', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                )}
                <div>
                  <label className="label">Tax Type</label>
                  <select {...register('tax_type')} className="input-field">
                    <option value="NONE">No Tax</option>
                    <option value="IGST">IGST</option>
                    <option value="CGST_SGST">CGST + SGST</option>
                  </select>
                </div>
                {taxType !== 'NONE' && (
                  <div>
                    <label className="label">Tax Rate (%)</label>
                    <input
                      {...register('tax_rate', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="card p-5">
              <h2 className="font-semibold text-slate-700 mb-3">Terms & Notes</h2>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field resize-none"
                placeholder="50% advance required. Balance on delivery of edited photos."
              />
            </div>
          </div>

          {/* Right column — live totals */}
          <div className="col-span-1">
            <div className="card p-5 sticky top-20">
              <h2 className="font-semibold text-slate-700 mb-4">Total Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                {discountType !== 'NONE' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="text-red-500 font-medium">
                      − {formatCurrency(totals.discount_amount)}
                    </span>
                  </div>
                )}
                {taxType !== 'NONE' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taxable Amount</span>
                      <span className="font-medium">{formatCurrency(totals.taxable_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        {taxLabel} ({taxRate}%)
                        {taxType === 'CGST_SGST' && (
                          <span className="text-xs text-slate-400 ml-1">
                            ({Number(taxRate) / 2}% + {Number(taxRate) / 2}%)
                          </span>
                        )}
                      </span>
                      <span className="font-medium">{formatCurrency(totals.tax_amount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-3 mt-2">
                  <span className="font-bold text-navy-600 text-base">Grand Total</span>
                  <span className="font-bold text-navy-600 text-base">
                    {formatCurrency(totals.grand_total)}
                  </span>
                </div>
              </div>

              {createMutation.isError && (
                <p className="mt-4 text-xs text-red-500 bg-red-50 rounded-lg p-3">
                  Failed to save. Try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
