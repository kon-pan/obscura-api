import fp from 'fastify-plugin';
import { db, pgPool } from '../db/client';
import type { FastifyInstance } from 'fastify';

export default fp(async (app: FastifyInstance) => {
  app.decorate('db', db);
  app.addHook('onClose', async () => {
    await pgPool.end();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
  }
}
