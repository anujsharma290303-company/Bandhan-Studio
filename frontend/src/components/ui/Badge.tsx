type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'navy' | 'gray';

const styles: Record<BadgeVariant, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50  text-amber-700  border-amber-200',
  red:   'bg-red-50    text-red-700    border-red-200',
  blue:  'bg-blue-50   text-blue-700   border-blue-200',
  navy:  'bg-slate-100 text-navy-600   border-slate-200',
  gray:  'bg-slate-100 text-slate-600  border-slate-200',
};

export const Badge = ({
  variant = 'gray',
  label,
}: {
  variant?: BadgeVariant;
  label: string;
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
    {label}
  </span>
);
