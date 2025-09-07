import Fastify from 'fastify';
import * as dotenv from 'dotenv';
import dbPlugin from './plugins/db';
import { users } from './db/schema';

dotenv.config();

const app = Fastify({
  logger:
    process.env.APP_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, singleLine: true },
          },
          level: 'info',
        }
      : {
          level: 'info',
        },
});

app.register(dbPlugin);

app.get('/healthz', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
});

app.get('/healthz/db', async (req, reply) => {
  const rows = await app.db.select({ id: users.id }).from(users);
  return { status: 'ok', users: rows.length };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    const host = '0.0.0.0';
    await app.listen({ port, host });
    app.log.info(`API listening on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
