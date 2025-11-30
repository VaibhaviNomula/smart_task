import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (id: string) => void;
  onClearAll: () => void;
}

export function TaskList({ tasks, onRemoveTask, onClearAll }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <ListTodo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No tasks added yet</p>
          <p className="text-sm text-muted-foreground/70">
            Add tasks using the form or import JSON
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Tasks to Analyze ({tasks.length})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearAll} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{task.title}</span>
                  <Badge variant="outline" className="shrink-0">
                    {task.importance}/10
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {task.due_date} · {task.estimated_hours}h
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => task.id && onRemoveTask(task.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
