import { type Context, Markup, Telegraf, Telegram, Scenes, Composer, session } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { СurrencyBackendType, СurrencyType } from './types';
import { Client } from '@notionhq/client';
import { getCurrentDate } from './utils';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const token: string = process.env.BOT_TOKEN ?? '';
const port: string = process.env.PORT ?? '';
const url: string = process.env.URL ?? '';
const bot = new Telegraf<Context<any>>(token);

const startWizardScene = new Composer<Scenes.WizardContext>();
const nameWizardScene = new Composer<Scenes.WizardContext>();
const emailWizardScene = new Composer<Scenes.WizardContext>();
const phoneWizardScene = new Composer<Scenes.WizardContext>();

startWizardScene.on('text', async (ctx) => {
    await ctx.reply('Введите имя и фамилию');

    return ctx.wizard.next();
});

nameWizardScene.on('text', async (ctx) => {
    await ctx.reply('Введите email');
    return ctx.wizard.next();
});

emailWizardScene.on('text', async (ctx) => {
    await ctx.reply('Введите номер телефона');
    return ctx.wizard.next();
});

phoneWizardScene.on('text', async (ctx) => {
    await ctx.reply('Спасибо анкета заполнена!');

    return ctx.scene.leave();
});

const menuScene = new Scenes.WizardScene(
    'wizardScene',
    startWizardScene,
    nameWizardScene,
    emailWizardScene,
    phoneWizardScene,
);
const stage = new Scenes.Stage([menuScene] as any);

const app = express();

bot.use(session());
bot.use(stage.middleware() as any);
bot.launch();

app.listen(port, () => {
    console.log(`Dolphin app listening on port ${port}!`);
    bot.start(async (ctx) => {
        await ctx.reply('👋');
        await ctx.reply('Привет, ' + ctx.from.first_name + '!');
        // @ts-ignore
        await ctx.scene.enter('wizardScene');
    });
});

app.get('/', (req, res) => {
    res.send('Hello world!');
});
