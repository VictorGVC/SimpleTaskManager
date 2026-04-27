import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@/src/server/root';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientConfig = {
  transformer: superjson,
  links: [
    () =>
      ({
        runtime: 'edge',
        url: '/api/trpc',
      }) as any,
  ],
};
