const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const cron = require("node-cron");
const app = express();
app.use(express.json());
const TOKEN = "7454146253:AAFVIBrfP7tKJxtEKWb4OoyJ-y12rBpnY5c";
const bot = new Telegraf(TOKEN);
const community_link = process.env.COMMUNITY_LINK || "https://t.me/bell_fi";
const community_links = process.env.COMMUNITY_LINKS || "https://t.me/Bell_Fi_channel";
const x_links = process.env.X_LINK || "https://twitter.com/bell__fi";
const web_link = "https://app.bellfi.xyz/";

let subscribers = []; // Initialize an array to store subscriber chat IDs

bot.start((ctx) => {
    const startPayload = ctx.startPayload || '';  // Fallback if startPayload is undefined
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;

    ctx.replyWithMarkdown(
        `*Hey, ${userName}!  Welcome to BELL Fi!*\nTap on the bell and see your reward rise.\n\n*BELL Fi* is a ring-to-earn Web3 game. Bell will be the main utility token in the Bell Fi Web applications.\n\nWhere are your buddies? Get them in the play. More buddies, more rewards.\n\nFor commands, click /help.`,
        Markup.inlineKeyboard([
            [{ text: "Join Community", url: community_links },{ text: "Follow on X", url: x_links },],
            [{ text: "👋 How To Play The Game", callback_data: "help" }],
            [{ text: "👋 Play now!", web_app: { url: urlSent } }],
        ])
    );
});

bot.on("callback_query", (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData === "help") {
        ctx.answerCbQuery(); // Acknowledge the callback
        ctx.replyWithMarkdown(
            `
Full version of the guide.

💰 Tap
Tap the screen and collect coins.

⚡ Energy Level Limit 
Increase the limit of your energy storage.
+500 energy limit for each level.

⛏ Boost Tap
Increase the amount of coins you earn per tap.
+1 per tap for each level.

🛎️ Bell Guru
Multiply your tap income by x5 for 20 seconds.

⏰ Profit per tap
The exchange will yield returns for you on its own based on your investment, for up to 3 hours.

📈 League 
The more coins you earn from tapping, the higher the level in league.

🗒️ Task 
Complete tasks to earn more coins. 
Note: the bot will use a Sybil detection system to monitor tasks to blacklist cheaters and multiple accounts.

👥 Ref
Invite your friends and get bonuses. You grow in rewards as your referrals grow.

🪙 Airdrop Distribution 
At the end of the mining stage, #BELL token will be released and distributed among the players. There will be no presale or private sale of BELL token.For more click /help.
            `,
            Markup.inlineKeyboard([
                [{ text: "Join Community", url: community_links }],
                [{ text: "👋 Play now!", web_app: { url: web_link } }],
            ])
        );
    }
});

bot.command("help", (ctx) => {
    const helpMessage = `
Here are the commands you can use:
/start - Start the bot and get your custom link
/help - Show this help message
/community - Get the links to our community channels
/twitter - Get the link to our Twitter profile
    `;
    ctx.replyWithMarkdown(helpMessage);
});

bot.command("community", (ctx) => {
    ctx.replyWithMarkdown(
        "Join our community:",
        Markup.inlineKeyboard([
            [Markup.button.url("Community Chat", community_link)],
            [Markup.button.url("Community Group", community_links)],
        ])
    );
});

bot.command("twitter", (ctx) => {
    ctx.replyWithMarkdown(
        "Follow us on Twitter:",
        Markup.inlineKeyboard([
            [Markup.button.url("Twitter Profile", x_links)],
        ])
    );
});

// Function to send messages to all subscribers
const sendMessageToSubscribers = () => {
    subscribers.forEach((chatId) => {
        bot.telegram.sendMessage(
            chatId,
            "Hello buddy, it is time to play for some amazing rewards while building up your level in the game",
            Markup.inlineKeyboard([
                [Markup.button.url("Community Group", community_link)],
                [Markup.button.url("Community Channel", community_links)],
                [Markup.button.url("Follow us on Twitter", x_links)],
                [{ text: "👋 Play now!", web_app: { url: web_link } }],
            ])
        ).catch((err) => {
            console.error(`Failed to send message to ${chatId}`, err);
        });
    });
};

// Schedule the sendMessageToSubscribers function to run every 6 hours
cron.schedule("0 */6 * * *", () => {
    sendMessageToSubscribers();
});

app.post("/webhook", (req, res) => {
    bot.handleUpdate(req.body, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.launch();
