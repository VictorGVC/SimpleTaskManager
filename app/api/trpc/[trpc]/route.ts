import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/src/server/root';
import { Context } from '@/src/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (): Context => ({}),
    onError: ({ error, path }) => {
      console.error(`Error in tRPC handler at ${path}:`, error);
    },
  });

export { handler as GET, handler as POST };
