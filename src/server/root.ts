import { router } from './trpc';
import { taskRouter } from './modules/task/task.router';

export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
