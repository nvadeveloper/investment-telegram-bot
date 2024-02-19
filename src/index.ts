import { type Context, Markup, Telegraf, Telegram } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { СurrencyBackendType, СurrencyType } from './types';
import { Client } from '@notionhq/client';
import { getCurrentDate } from './utils';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const CURRENCY_MAP = new Map<string, string>([
    ['USD000UTSTOM', '🇺🇸 USD'],
    ['EUR_RUB__TOM', '🇪🇺 EUR'],
    ['CNYRUB_TOM', '🇨🇳 CNY'],
    ['TRYRUB_TOM', '🇹🇷 TRY'],
    ['HKDRUB_TOM', '🇭🇰 HKD'],
    ['KZTRUB_TOM', '🇵🇼 KZT'],
]);

const token: string = process.env.BOT_TOKEN ?? '';
const port: string = process.env.PORT ?? '';
const url: string = process.env.URL ?? '';

const bot = new Telegraf<Context<any>>(token);

const app = express();
bot.launch();

async function addToDatabase(databaseId: any, username: string, date: any) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                id: {
                    type: 'title',
                    title: [
                        {
                            type: 'text',
                            text: {
                                content: username,
                            },
                        },
                    ],
                },
                date: {
                    type: 'rich_text',
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: getCurrentDate(),
                            },
                        },
                    ],
                },
            },
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

const filterData = (data: СurrencyBackendType[]) => {
    const array: СurrencyType[] = [];

    data.filter((item: СurrencyBackendType) => {
        if (CURRENCY_MAP.get(item.SECID)) {
            array.push({
                text: CURRENCY_MAP.get(item.SECID) ?? '',
                value: item.LAST,
                time: item.UPDATETIME,
            });
        }
    });

    return array;
};

const convertToText = (data: СurrencyType[]) =>
    data.map((item) => `${item.text} ${item.value}. Обновлено: ${item.time}`);

app.listen(port, () => {
    console.log(`Dolphin app listening on port ${port}!`);

    bot.start(async (ctx) => {
        await ctx.reply('Привет, ' + ctx.from.first_name + '!', {
            ...Markup.inlineKeyboard([Markup.button.callback('Узнать курс валют', 'currency')]),
        });
    });

    bot.action('currency', async (ctx) => {
        const data = await fetch(url).then((data) => data.json());
        await addToDatabase(databaseId, String(ctx.from?.id), Date.now());
        await ctx.reply(convertToText(filterData(data[1].marketdata)).join('\n'), {
            ...Markup.inlineKeyboard([Markup.button.callback('Обновить курс валют', 'currency')]),
        });
    });
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});
