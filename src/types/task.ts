// src/types/task.ts
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  dueDate?: string;
}
