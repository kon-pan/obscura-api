import Fastify from 'fastify';
import * as dotenv from 'dotenv';

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

app.get('/healthz', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
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
