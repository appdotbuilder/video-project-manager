
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createVideoProjectInputSchema, 
  updateVideoProjectInputSchema, 
  getVideoProjectInputSchema, 
  deleteVideoProjectInputSchema 
} from './schema';

// Import handlers
import { createVideoProject } from './handlers/create_video_project';
import { getVideoProjects } from './handlers/get_video_projects';
import { getVideoProject } from './handlers/get_video_project';
import { updateVideoProject } from './handlers/update_video_project';
import { deleteVideoProject } from './handlers/delete_video_project';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new video project
  createVideoProject: publicProcedure
    .input(createVideoProjectInputSchema)
    .mutation(({ input }) => createVideoProject(input)),
  
  // Get all video projects
  getVideoProjects: publicProcedure
    .query(() => getVideoProjects()),
  
  // Get a single video project by ID
  getVideoProject: publicProcedure
    .input(getVideoProjectInputSchema)
    .query(({ input }) => getVideoProject(input)),
  
  // Update an existing video project
  updateVideoProject: publicProcedure
    .input(updateVideoProjectInputSchema)
    .mutation(({ input }) => updateVideoProject(input)),
  
  // Delete a video project
  deleteVideoProject: publicProcedure
    .input(deleteVideoProjectInputSchema)
    .mutation(({ input }) => deleteVideoProject(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
