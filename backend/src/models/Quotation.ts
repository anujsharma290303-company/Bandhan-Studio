import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Client from './Client';

export type QuotationStatus = 'DRAFT' | 'FINALISED' | 'CONVERTED';
export type DiscountType    = 'PERCENT' | 'FLAT' | 'NONE';
export type TaxType         = 'IGST' | 'CGST_SGST' | 'NONE';

export interface LineItem {
  description: string;
  qty:         number;
  unit:        string;
  rate:        number;
  amount:      number;
}

interface QuotationAttributes {
  id:              string;
  client_id:       string;
  quot_number:     string;
  status:          QuotationStatus;
  subject:         string | null;
  line_items:      LineItem[];
  discount_type:   DiscountType;
  discount_value:  number;
  tax_type:        TaxType;
  tax_rate:        number;
  subtotal:        number;
  discount_amount: number;
  taxable_amount:  number;
  tax_amount:      number;
  grand_total:     number;
  notes:           string | null;
  valid_till:      Date | null;
  created_at?:     Date;
  updated_at?:     Date;
}

interface QuotationCreationAttributes
  extends Optional<
    QuotationAttributes,
    | 'id' | 'status' | 'subject' | 'discount_type' | 'discount_value'
    | 'tax_type' | 'tax_rate' | 'subtotal' | 'discount_amount'
    | 'taxable_amount' | 'tax_amount' | 'grand_total' | 'notes' | 'valid_till'
  > {}

class Quotation
  extends Model<QuotationAttributes, QuotationCreationAttributes>
  implements QuotationAttributes {
  public id!:              string;
  public client_id!:       string;
  public quot_number!:     string;
  public status!:          QuotationStatus;
  public subject!:         string | null;
  public line_items!:      LineItem[];
  public discount_type!:   DiscountType;
  public discount_value!:  number;
  public tax_type!:        TaxType;
  public tax_rate!:        number;
  public subtotal!:        number;
  public discount_amount!: number;
  public taxable_amount!:  number;
  public tax_amount!:      number;
  public grand_total!:     number;
  public notes!:           string | null;
  public valid_till!:      Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Quotation.init(
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    client_id: {
      type:       DataTypes.UUID,
      allowNull:  false,
      references: { model: 'clients', key: 'id' },
    },
    quot_number: {
      type:      DataTypes.STRING(30),
      allowNull: false,
      unique:    true,
    },
    status: {
      type:         DataTypes.ENUM('DRAFT', 'FINALISED', 'CONVERTED'),
      allowNull:    false,
      defaultValue: 'DRAFT',
    },
    subject: {
      type:      DataTypes.STRING(255),
      allowNull: true,
    },
    line_items: {
      type:         DataTypes.JSONB,
      allowNull:    false,
      defaultValue: [],
    },
    discount_type: {
      type:         DataTypes.ENUM('PERCENT', 'FLAT', 'NONE'),
      allowNull:    false,
      defaultValue: 'NONE',
    },
    discount_value: {
      type:         DataTypes.DECIMAL(12, 2),
      allowNull:    false,
      defaultValue: 0,
    },
    tax_type: {
      type:         DataTypes.ENUM('IGST', 'CGST_SGST', 'NONE'),
      allowNull:    false,
      defaultValue: 'NONE',
    },
    tax_rate: {
      type:         DataTypes.DECIMAL(5, 2),
      allowNull:    false,
      defaultValue: 0,
    },
    subtotal:        { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    discount_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    taxable_amount:  { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    tax_amount:      { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    grand_total:     { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    notes: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    valid_till: {
      type:      DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName:  'quotations',
    timestamps: true,
    underscored: true,
  }
);

// Associations
Quotation.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Client.hasMany(Quotation,   { foreignKey: 'client_id', as: 'quotations' });

export default Quotation;
