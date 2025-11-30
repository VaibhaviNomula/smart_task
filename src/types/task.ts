export interface Task {
  id?: string;
  title: string;
  due_date: string;
  estimated_hours: number;
  importance: number;
  dependencies: string[];
}

export interface AnalyzedTask extends Task {
  priority_score: number;
  explanation: string;
  priority_level: 'high' | 'medium' | 'low';
}

export interface SuggestedTask extends AnalyzedTask {
  suggestion_reason: string;
}

export type SortingStrategy = 'smart_balance' | 'fastest_wins' | 'high_impact' | 'deadline_driven';

export interface AnalyzeRequest {
  tasks: Task[];
  strategy?: SortingStrategy;
}

export interface AnalyzeResponse {
  sorted_tasks: AnalyzedTask[];
}

export interface SuggestResponse {
  suggestions: SuggestedTask[];
}
