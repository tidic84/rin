const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const banlist = require("../../util/banlist");

module.exports = {
    name: "banlist",
    description: "Gérer la liste des mots interdits (mute auto 30s).",
    category: "moderation",
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers.toString(),
    options: [
        {
            name: "add",
            description: "Ajouter un mot à la banlist.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "mot",
                    description: "Le mot à interdire.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            description: "Retirer un mot de la banlist.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "mot",
                    description: "Le mot à retirer.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: "list",
            description: "Afficher tous les mots interdits.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "duration",
            description: "Configurer la durée du mute (en secondes).",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "secondes",
                    description: "Durée en secondes (1 à 2419200).",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                    max_value: 2419200,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
            return client.say.wrong(client, interaction, "Tu n'as pas la permission de gérer la banlist.");
        }

        const sub = interaction.options.getSubcommand();

        if (sub === "add") {
            const word = interaction.options.getString("mot", true);
            const result = banlist.add(word);
            if (!result.ok) {
                if (result.reason === "exists") {
                    return client.say.wrong(client, interaction, `\`${banlist.normalize(word)}\` est déjà dans la banlist.`);
                }
                return client.say.wrong(client, interaction, "Mot invalide.");
            }
            return client.say.success(client, interaction, `\`${result.word}\` ajouté à la banlist.`);
        }

        if (sub === "remove") {
            const word = interaction.options.getString("mot", true);
            const result = banlist.remove(word);
            if (!result.ok) {
                return client.say.wrong(client, interaction, `\`${banlist.normalize(word)}\` n'est pas dans la banlist.`);
            }
            return client.say.success(client, interaction, `\`${result.word}\` retiré de la banlist.`);
        }

        if (sub === "list") {
            const words = banlist.list();
            const duration = Math.round(banlist.getMuteDuration() / 1000);
            const embed = new EmbedBuilder()
                .setTitle("Banlist")
                .setColor(client.colors.purple)
                .setDescription(words.length ? words.map((w) => `• \`${w}\``).join("\n") : "_Aucun mot interdit._")
                .setFooter({ text: `Durée du mute: ${duration}s` });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (sub === "duration") {
            const seconds = interaction.options.getInteger("secondes", true);
            banlist.setMuteDuration(seconds * 1000);
            return client.say.success(client, interaction, `Durée du mute mise à jour: ${seconds}s.`);
        }
    },
};
