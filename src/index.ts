import { type Context, Markup, Telegraf, Telegram } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const CURRENCY = [
    'USDRUB_TOM',
    'EURRUB_TOM',
    'CNYRUB_TOM',
    'TRYRUB_TOM',
    'HKDRUB_TOM',
    'KZTRUB_TOM',
    'USDKZT_TOM',
];

const token: string = process.env.BOT_TOKEN ?? '';
const port: string = process.env.PORT ?? '';
const url: string = process.env.URL ?? '';

// const telegram: Telegram = new Telegram(token);

const bot = new Telegraf<Context<any>>(token);

const app = express();
bot.launch();

const filterData = (data: any) => {
    const array: any[] = [];

    data[1].securities.filter((item: any) => {
        if (CURRENCY.includes(item.SHORTNAME)) {
            array.push({ text: item.FACEUNIT, value: item.PREVPRICE });
        }
    });

    return array;
};

const convertToText = (data: any) => {
    const array: any[] = [];

    data.map((item: any) => array.push(`${item.text} ${item.value}`));

    return array;
};

app.listen(port, () => {
    console.log(`Dolphin app listening on port ${port}!`);

    bot.on('text', async (ctx) => {
        const data = await fetch(url).then((data) => data.json());

        await ctx.reply(convertToText(filterData(data)).join('\n'));
    });
});

app.get('/', (req, res) => {
    res.send('Hello!');
});
