import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  isLoading?: boolean;
}

export function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-accent/10',
  iconColor = 'text-accent',
  isLoading = false,
}: KpiCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="pt-6 pb-5 px-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn('p-2.5 rounded-xl', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>

        {isLoading ? (
          <>
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
