import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { 
      type: 'file', 
      filename: 'logs/app.log',
      maxLogSize: 10485760, // 10MB
      backups: 3
    }
  },
  categories: {
    default: { 
      appenders: ['console', 'file'], 
      level: 'debug'
    }
  }
});

// ロガーの取得
const logger = log4js.getLogger();

// 使用例
// logger.info('情報レベルのログメッセージ');
// logger.error('エラーレベルのログメッセージ');
// logger.debug('デバッグレベルのログメッセージ');

import 'discord.js'
import {Client, GatewayIntentBits} from "discord.js";
import dotenv from 'dotenv';

logger.info('Starting Invitation_Next...')

dotenv.configDotenv()

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
  ]
});

client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`);
  logger.debug('Connected to following guilds:')
  client.guilds.cache.forEach(guild => {
    logger.debug(guild.name)
  });

});

client.on('interactionCreate', interaction => {

})

client.on('error', (error) => {
  logger.error('Discord client error:', error);
});

client.login(TOKEN).catch(error => {
  logger.error('Failed to login:', error);
});
