import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { StatCard } from './StatCard';
import type { StatItem } from '@/types';

interface StatGridProps {
  stats: StatItem[];
  className?: string;
}

/** Two-column responsive stat grid without overflow. */
export function StatGrid({ stats, className }: StatGridProps) {
  return (
    <View className={cn('-mx-1.5 flex-row flex-wrap', className)}>
      {stats.map((stat) => (
        <View key={stat.id} className="mb-3 w-1/2 px-1.5">
          <StatCard stat={stat} />
        </View>
      ))}
    </View>
  );
}
