module.exports = {
    name: "ping2",
    description: "Ping? Pong!",
    category: "misc",
    async execute(client, interaction) {
        await interaction.reply("Pinging...").catch(console.error);
        return interaction.editReply(`💓: ${Math.round(client.ws.ping)} ms\n⏱️: ${Date.now() - interaction.createdTimestamp} ms`);
    },
};