import Bot from "./src/app/Bot";

process.env.TZ = "Indonesia/Jakarta";

const result = require("dotenv").config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

type BotOptions = {
  polling: boolean;
  filePath?: boolean;
};

const token: string | undefined = process.env.TOKEN;

if (!token) {
  throw new Error("Bot token is not defined in environment variables");
}

const botOptions: BotOptions = {
  polling: true,
  filePath: false,
  // agentOptions: {
  //   socksHost: process.env.PROXY_SOCKS5_HOST,
  //   socksPort: process.env.PROXY_SOCKS5_PORT ? parseInt(process.env.PROXY_SOCKS5_PORT) : undefined,
  //   // If authorization is needed:
  //   // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
  //   // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
  // }
};

console.log("Bot options:", botOptions);

const bot = new Bot(token, botOptions);

bot.on("polling_error", (error) => {
  // Handle specific polling errors
  if (error.message.includes("EFATAL")) {
    console.error("Polling error:", "EFATAL error occurred");
  } else {
    console.error("Polling error:", error.message);
  }
});

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

console.log("Bot is running now!");
console.log("Token:", process.env.TOKEN);

main();
