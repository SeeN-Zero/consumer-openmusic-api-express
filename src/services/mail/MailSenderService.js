import nodemailer from "nodemailer";
import config from "../../config/index.js";

class MailSenderService {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.port === 465,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.password,
            },
        });
    }

    async sendExportPlaylist(targetEmail, payload) {
        const filename = `playlist-${payload.playlist.id}.json`;

        await this._transporter.sendMail({
            from: `OpenMusic Export <${config.smtp.user}>`,
            to: targetEmail,
            subject: "Ekspor Playlist OpenMusic",
            text: "Terlampir hasil ekspor playlist Anda dalam format JSON.",
            attachments: [
                {
                    filename,
                    content: JSON.stringify(payload, null, 2),
                    contentType: "application/json",
                },
            ],
        });
    }
}

export default MailSenderService;
