import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotations, useFinaliseQuotation } from '../../hooks/useQuotations';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/totals';
import  type { QuotationStatus } from '../../api/quotations';
import { Modal } from '../../components/ui/Modal';

const statusVariant: Record<QuotationStatus, 'gray' | 'blue' | 'green'> = {
  DRAFT:     'gray',
  FINALISED: 'blue',
  CONVERTED: 'green',
};

export const QuotationsList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [finaliseId, setFinaliseId] = useState<string | null>(null);

  const { data: quotations = [], isLoading } = useQuotations(
    statusFilter ? { status: statusFilter } : undefined
  );
  const finaliseMutation = useFinaliseQuotation();

  const onFinalise = async () => {
    if (!finaliseId) return;
    await finaliseMutation.mutateAsync(finaliseId);
    setFinaliseId(null);
  };

  const filters = [
    { label: 'All',       value: '' },
    { label: 'Draft',     value: 'DRAFT' },
    { label: 'Finalised', value: 'FINALISED' },
    { label: 'Converted', value: 'CONVERTED' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Quotations</h1>
          <p className="text-sm text-slate-500 mt-1">{quotations.length} quotation{quotations.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/admin/quotations/new')} className="btn-primary">
          + New Quotation
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-5">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
              statusFilter === f.value
                ? 'bg-navy-600 text-white border-navy-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Quot. No.</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Client</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Subject</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Grand Total</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500 uppercase text-xs tracking-wide">Created</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">Loading...</td></tr>
            )}
            {!isLoading && quotations.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">No quotations found</td></tr>
            )}
            {quotations.map((q) => (
              <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-navy-600">{q.quot_number}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{q.client?.name ?? '—'}</td>
                <td className="px-5 py-3.5 text-slate-500">{q.subject ?? '—'}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{formatCurrency(q.grand_total)}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant[q.status]} label={q.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">
                  {new Date(q.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/admin/quotations/${q.id}`)}
                      className="text-xs text-navy-600 hover:text-navy-700 font-semibold"
                    >
                      View →
                    </button>
                    {q.status === 'DRAFT' && (
                      <button
                        onClick={() => setFinaliseId(q.id)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Finalise
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Finalise confirm */}
      <Modal open={!!finaliseId} onClose={() => setFinaliseId(null)} title="Finalise Quotation">
        <p className="text-slate-600 mb-5">
          Once finalised this quotation cannot be edited. You can then convert it to a bill.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onFinalise}
            disabled={finaliseMutation.isPending}
            className="btn-primary flex-1"
          >
            {finaliseMutation.isPending ? 'Finalising...' : 'Yes, Finalise'}
          </button>
          <button onClick={() => setFinaliseId(null)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};
