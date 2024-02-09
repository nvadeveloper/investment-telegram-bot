import { type Context, Markup, Telegraf, Telegram } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const token: string = process.env.BOT_TOKEN ?? '';
const port: string = process.env.PORT ?? '';
const url: string = process.env.URL ?? '';

const telegram: Telegram = new Telegram(token);

const bot = new Telegraf<Context<any>>(token);

const chatId: string = process.env.CHAT_ID ?? '';

bot.start((ctx) => {
    ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
    ctx.reply('Send /keyboard to receive a message with a keyboard');
    ctx.reply('Send /quit to stop the bot');
});

bot.command('quit', (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);

    // Context shortcut
    ctx.leaveChat();
});

bot.command('keyboard', (ctx) => {
    ctx.reply(
        'Keyboard',
        Markup.inlineKeyboard([
            Markup.button.callback('First option', 'first'),
            Markup.button.callback('Second option', 'second'),
        ]),
    );
});

bot.on('text', (ctx) => {
    ctx.reply('You choose the ' + (ctx.message.text === 'first' ? 'First' : 'Second') + ' Option!');

    if (!(chatId.length === 0)) {
        telegram.sendMessage(chatId, 'This message was sent without your interaction!');
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => {
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
});

const app = express();

app.listen(port, () => {
    console.log(`Dolphin app listening on port ${port}!`);
});

app.get('/', async (req, res) => {
    const data = await fetch(url) ;
    console.log(data);
    res.send("Hello!");
});
