const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { exec } = require('child_process');
const wol = require('wakeonlan')

module.exports = {
    name: "server",
    description: "Minecraft server commands",
    category: "minecraft",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "start",
            description: "Start the minecraft server remotely",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "stop",
            description: "Stop the minecraft server remotely",
        },
    ],
    async execute(client, interaction) {
        if (interaction.options.getSubcommand() == "start") {
            interaction.reply("Server started !");
            wol(process.env.SERVER_MAC).then(() => {
                console.log('wol sent!')
            })
        } else if (interaction.options.getSubcommand() == "stop") {
            interaction.reply("Server stopped !");

            const serverAddress = process.env.SERVER_ID;
            const command = 'sudo shutdown now';

            exec(`ssh ${serverAddress} "${command}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur : ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Erreur stderr : ${stderr}`);
                    return;
                }
                console.log(`Sortie : ${stdout}`);
            });
        }
    },
};