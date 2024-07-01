import Bot from "./src/app/Bot";

process.env.TZ = "Indonesia/Jakarta";

require("dotenv").config();

const result = require("dotenv").config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

type BotOptions = {
  polling: boolean;
  filePath?: boolean;
  agentOptions?: {
    socksHost?: string;
    socksPort?: number;
    socksUsername?: string;
    socksPassword?: string;
  };
};

// ...

const token: string | undefined = process.env.TOKEN;

const botOptions: BotOptions = {
  polling: true,
  filePath: false,
  agentOptions: {
    socksHost: process.env.PROXY_SOCKS5_HOST,
    socksPort: process.env.PROXY_SOCKS5_PORT ? parseInt(process.env.PROXY_SOCKS5_PORT) : undefined,
    // If authorization is needed:
    // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
    // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
  }
};

if (!token) {
  throw new Error("Bot token is not defined in environment variables");
}

const bot = new Bot(token, botOptions);

function main(): void {
  try {
    bot.showHelp();
    bot.showFollowedText();
    bot.showAvatar();
    bot.showEarthQuakeInfo();
    bot.showGreeting();
    bot.showNews();
    bot.showQuotes();
  } catch (error) {
    console.error("An error occurred while running the bot:", error);
  }
}

console.log("Bot berjalan normal!");
console.log("Token:", process.env.TOKEN);

main();
