import { AnalyzedTask } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: AnalyzedTask;
  rank?: number;
}

export function TaskCard({ task, rank }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-priority-high/10 border-priority-high/30 hover:border-priority-high/50',
    medium: 'bg-priority-medium/10 border-priority-medium/30 hover:border-priority-medium/50',
    low: 'bg-priority-low/10 border-priority-low/30 hover:border-priority-low/50',
  };

  const priorityBadgeColors = {
    high: 'bg-priority-high text-white',
    medium: 'bg-priority-medium text-white',
    low: 'bg-priority-low text-white',
  };

  const isOverdue = new Date(task.due_date) < new Date();

  return (
    <Card className={cn(
      'transition-all duration-200 border-2',
      priorityColors[task.priority_level]
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {rank}
                </span>
              )}
              <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
              <span className={cn(
                'flex items-center gap-1',
                isOverdue && 'text-destructive font-medium'
              )}>
                <Calendar className="h-3.5 w-3.5" />
                {task.due_date}
                {isOverdue && ' (Overdue)'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {task.estimated_hours}h
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {task.importance}/10
              </span>
              {task.dependencies.length > 0 && (
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  {task.dependencies.length} dep{task.dependencies.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground italic">
              {task.explanation}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge className={cn('font-bold', priorityBadgeColors[task.priority_level])}>
              {task.priority_level.toUpperCase()}
            </Badge>
            <div className="text-2xl font-bold text-foreground">
              {task.priority_score.toFixed(1)}
            </div>
            <span className="text-xs text-muted-foreground">priority score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
