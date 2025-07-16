import {configDotenv} from "dotenv";

configDotenv()
const TOKEN = process.env.DISCORD_TOKEN;

const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('node:fs');
import {SlashCommandBuilder} from '@discordjs/builders';

let commands = [];
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commandPing = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

commands.push(commandPing)

const commandSetvc = new SlashCommandBuilder()
    .setName('setvc')
    .setDescription('VC作成用のVCを作成する')
    .addStringOption(option => option
        .setName('vc')
        .setDescription('Voice Channel')
        .setRequired(true))

commands.push(commandSetvc)

const rest = new REST({version: '9'}).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);