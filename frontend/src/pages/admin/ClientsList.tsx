import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClients, useCreateClient, useDeleteClient } from '../../hooks/useClients';
import { Modal } from '../../components/ui/Modal';

const createSchema = z.object({
  name:    z.string().min(1, 'Name is required'),
  phone:   z.string().min(7,  'Phone is required'),
  email:   z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  gstin:   z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

export const ClientsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: clients = [], isLoading } = useClients(search || undefined);
  const createMutation  = useCreateClient();
  const deleteMutation  = useDeleteClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  });

  const onSubmit = async (data: CreateForm) => {
    await createMutation.mutateAsync(data);
    reset();
    setShowModal(false);
  };

  const onDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Clients</h1>
          <p className="text-sm text-slate-500 mt-1">
            {clients.length} total client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Client
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Phone</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">GSTIN</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No clients found
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-3.5 font-semibold text-slate-800">
                  {client.name}
                </td>
                <td className="px-5 py-3.5 text-slate-600">{client.phone}</td>
                <td className="px-5 py-3.5 text-slate-500">{client.email || '—'}</td>
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                  {client.gstin || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/admin/clients/${client.id}`)}
                      className="text-xs text-navy-600 hover:text-navy-700 font-semibold"
                    >
                      View →
                    </button>
                    <button
                      onClick={() => setDeleteId(client.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); reset(); }} title="Add New Client">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input {...register('name')} className="input-field" placeholder="Ravi Sharma" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Phone *</label>
            <input {...register('phone')} className="input-field" placeholder="9870012345" />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input-field" placeholder="ravi@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Address</label>
            <textarea {...register('address')} className="input-field resize-none h-20" placeholder="45 Vijay Nagar, Indore" />
          </div>
          <div>
            <label className="label">GSTIN</label>
            <input {...register('gstin')} className="input-field font-mono" placeholder="23ABCDE1234F1Z5" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1">
              {createMutation.isPending ? 'Creating...' : 'Create Client'}
            </button>
            <button type="button" onClick={() => { setShowModal(false); reset(); }} className="btn-secondary">
              Cancel
            </button>
          </div>
          {createMutation.isError && (
            <p className="text-xs text-red-500">Failed to create client. Try again.</p>
          )}
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Client">
        <p className="text-slate-600 mb-5">
          Are you sure you want to delete this client? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onDelete}
            disabled={deleteMutation.isPending}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};
