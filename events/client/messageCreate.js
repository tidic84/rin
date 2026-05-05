const { Events, PermissionsBitField } = require("discord.js");
const banlist = require("../../util/banlist");

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if (!message.inGuild()) return;
        if (message.author.bot) return;
        if (!message.member) return;

        const match = banlist.findMatch(message.content);
        if (!match) return;

        const me = message.guild.members.me;
        if (!me) return;

        const channelPerms = message.channel.permissionsFor(me);
        if (channelPerms?.has(PermissionsBitField.Flags.ManageMessages)) {
            await message.delete().catch(() => {});
        }

        if (!me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            console.warn("[Banlist] Missing ModerateMembers permission");
            return;
        }

        if (message.member.id === message.guild.ownerId) return;
        if (me.roles.highest.comparePositionTo(message.member.roles.highest) <= 0) return;
        if (!message.member.moderatable) return;

        const duration = banlist.getMuteDuration();
        try {
            await message.member.timeout(duration, `Mot interdit détecté: ${match}`);
            const seconds = Math.round(duration / 1000);
            await message.channel
                .send(`<@${message.author.id}> a été mute ${seconds}s pour avoir utilisé un mot interdit.`)
                .catch(() => {});
        } catch (err) {
            console.error("[Banlist] Timeout failed:", err.message);
        }
    },
};
