const {useQueue, useMainPlayer} = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    name: 'playnow',
    description: 'Add the track on top of the queue.',
    category: 'music',
    options: [
        {
            name: 'music',
            description: 'The music name.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async execute(client, interaction) {
    
        const query = interaction.options.getString("music", true);
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);
        const channel = interaction.member?.voice?.channel;
    
        if (!channel) return client.say.wrong(client, interaction, "You have to join a voice channel first.");
        if (queue && queue.channel.id !== channel.id) return client.say.wrong(client, interaction, "I'm already playing in a different voice channel!");
        if (!channel.viewable) return client.say.wrong(client, interaction, "I need `View Channel` permission.");
        if (!channel.joinable) return client.say.wrong(client, interaction, "I need `Connect Channel` permission.");
        if (channel.full) return client.say.wrong(client, interaction, "Can't join, the voice channel is full.");
        if (interaction.member.voice.deaf) return client.say.wrong(client, interaction, "You cannot run this command while deafened.");
        if (interaction.guild.members.me?.voice?.mute) return client.say.wrong(client, interaction, "Please unmute me before playing.");
    
        const searchResult = await player
        .search(query, { requestedBy: interaction.user })
        .catch(() => null);
    
        if (!searchResult?.hasTracks())
        return client.say.wrong(client, interaction, `No track was found for ${query}!`);
    
        try {
            await queue.insertTrack(searchResult.tracks[0], 0);
            return interaction.reply({ephemeral: true, content: `Playing ${searchResult.tracks[0].title}`});
        } catch (e) {
            console.log(e)
            return client.say.error(client, interaction, `Something went wrong: ${e.message}`);
        }
    },
}