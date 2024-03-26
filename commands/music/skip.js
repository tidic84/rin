const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    name: "skip",
    description: "Skip current track",
    category: "music",
    options: [
        {
            name: 'position',
            description: 'To skip a specific number of tracks in the queue.',
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
    ],
    execute(client, interaction, queue) {
        const number = interaction.options.getInteger("position") ?? 1;

        if (queue.size < 1 && queue.repeatMode !== 3)
        return client.say.error(client, interaction, "The queue has no more track.");
        
        if(number <= 1) queue.node.skip();
        else {
            queue.node.skipTo(number - 1);
        }
        
        

        if(number <= 1) return client.say.success(client, interaction, "Skipped the current track.", false);
        else return client.say.success(client, interaction, `Skipped \`${number}\` tracks.`, false);
    },
};