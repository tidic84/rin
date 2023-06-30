const {useQueue, useMainPlayer} = require('discord-player');

module.exports = {
    name: "stop",
    description: "Stop the playback.",

    callback: async (client, interaction) => {
        useQueue(interaction.guild.id).delete();
        return client.say.successEmbed(interaction, "Stopped the playback.");
    },
};