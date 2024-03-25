const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "help",
    description: "Reply full list of commands",
    category: "misc",
    async execute(client, interaction) {
        const commands = client.commands.filter(c => c.category);
        const categoryList = [...new Set(commands.map(c => c.category))];
        let Fields = [];
        const embed = new EmbedBuilder()
            .setTitle("Commands List:")
            .setColor(client.colors.purple)
        
        
        for (const category of categoryList) {
            Fields.push({
                name: `__${category.slice(0,1).toUpperCase()}${category.slice(1)}__`,
                value: `${commands.filter(cat => cat.category === category.toLowerCase()).map(cmd => `\`${cmd.name}\``).join(' | ')}`
            });
        };
        embed.setFields(Fields);
        return interaction.reply({ embeds: [embed] });
    },
};