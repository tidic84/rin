const { EmbedBuilder, CommandInteraction} = require("discord.js");

function error(client, interaction, text, ephemeral = true) {
    const eEmbed = new EmbedBuilder()
        .setDescription(text)
        .setColor(client.colors.red);

    if (interaction.deferred) return interaction.editReply({ embeds: [eEmbed] }).catch(console.error);
    if (interaction.replied) return interaction.followUp({ ephemeral, embeds: [eEmbed] }).catch(console.error);

    return interaction.reply({ ephemeral, embeds: [eEmbed] }).catch(console.error);
}

function wrong(client, interaction, text) {
    const wEmbed = new EmbedBuilder()
        .setDescription(text)
        .setColor(client.colors.yellow);

    if (interaction.deferred) return interaction.editReply({ embeds: [wEmbed] }).catch(console.error);
    if (interaction.replied) return interaction.followUp({ ephemeral: true, embeds: [wEmbed] }).catch(console.error);

    return interaction.reply({ ephemeral: true, embeds: [wEmbed] }).catch(console.error);
}

function success(client, interaction, text, ephemeral = false) {
    const sEmbed = new EmbedBuilder()
        .setDescription(text)
        .setColor(client.colors.green);
    if (interaction.deferred) return interaction.editReply({ embeds: [sEmbed] }).catch(console.error);
    if (interaction.replied) return interaction.followUp({ ephemeral, embeds: [sEmbed] }).catch(console.error);
    return interaction.reply({ ephemeral, embeds: [sEmbed] }).catch(console.error);
}
module.exports = {
    error,
    wrong,
    success
}