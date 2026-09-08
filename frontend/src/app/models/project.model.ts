import { Task } from "./task.model";

export interface Project {
  id?: number;
  name: string;
  description?: string | null;
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}