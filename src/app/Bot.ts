import TelegramBot from "node-telegram-bot-api";
import replyWithButton from "../libs/reply-with-button";
import commands from "../libs/commands";
import { helpText } from "../libs/constants";
import { BMKGData, QuoteData, UserData } from "../libs/response-types";

class Bot extends TelegramBot {
    constructor(token: string, botOptions?: TelegramBot.ConstructorOptions) {
        super(token, botOptions);

        this.on("message", (data): void => {
            const { chat, from, text } = data;
            const isInCommand: boolean = Object.values(commands).some((keyword: RegExp) => keyword.test(text));

            if (!isInCommand) {
                const result: string = "Saya tidak mengerti 🙏\nKetik !help atau klik tombol di bawah ini untuk memunculkan panduan";

                this.sendMessage(chat.id, result, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Panduan Penggunaan", callback_data: "go_to_help" }],
                            [{ text: "Info Gempa", callback_data: "gempa" }]
                        ]
                    }
                });
            }
        });

        this.on('callback_query', async (callback): Promise<void> => {
            const { data, from } = callback;

            if (data === "go_to_help") {
                this.sendMessage(from.id, helpText);
            } else if (data === "gempa") {
                try {
                    const apiCall = await fetch(process.env.BMKG_ENDPOINT);
                    const { Infogempa: { gempa } } = await apiCall.json();
                    const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = gempa;

                    const image = `${process.env.BMKG_IMAGE_SOURCE}/${Shakemap}`;
                    const result = `Info gempa terbaru:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`;

                    this.sendPhoto(from.id, image, { caption: result });
                } catch (e) {
                    this.sendMessage(from.id, "Gagal memuat data berita, silakan coba lagi 😢");
                }
            }
        });
    }

    showHelp(): void {
        this.onText(commands.help, (msg: TelegramBot.Message): void => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, helpText);
        });
    }

    showGreeting(): void {
        this.onText(commands.greeting, (msg: TelegramBot.Message): void => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, `Halo juga juragan! 😁`);
        });
    }

    showFollowedText(): void {
        this.onText(commands.follow, (msg: TelegramBot.Message, match: RegExpExecArray): void => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, match[1]);
        });
    }

    showAvatar(): void {
        this.onText(commands.avatar, (msg: TelegramBot.Message, match: RegExpExecArray): void => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, "Mohon tunggu...");
            this.sendPhoto(chat.id, `${process.env.AVATAR_ENDPOINT}/${match[1]}`);
        });
    }

    showEarthQuakeInfo(): void {
        this.onText(commands.quake, async (msg: TelegramBot.Message): Promise<void> => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, "Mohon tunggu juragan...");

            try {
                const apiCall = await fetch(process.env.BMKG_ENDPOINT);
                const { Infogempa: { gempa } } = await apiCall.json();
                const { Kedalaman, Magnitude, Wilayah, Potensi, Tanggal, Jam, Shakemap } = gempa;

                const image: string = `${process.env.BMKG_IMAGE_SOURCE}/${Shakemap}`;
                const result: string = `Info gempa terbaru:\n\n${Tanggal} | ${Jam}\nWilayah: ${Wilayah}\nBesar: ${Magnitude} SR\nKedalaman: ${Kedalaman}\nPotensi: ${Potensi}`;

                this.sendPhoto(chat.id, image, { caption: result });

            } catch (e) {
                this.sendMessage(chat.id, "Gagal memuat data berita, silakan coba lagi 😢");
            }
        });
    }

    showQuotes(): void {
        this.onText(commands.quotes, async (msg: TelegramBot.Message): Promise<void> => {
            const { chat, from } = msg;

            try {
                const apiCall = await fetch(process.env.QUOTES_ENDPOINT);
                const { quote }: QuoteData = await apiCall.json();

                this.sendMessage(chat.id, quote);
            } catch (e) {
                this.sendMessage(chat.id, "Gagal memuat kutipan, silakan coba lagi 😢");
            }
        });
    }

    showNews(): void {
        this.onText(commands.news, async (msg: TelegramBot.Message): Promise<void> => {
            const { chat, from } = msg;
            this.sendMessage(chat.id, "Mohon tunggu juragan...");

            try {
                const apiCall = await fetch(process.env.NEWS_ENDPOINT);
                const { posts }: BMKGData = await apiCall.json();

                for (let i = 0; i < 3; i++) {
                    const { title, image, headline } = posts[i];
                    const result: string = `\n---\n${title}\n---\n\n${headline}`;

                    this.sendPhoto(chat.id, image, { caption: result });
                }
            } catch (e) {
                this.sendMessage(chat.id, "Gagal memuat berita, silakan coba lagi 😢");
            }
        });
    }
}

export default Bot;
