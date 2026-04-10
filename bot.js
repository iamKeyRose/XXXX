const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// 1. Initialize Bot (Render will provide the BOT_TOKEN via Env Variables)
const bot = new Telegraf(process.env.BOT_TOKEN);

// 2. The Master Dispatcher Logic
bot.start((ctx) => {
    const payload = ctx.startPayload; // Gets 'rest_001' from the QR link
    const githubUrl = "https://your-username.github.io/your-repo/"; // <--- UPDATE THIS

    if (payload) {
        // If they scanned a specific restaurant QR
        return ctx.reply(`Welcome! Opening your selected service...`, 
            Markup.inlineKeyboard([
                [Markup.button.webApp('Open Menu ➔', `${githubUrl}?id=${payload}`)]
            ])
        );
    }

    // Default Global Landing Page
    return ctx.replyWithMarkdownV2(
        "*Welcome to the Habesha Super App\\!* 🇪🇹 🇪🇷\n\n" +
        "Please select a category to get started:",
        Markup.inlineKeyboard([
            [Markup.button.webApp('🍴 Habesha Eats', `${githubUrl}?cat=food`)],
            [Markup.button.webApp('💼 Trusted Services', `${githubUrl}?cat=services`)],
            [Markup.button.webApp('📦 Cargo & Logistics', `${githubUrl}?cat=cargo`)]
        ])
    );
});

// 3. Keep-Alive Server (Required for Render Free Tier)
http.createServer((req, res) => {
    res.write('Habesha Bot is Running');
    res.end();
}).listen(process.env.PORT || 3000);

// 4. Launch
bot.launch();
console.log("Master Bot is live...");
