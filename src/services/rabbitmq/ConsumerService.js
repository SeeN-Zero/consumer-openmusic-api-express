import amqp from "amqplib";
import config from "../../config/index.js";

class ConsumerService {
  constructor({ playlistsService, mailSenderService }) {
    this._playlistsService = playlistsService;
    this._mailSenderService = mailSenderService;
    this._connection = null;
    this._channel = null;
  }

  async start() {
    if (!config.rabbitMq.server) {
      throw new Error("RABBITMQ_SERVER belum dikonfigurasi");
    }

    this._connection = await amqp.connect(config.rabbitMq.server);
    this._channel = await this._connection.createChannel();

    await this._channel.assertQueue(config.rabbitMq.queue, {
      durable: true,
    });

    await this._channel.consume(config.rabbitMq.queue, async (message) => {
      if (!message) return;

      try {
        const payload = JSON.parse(message.content.toString());
        const { playlistId, targetEmail } = payload;

        if (!playlistId || !targetEmail) {
          throw new Error("Payload harus berisi playlistId dan targetEmail");
        }

        const playlist = await this._playlistsService.getPlaylistExportById(
          playlistId
        );
        await this._mailSenderService.sendExportPlaylist(targetEmail, playlist);

        this._channel.ack(message);
      } catch (error) {
        console.error("Gagal memproses pesan ekspor playlist:", error.message);
        this._channel.nack(message, false, false);
      }
    });

    console.log(`RabbitMQ consumer aktif pada queue "${config.rabbitMq.queue}"`);
  }

  async close() {
    if (this._channel) {
      await this._channel.close();
    }

    if (this._connection) {
      await this._connection.close();
    }
  }
}

export default ConsumerService;
