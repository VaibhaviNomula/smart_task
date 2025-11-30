import { Task, AnalyzeResponse, SuggestResponse, SortingStrategy } from '@/types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeTasks(tasks: Task[], strategy: SortingStrategy = 'smart_balance'): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/analyze/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tasks, strategy }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to analyze tasks' }));
    throw new Error(error.detail || 'Failed to analyze tasks');
  }

  return response.json();
}

export async function getSuggestions(): Promise<SuggestResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/suggest/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get suggestions' }));
    throw new Error(error.detail || 'Failed to get suggestions');
  }

  return response.json();
}
