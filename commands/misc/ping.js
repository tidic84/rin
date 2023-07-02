module.exports = {
    name: "ping",
    description: "Ping? Pong!",
    category: "misc",
    async execute(bot, interaction) {
        await interaction.reply("Pinging...").catch(console.error);
        return interaction.editReply(`💓: ${Math.round(bot.ws.ping)} ms\n⏱️: ${Date.now() - interaction.createdTimestamp} ms`);
    },
};