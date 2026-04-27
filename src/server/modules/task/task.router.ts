import { router, publicProcedure } from '../../trpc';
import { z } from 'zod';
import { TaskService as taskService } from './task.service';
import { TaskInputSchema } from '../../types';

export const taskRouter = router({
  // Create a new task
  create: publicProcedure
    .input(TaskInputSchema)
    .mutation(({ input }) => {
      try {
        const task = taskService.create(input);
        return {
          success: true,
          data: task,
        };
      } catch (error) {
        throw new Error('Failed to create task');
      }
    }),

  // Get all tasks
  getAll: publicProcedure.query(() => {
    try {
      const tasks = taskService.getAll();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }),

  
  // Update task
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: TaskInputSchema.partial(),
    }))
    .mutation(({ input }) => {
      try {
        const task = taskService.update(input.id, input.data);
        if (!task) {
          throw new Error('Task not found');
        }
        return {
          success: true,
          data: task,
        };
      } catch (error) {
        throw new Error('Failed to update task');
      }
    }),

  // Delete task
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      try {
        const deleted = taskService.delete(input.id);
        if (!deleted) {
          throw new Error('Task not found');
        }
        return {
          success: true,
          message: 'Task deleted successfully',
        };
      } catch (error) {
        throw new Error('Failed to delete task');
      }
    }),
});

export type TaskRouter = typeof taskRouter;
