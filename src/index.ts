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
import {
    ChatInputCommandInteraction, Client, GatewayIntentBits, Interaction, InteractionContextType, PermissionFlagsBits,
    PermissionsBitField
} from "discord.js";
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
    prisma.$connect()
    client.guilds.cache.forEach(async guild => {
        logger.debug(guild.name)
        try {
            await prisma.guilds.upsert({
                where: {
                    guild_id: guild.id,
                },
                update: {
                    guild_name: guild.name
                },
                create: {
                    guild_id: guild.id,
                    guild_name: guild.name
                }
            });
        } catch (error) {
            logger.error(`Failed to upsert guild ${guild.name}:`, error);
        }
        try{
            await prisma.guildSettings.upsert({
                where: {
                    guild_id: guild.id
                },
                update:{
                    guild_name: guild.name
                },
                create: {
                    guild_id: guild.id,
                    guild_name: guild.name,
                    setvc: 'default',
                }
            })
        }catch(e){
            logger.error(`Failed to upsert guild settings for guild ${guild.name}:`, e)
        }
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
        if (!interaction.guild!.members.cache.get(interaction.user.id)?.permissions.has(PermissionFlagsBits.ManageGuild)){
            await interaction.editReply('権限拒否。')
            logger.warn(`***${interaction.user.tag} tried to set VC without Manage Guild permission***`)
            return
        }
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

