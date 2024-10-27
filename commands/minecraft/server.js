const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

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
            interaction.reply("Start");
        } else if (interaction.options.getSubcommand() == "stop") {
            interaction.reply("Stop");
        }
    },
};