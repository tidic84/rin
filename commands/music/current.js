const {useQueue, useMainPlayer} = require('discord-player');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "current",
    category: 'music',
    description: "Show the current track.",

    async execute(client, interaction, queue) {
        const track = queue.currentTrack;

        if (!queue || !queue.currentTrack) return client.say.wrong(client, interaction, "No music is being played on this server.");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Current Track` })
            .setTitle(`${track.title}`)
            .setColor(client.colors.purple)
            .setURL(`${track.url}`)
            .setThumbnail(`${track.thumbnail}`)
            .setFields([
                { name: "Author", value: `${track.author}`, inline: true },
                { name: "Duration", value: `${track.duration}`, inline: true },                
            ])
            .setFooter({
                text: `Requested by: ${track.requestedBy.username}`,
                iconURL: track.requestedBy.displayAvatarURL({ dynamic: true }),
            });
        return interaction.reply({ ephemeral: true, embeds: [embed] }).catch(console.error);
    },
};