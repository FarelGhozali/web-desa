import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminPageHeaderStat {
  label: string;
  value: string | number;
  helper?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: AdminPageHeaderStat[];
  className?: string;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
  stats,
  className,
}: AdminPageHeaderProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-stone-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8',
        className,
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Panel Admin
          </p>
          <h1 className="text-2xl font-semibold text-stone-900 md:text-3xl">{title}</h1>
          {description && (
            <p className="max-w-2xl text-sm text-stone-600 md:text-base">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-shrink-0 items-center gap-3">{actions}</div>}
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4"
            >
              <p className="text-xs font-medium text-stone-500">{stat.label}</p>
              <p className="mt-2 text-xl font-semibold text-stone-900">
                {stat.value}
              </p>
              {stat.helper && (
                <p className="mt-1 text-xs text-stone-500">{stat.helper}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
