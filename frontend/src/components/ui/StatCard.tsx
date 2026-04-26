type Variant = 'navy' | 'blue' | 'green' | 'amber' | 'red';

const valueStyles: Record<Variant, string> = {
  navy:  'text-navy-600',
  blue:  'text-blue-600',
  green: 'text-emerald-600',
  amber: 'text-amber-600',
  red:   'text-red-600',
};

export const StatCard = ({
  label,
  value,
  sub,
  variant = 'navy',
  icon,
}: {
  label:    string;
  value:    string | number;
  sub?:     string;
  variant?: Variant;
  icon?:    string;
}) => (
  <div className="card p-5">
    {icon && (
      <div className="text-2xl mb-3">{icon}</div>
    )}
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className={`text-2xl font-bold ${valueStyles[variant]}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);
