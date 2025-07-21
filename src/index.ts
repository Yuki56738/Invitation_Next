import * as log4js from 'log4js';

log4js.configure({
    appenders: {
        console: {type: 'console'},
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
import {ChatInputCommandInteraction, Client, GatewayIntentBits, Interaction, InteractionContextType} from "discord.js";
import dotenv from 'dotenv';


logger.info('Starting Invitation_Next...')

dotenv.configDotenv()

// import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {PrismaClient } from './generated/prisma'
const prisma = new PrismaClient()

try{
    prisma.$connect()
    prisma.$disconnect()
}catch(e){
    logger.error('Failed to connect to database:', e)
}

const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    logger.info(`Logged in as ${client.user?.tag}`);
    logger.debug('Connected to following guilds:')
    client.guilds.cache.forEach(guild => {
        logger.debug(guild.name)
    });

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const commandName = interaction.commandName
    interaction = interaction as ChatInputCommandInteraction
    if (commandName === 'ping') {
        await interaction.reply('Pong!')
    }else if (commandName === 'setvc') {
        await interaction.deferReply()
        const optionVc = interaction.options.getString('vc')
        logger.info(`***${interaction.user.tag} tried to set VC to ${optionVc}***`)
    }

})


client.on('error', (error) => {
    logger.error('Discord client error:', error);
});

client.login(TOKEN).catch(error => {
    logger.error('Failed to login:', error);
});

