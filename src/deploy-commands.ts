import {configDotenv} from "dotenv";

configDotenv()
const TOKEN = process.env.DISCORD_TOKEN;

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));