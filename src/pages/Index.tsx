import { useState } from 'react';
import { Task, AnalyzedTask, SortingStrategy } from '@/types/task';
import { analyzeTasks } from '@/lib/api';
import { TaskForm } from '@/components/TaskForm';
import { JsonImport } from '@/components/JsonImport';
import { TaskList } from '@/components/TaskList';
import { StrategySelector } from '@/components/StrategySelector';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ListChecks } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analyzedTasks, setAnalyzedTasks] = useState<AnalyzedTask[]>([]);
  const [strategy, setStrategy] = useState<SortingStrategy>('smart_balance');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setAnalyzedTasks([]);
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks((prev) => [...prev, ...importedTasks]);
    setAnalyzedTasks([]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setAnalyzedTasks([]);
  };

  const handleClearAll = () => {
    setTasks([]);
    setAnalyzedTasks([]);
  };

  const handleAnalyze = async () => {
    if (tasks.length === 0) {
      toast({
        title: 'No tasks to analyze',
        description: 'Please add at least one task first',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await analyzeTasks(tasks, strategy);
      setAnalyzedTasks(response.sorted_tasks);
      toast({
        title: 'Analysis complete',
        description: `Analyzed ${response.sorted_tasks.length} tasks using ${strategy.replace('_', ' ')} strategy`,
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Failed to analyze tasks',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const existingTaskIds = tasks.map((t) => t.id).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Task Analyzer</h1>
              <p className="text-sm text-muted-foreground">
                Intelligently prioritize your tasks
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  1
                </span>
                Add Tasks
              </h2>

              <Tabs defaultValue="form" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="form">Add Manually</TabsTrigger>
                  <TabsTrigger value="json">Import JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                  <TaskForm onAddTask={handleAddTask} existingTaskIds={existingTaskIds} />
                </TabsContent>
                <TabsContent value="json">
                  <JsonImport onImport={handleImportTasks} />
                </TabsContent>
              </Tabs>
            </div>

            <TaskList
              tasks={tasks}
              onRemoveTask={handleRemoveTask}
              onClearAll={handleClearAll}
            />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                  2
                </span>
                Choose Strategy
              </h2>
              <StrategySelector value={strategy} onChange={setStrategy} />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || tasks.length === 0}
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Tasks
                </>
              )}
            </Button>
          </section>

          {/* Output Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                3
              </span>
              Results
            </h2>

            {analyzedTasks.length > 0 ? (
              <AnalysisResults tasks={analyzedTasks} />
            ) : (
              <div className="border-2 border-dashed border-border/50 rounded-xl p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">No analysis yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Add tasks and click "Analyze Tasks" to see prioritized results
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
