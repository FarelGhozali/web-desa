import { ReactNode } from 'react';
import { Card } from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-stone-500">vs bulan lalu</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
