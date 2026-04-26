import { Op } from 'sequelize';
import Client from '../../models/Client';
import { CreateClientInput, UpdateClientInput } from '../../schemas/client.schema';

export const getAllClients = async (search?: string) => {
  const where = search
    ? {
        [Op.or]: [
          { name:    { [Op.iLike]: `%${search}%` } },
          { phone:   { [Op.iLike]: `%${search}%` } },
          { email:   { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  return Client.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
};

export const getClientById = async (id: string) => {
  return Client.findByPk(id);
};

export const createClient = async (data: CreateClientInput) => {
  return Client.create({
    name:    data.name,
    phone:   data.phone,
    email:   data.email   || null,
    address: data.address || null,
    gstin:   data.gstin   || null,
  });
};

export const updateClient = async (id: string, data: UpdateClientInput) => {
  const client = await Client.findByPk(id);
  if (!client) return null;
  return client.update(data);
};

export const deleteClient = async (id: string) => {
  const client = await Client.findByPk(id);
  if (!client) return false;
  await client.destroy();
  return true;
};
