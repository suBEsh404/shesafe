import { ReactNode } from "react";

type MetricsCardProps = {
  title: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
};

export default function MetricsCard({
  title,
  value,
  detail,
  icon,
}: MetricsCardProps) {
  return (
    <div className="rounded-md border border-borderline bg-white p-5">
      <div className="mb-4 h-1 w-16 rounded-full bg-state-gold/70" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-state-slate">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
        </div>
        <div className="rounded-lg border border-state-gold/20 bg-state-gold/10 p-3 text-state-navy">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
