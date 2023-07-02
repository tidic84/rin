const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "audioTrackAdd",
    execute(client, queue, track) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Track queued - Position ${queue.node.getTrackPosition(track) + 1}` })
            .setTitle(`${track.title}`)
            .setColor(client.colors.purple)
            .setURL(`${track.url}`)
            .setThumbnail(`${track.thumbnail}`)
            .setFields([
                { name: "Author", value: `${track.author}`, inline: true },
                { name: "Duration", value: `${track.duration}`, inline: true },                
                { name: "Queue", value: `${queue.node.getTrackPosition(track) + 1}`, inline: true},
            ])
            .setFooter({
                text: `Requested by: ${track.requestedBy.username}`,
                iconURL: track.requestedBy.displayAvatarURL({ dynamic: true }),
            });
        return queue.metadata.send({ embeds: [embed] }).catch(console.error);
    },
};