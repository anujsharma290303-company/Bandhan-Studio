import { Op } from 'sequelize';
import Quotation from '../models/Quotation';

const pad3 = (n: number) => String(n).padStart(3, '0');

export const generateQuotNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `BAN-QT-${year}-`;

  const last = await Quotation.findOne({
    where: { quot_number: { [Op.like]: `${prefix}%` } },
    order: [['quot_number', 'DESC']],
  });

  let next = 1;
  if (last) {
    const parts = last.quot_number.split('-');
    next = parseInt(parts[parts.length - 1], 10) + 1;
  }

  return `${prefix}${pad3(next)}`;
};
