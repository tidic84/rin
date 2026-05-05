const { useQueue, useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Play music!',
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

        await interaction.deferReply({ ephemeral: true }).catch(() => {});

        console.log('[Play Command] Searching for:', query);
        const searchResult = await player
            .search(query, { requestedBy: interaction.user })
            .catch((error) => {
                console.error('[Play Command] Search error:', error);
                return null;
            });

        console.log('[Play Command] Search result:', {
            hasResult: !!searchResult,
            hasTracks: searchResult?.hasTracks(),
            tracksCount: searchResult?.tracks?.length || 0
        });

        if (!searchResult?.hasTracks())
            return client.say.wrong(client, interaction, `No track was found for ${query}!`);

        try {
            await player.play(channel, searchResult, {
                nodeOptions: {
                    metadata: interaction.channel,
                    connectionTimeout: 60000,
                    leaveOnEnd: false,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 60000,
                    bufferingTimeout: 3000,
                    selfDeaf: true,
                    disableBiquad: true,
                    disableEqualizer: true,
                    disableFilters: true,
                    disableResampler: true,
                    disableVolume: true,
                    disableCompressor: true,
                    disableReverb: true,
                }
            });
            return interaction.editReply({ content: `Playing ${searchResult.tracks[0].title}` }).catch(() => {});
        } catch (e) {
            console.log('[Play Command] Error:', e.message);
            console.log('[Play Command] Stack:', e.stack);
            return client.say.error(client, interaction, `Something went wrong: ${e.message}`);
        }
    },
}