import {configDotenv} from "dotenv";

configDotenv()
const TOKEN = process.env.DISCORD_TOKEN;

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');


let commands = [];
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commandPing = new SlashCommandBuilder()
.setName('ping')
.setDescription('Replies with Pong!');

commands.push(commandPing)

const rest = new REST({ version: '9' }).setToken(TOKEN);

