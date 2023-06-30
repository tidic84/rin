const {useQueue, useMainPlayer} = require('discord-player');

const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Play music!',
    options: [
        {
            name: 'music',
            description: 'The music name.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const query = interaction.options.getString("music", true);
    
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);
    
        const channel = interaction.member?.voice?.channel;
    
        if (!channel) return client.say.wrongEmbed(interaction, "You have to join a voice channel first.");
    
        if (queue && queue.channel.id !== channel.id)
        return client.say.wrongEmbed(interaction, "I'm already playing in a different voice channel!");
    
        if (!channel.viewable)
        return client.say.wrongEmbed(interaction, "I need `View Channel` permission.");
    
        if (!channel.joinable)
        return client.say.wrongEmbed(interaction, "I need `Connect Channel` permission.");
    
        if (channel.full)
        return client.say.wrongEmbed(interaction, "Can't join, the voice channel is full.");
    
        if (interaction.member.voice.deaf)
        return client.say.wrongEmbed(interaction, "You cannot run this command while deafened.");
    
        if (interaction.guild.members.me?.voice?.mute)
        return client.say.wrongEmbed(interaction, "Please unmute me before playing.");
    
        const searchResult = await player
        .search(query, { requestedBy: interaction.user })
        .catch(() => null);
    
        if (!searchResult?.hasTracks())
        return client.say.wrongEmbed(interaction, `No track was found for ${query}!`);
    
        try {
        await player.play(channel, searchResult, {
            nodeOptions: {
            metadata: interaction.channel,
            },
        });
    
        return client.say.successEmbed(interaction, `Loading your track`, false);
        } catch (e) {
        return client.say.errorEmbed(interaction, `Something went wrong: ${e.message}`);
        }
    },
}