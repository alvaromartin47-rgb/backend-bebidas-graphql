import { Telegraf } from 'telegraf';
import env from 'node-env-file'
env("./.env");

const TOKEN = process.env.TOKEN;

const bot = new Telegraf(TOKEN);

// bot.command('start', (ctx) => ctx.reply('Hello'))

export default bot;