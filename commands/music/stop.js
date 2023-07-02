const {useQueue, useMainPlayer} = require('discord-player');

module.exports = {
    name: "stop",
    category: 'music',
    description: "Stop the playback.",

    async execute(client, interaction) {
        useQueue(interaction.guild.id).delete();
        return client.say.success(client, interaction, "Stopped the playback.");
    },
};