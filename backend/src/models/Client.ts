import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClientAttributes {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  gstin: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface ClientCreationAttributes
  extends Optional<ClientAttributes, 'id' | 'email' | 'address' | 'gstin'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes {
  public id!: string;
  public name!: string;
  public phone!: string;
  public email!: string | null;
  public address!: string | null;
  public gstin!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gstin: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
    underscored: true,
  }
);

export default Client;
