import { SortingStrategy } from '@/types/task';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Zap, Target, Clock, Brain } from 'lucide-react';

interface StrategySelectorProps {
  value: SortingStrategy;
  onChange: (strategy: SortingStrategy) => void;
}

const strategies: { value: SortingStrategy; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'smart_balance',
    label: 'Smart Balance',
    description: 'AI-balanced approach considering all factors',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    value: 'fastest_wins',
    label: 'Fastest Wins',
    description: 'Prioritize quick, low-effort tasks',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    value: 'high_impact',
    label: 'High Impact',
    description: 'Focus on most important tasks first',
    icon: <Target className="h-4 w-4" />,
  },
  {
    value: 'deadline_driven',
    label: 'Deadline Driven',
    description: 'Sort by urgency and due dates',
    icon: <Clock className="h-4 w-4" />,
  },
];

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Sorting Strategy</Label>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {strategies.map((strategy) => (
          <button
            key={strategy.value}
            type="button"
            onClick={() => onChange(strategy.value)}
            className={cn(
              'flex flex-col items-start p-3 rounded-lg border-2 transition-all text-left',
              value === strategy.value
                ? 'border-primary bg-primary/5'
                : 'border-border/50 bg-card/50 hover:border-border'
            )}
          >
            <div className={cn(
              'flex items-center gap-2 font-medium mb-1',
              value === strategy.value ? 'text-primary' : 'text-foreground'
            )}>
              {strategy.icon}
              {strategy.label}
            </div>
            <span className="text-xs text-muted-foreground">
              {strategy.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
