import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { UserRole } from '../types';

/**
 * UserAttributes defines the fields for the User model.
 * Represents a user in the database.
 */
interface UserAttributes {
  id: string;             // UUID primary key
  name: string;           // User's full name
  email: string;          // User's email (unique)
  password_hash: string;  // Hashed password
  role: UserRole;         // User role (ADMIN or MEMBER)
  is_active: boolean;     // Is the user active?
  created_at?: Date;      // Timestamp for creation
  updated_at?: Date;      // Timestamp for last update
}

/**
 * Used for creating new users (id and is_active are optional).
 */
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'is_active'> {}

/**
 * Sequelize User model for the users table.
 */
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: UserRole;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize User model schema and options
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MEMBER'),
      allowNull: false,
      defaultValue: 'MEMBER',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;