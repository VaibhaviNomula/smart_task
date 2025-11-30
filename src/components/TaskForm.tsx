import { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  existingTaskIds: string[];
}

export function TaskForm({ onAddTask, existingTaskIds }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [importance, setImportance] = useState([5]);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [newDependency, setNewDependency] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate || !estimatedHours) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      due_date: dueDate,
      estimated_hours: parseFloat(estimatedHours),
      importance: importance[0],
      dependencies,
    };

    onAddTask(task);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setEstimatedHours('');
    setImportance([5]);
    setDependencies([]);
    setNewDependency('');
  };

  const addDependency = () => {
    if (newDependency && !dependencies.includes(newDependency)) {
      setDependencies([...dependencies, newDependency]);
      setNewDependency('');
    }
  };

  const removeDependency = (dep: string) => {
    setDependencies(dependencies.filter(d => d !== dep));
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix login bug"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="3"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Importance</Label>
              <span className="text-sm font-medium text-primary">{importance[0]}/10</span>
            </div>
            <Slider
              value={importance}
              onValueChange={setImportance}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Dependencies (optional)</Label>
            <div className="flex gap-2">
              <select
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a task...</option>
                {existingTaskIds
                  .filter(id => !dependencies.includes(id))
                  .map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
              </select>
              <Button type="button" variant="outline" size="icon" onClick={addDependency}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {dependencies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {dependencies.map(dep => (
                  <span
                    key={dep}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {dep}
                    <button type="button" onClick={() => removeDependency(dep)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
