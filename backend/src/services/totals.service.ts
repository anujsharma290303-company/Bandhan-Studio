import { LineItem, DiscountType, TaxType } from '../models/Quotation';

interface TotalsInput {
  line_items:     LineItem[];
  discount_type:  DiscountType;
  discount_value: number;
  tax_type:       TaxType;
  tax_rate:       number;
}

interface TotalsResult {
  subtotal:        number;
  discount_amount: number;
  taxable_amount:  number;
  tax_amount:      number;
  grand_total:     number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const calculateTotals = (input: TotalsInput): TotalsResult => {
  const subtotal = round2(
    input.line_items.reduce((sum, item) => sum + item.qty * item.rate, 0)
  );

  let discount_amount = 0;
  if (input.discount_type === 'PERCENT') {
    discount_amount = round2(subtotal * (input.discount_value / 100));
  } else if (input.discount_type === 'FLAT') {
    discount_amount = round2(input.discount_value);
  }

  const taxable_amount = round2(subtotal - discount_amount);

  const tax_amount =
    input.tax_type === 'NONE'
      ? 0
      : round2(taxable_amount * (input.tax_rate / 100));

  const grand_total = round2(taxable_amount + tax_amount);

  return {
    subtotal,
    discount_amount,
    taxable_amount,
    tax_amount,
    grand_total,
  };
};
