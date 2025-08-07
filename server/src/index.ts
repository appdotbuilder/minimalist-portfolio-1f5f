
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  updateAboutMeInputSchema,
  createSkillInputSchema,
  updateSkillInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  updateContactInputSchema
} from './schema';

// Import handlers
import { getAboutMe } from './handlers/get_about_me';
import { updateAboutMe } from './handlers/update_about_me';
import { getSkills } from './handlers/get_skills';
import { createSkill } from './handlers/create_skill';
import { updateSkill } from './handlers/update_skill';
import { deleteSkill } from './handlers/delete_skill';
import { getProjects } from './handlers/get_projects';
import { createProject } from './handlers/create_project';
import { updateProject } from './handlers/update_project';
import { deleteProject } from './handlers/delete_project';
import { getContact } from './handlers/get_contact';
import { updateContact } from './handlers/update_contact';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // About Me routes
  getAboutMe: publicProcedure
    .query(() => getAboutMe()),
  updateAboutMe: publicProcedure
    .input(updateAboutMeInputSchema)
    .mutation(({ input }) => updateAboutMe(input)),

  // Skills routes
  getSkills: publicProcedure
    .query(() => getSkills()),
  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),
  updateSkill: publicProcedure
    .input(updateSkillInputSchema)
    .mutation(({ input }) => updateSkill(input)),
  deleteSkill: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteSkill(input.id)),

  // Projects routes
  getProjects: publicProcedure
    .query(() => getProjects()),
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),
  deleteProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProject(input.id)),

  // Contact routes
  getContact: publicProcedure
    .query(() => getContact()),
  updateContact: publicProcedure
    .input(updateContactInputSchema)
    .mutation(({ input }) => updateContact(input)),
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
