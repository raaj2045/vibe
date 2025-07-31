import { projectsRouter } from '@/modules/projects/server/procedures';
import { messageRouter } from '@/modules/messages/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter
});
// export type definition of APIß
export type AppRouter = typeof appRouter;
