import "dotenv/config";
import express from "express";
import config from "./config/index.js";
import PlaylistsService from "./services/postgres/PlaylistsService.js";
import MailSenderService from "./services/mail/MailSenderService.js";
import ConsumerService from "./services/rabbitmq/ConsumerService.js";

const app = express();

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Consumer service is running",
  });
});

const playlistsService = new PlaylistsService();
const mailSenderService = new MailSenderService();
const consumerService = new ConsumerService({
  playlistsService,
  mailSenderService,
});

const start = async () => {
  try {
    await consumerService.start();

    app.listen(config.app.port, () => {
      console.log(`Consumer server berjalan pada port ${config.app.port}`);
    });
  } catch (error) {
    console.error("Gagal menjalankan consumer service:", error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  await consumerService.close();
  await playlistsService.close();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

start();
