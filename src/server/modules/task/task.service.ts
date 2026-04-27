import { TaskInputSchema } from '../../types';
import type { TaskInput, Task } from '../../types';

// In-memory storage for tasks
let tasks: Task[] = [];
let nextId = 1;

export class TaskService {
  // Validate task input using Zod schema
  static validateTaskInput(input: unknown): TaskInput {
    return TaskInputSchema.parse(input);
  }

  // Create a new task
  static create(taskData: TaskInput): Task {
    const task: Task = {
      ...taskData,
      id: nextId.toString(),
      dataCriacao: new Date(),
    };
    tasks.push(task);
    nextId++;
    return task;
  }

  // Get all tasks
  static getAll(): Task[] {
    return tasks.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
  }

  // Update task
  static update(id: string, updates: Partial<TaskInput>): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return null;
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  }

  // Delete task
  static delete(id: string): boolean {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  }
}
