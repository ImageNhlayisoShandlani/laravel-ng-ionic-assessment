export interface Task {
  id?: number;
  project_id?: number;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date?: string | null;
  created_at?: string;
  updated_at?: string;
}