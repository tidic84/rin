const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "audioTracksAdd",
    execute(client, queue, tracks) {
        const embed = new EmbedBuilder()
            .setTitle(`${tracks.length} tracks queued.`)
            .setColor(client.colors.blue)
            .setFooter({
                text: `Requested by: ${tracks[0].requestedBy.username}`,
                iconURL: tracks[0].requestedBy.displayAvatarURL({ dynamic: true }),
            });

        return queue.metadata.send({ embeds: [embed] }).catch(console.error);
    },
};