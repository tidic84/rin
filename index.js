const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);
const client = new Discord.Client({ intents });
const loadCommands = require('./loaders/loadCommands');

require('dotenv').config();

client.on("ready", async () => {
    console.log(`${client.user.tag} connected!`);
}) 

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'ping') {
        callback: async (client, interaction) => {
            await interaction.deferReply();

            const reply = await interaction.fetchReply();
            const ping = reply.createdTimestamp - interaction.createdTimestamp - interaction.createdTimestamp;

            interaction.editReply(`Latency: ${ping}ms | API Latency: ${client.ws.ping}ms`)
        }
    };
})

client.login(process.env.TOKEN);
