const config = {
  app: {
    port: Number(process.env.PORT ?? 5000),
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
    queue: process.env.RABBITMQ_QUEUE ?? "export:playlists",
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  postgres: {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
};

export default config;
