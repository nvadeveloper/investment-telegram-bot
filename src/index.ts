/* eslint-disable @typescript-eslint/no-floating-promises */
import { type Context, Markup, Telegraf, Telegram } from 'telegraf'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
console.log('process.env.BOT_TOKEN ', process.env.BOT_TOKEN)
const token: string = process.env.BOT_TOKEN ?? ''

const telegram: Telegram = new Telegram(token)

const bot = new Telegraf<Context<any>>(token)

const chatId: string = process.env.CHAT_ID ?? ''

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!')
})

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting')
  ctx.reply('Send /keyboard to receive a message with a keyboard')
  ctx.reply('Send /quit to stop the bot')
})

bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id)

  // Context shortcut
  ctx.leaveChat()
})

bot.command('keyboard', (ctx) => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('First option', 'first'),
      Markup.button.callback('Second option', 'second')
    ])
  )
})

bot.on('text', (ctx) => {
  ctx.reply('You choose the ' + (ctx.message.text === 'first' ? 'First' : 'Second') + ' Option!')

  if (!(chatId.length === 0)) {
    telegram.sendMessage(chatId, 'This message was sent without your interaction!')
  }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
