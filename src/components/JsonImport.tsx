import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileJson, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonImportProps {
  onImport: (tasks: Task[]) => void;
}

const SAMPLE_JSON = `[
  {
    "id": "task-1",
    "title": "Fix login bug",
    "due_date": "2025-12-01",
    "estimated_hours": 3,
    "importance": 8,
    "dependencies": []
  },
  {
    "id": "task-2",
    "title": "Write documentation",
    "due_date": "2025-12-05",
    "estimated_hours": 5,
    "importance": 6,
    "dependencies": ["task-1"]
  }
]`;

export function JsonImport({ onImport }: JsonImportProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateTask = (task: unknown, index: number): task is Task => {
    if (typeof task !== 'object' || task === null) {
      throw new Error(`Task at index ${index} is not an object`);
    }

    const t = task as Record<string, unknown>;

    if (typeof t.title !== 'string' || !t.title.trim()) {
      throw new Error(`Task at index ${index}: title is required`);
    }

    if (typeof t.due_date !== 'string' || !t.due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error(`Task at index ${index}: due_date must be in YYYY-MM-DD format`);
    }

    if (typeof t.estimated_hours !== 'number' || t.estimated_hours <= 0) {
      throw new Error(`Task at index ${index}: estimated_hours must be a positive number`);
    }

    if (typeof t.importance !== 'number' || t.importance < 1 || t.importance > 10) {
      throw new Error(`Task at index ${index}: importance must be between 1 and 10`);
    }

    if (!Array.isArray(t.dependencies)) {
      throw new Error(`Task at index ${index}: dependencies must be an array`);
    }

    return true;
  };

  const handleImport = () => {
    setError('');

    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of tasks');
      }

      if (parsed.length === 0) {
        throw new Error('Array must contain at least one task');
      }

      const validatedTasks: Task[] = parsed.map((task, index) => {
        validateTask(task, index);
        return {
          id: task.id || `task-${Date.now()}-${index}`,
          title: task.title.trim(),
          due_date: task.due_date,
          estimated_hours: task.estimated_hours,
          importance: task.importance,
          dependencies: task.dependencies || [],
        };
      });

      onImport(validatedTasks);
      setJsonInput('');
      toast({
        title: 'Tasks imported',
        description: `Successfully imported ${validatedTasks.length} task(s)`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(message);
    }
  };

  const loadSample = () => {
    setJsonInput(SAMPLE_JSON);
    setError('');
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          Bulk JSON Import
        </CardTitle>
        <CardDescription>
          Paste a JSON array of tasks to import multiple tasks at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            setError('');
          }}
          placeholder='[{"title": "Task name", "due_date": "2025-12-01", ...}]'
          className="min-h-[150px] font-mono text-sm"
        />

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleImport} className="flex-1">
            Import Tasks
          </Button>
          <Button variant="outline" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
