import { type Context, Markup, Telegraf, Telegram } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { СurrencyBackendType, СurrencyType } from './types';

dotenv.config();

const CURRENCY_MAP = new Map<string, string>([
    ['USD000UTSTOM', 'USD'],
    ['EUR_RUB__TOM', 'EUR'],
    ['CNYRUB_TOM', 'CNY'],
    ['TRYRUB_TOM', 'TRY'],
    ['HKDRUB_TOM', 'HKD'],
    ['KZTRUB_TOM', 'KZT'],
]);

const token: string = process.env.BOT_TOKEN ?? '';
const port: string = process.env.PORT ?? '';
const url: string = process.env.URL ?? '';

// const telegram: Telegram = new Telegram(token);

const bot = new Telegraf<Context<any>>(token);

const app = express();
bot.launch();

const filterData = (data: СurrencyBackendType[]) => {
    const array: СurrencyType[] = [];

    data.filter((item: СurrencyBackendType) => {
        if (CURRENCY_MAP.get(item.SECID)) {
            array.push({ text: CURRENCY_MAP.get(item.SECID) ?? '', value: item.LAST });
        }
    });

    return array;
};

const convertToText = (data: СurrencyType[]) => data.map((item) => `${item.text} ${item.value}`);

app.listen(port, () => {
    console.log(`Dolphin app listening on port ${port}!`);

    bot.start(async (ctx) => {
        await ctx.reply('Привет, ' + ctx.from.first_name + '!');
    });

    bot.on('text', async (ctx) => {
        const data = await fetch(url).then((data) => data.json());

        await ctx.reply(convertToText(filterData(data[1].marketdata)).join('\n'));
    });
});

app.get('/', (req, res) => {
    res.send('Hello!');
});
