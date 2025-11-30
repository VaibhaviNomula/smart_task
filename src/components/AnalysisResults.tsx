import { AnalyzedTask } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnalysisResultsProps {
  tasks: AnalyzedTask[];
}

export function AnalysisResults({ tasks }: AnalysisResultsProps) {
  const highCount = tasks.filter(t => t.priority_level === 'high').length;
  const mediumCount = tasks.filter(t => t.priority_level === 'medium').length;
  const lowCount = tasks.filter(t => t.priority_level === 'low').length;

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-priority-high" />
              <span className="text-sm">{highCount} High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-priority-medium" />
              <span className="text-sm">{mediumCount} Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-priority-low" />
              <span className="text-sm">{lowCount} Low Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskCard key={task.id || index} task={task} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
