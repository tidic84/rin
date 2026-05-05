const glob = require("glob");
const { ApplicationCommandType } = require("discord.js");
const { devGuildId, testServer } = require("../config.json");

module.exports = async function loadCommands(client) {
    const commandFiles = glob.sync("./commands/**/*.js");
    const payload = [];

    for (const file of commandFiles) {
        const command = require(`../${file}`);

        if (!command.name) {
            throw new TypeError(`[ERROR][COMMANDS]: name is required for commands! (${file})`);
        }

        if (!command.execute) {
            throw new TypeError(
                `[ERROR][COMMANDS]: execute function is required for commands! (${file})`
            );
        }

        if (!command.category) {
            console.log(
                `${command.name} command will not be shown in the help command because no category is set.`
            );
        }

        const data = {
            type: ApplicationCommandType.ChatInput,
            name: command.name,
            description: command.description ?? "Empty description",
            options: command.options ?? [],
        };

        if (command.defaultMemberPermissions !== undefined) {
            data.defaultMemberPermissions = command.defaultMemberPermissions;
        }

        payload.push(data);
        delete require.cache[require.resolve(`../${file}`)];

        client.commands.set(command.name, command);
        console.log(`Command Queued: ${command.name} (${file})`);
    }

    const guilds = await client.guilds.fetch();
    let totalRegistered = 0;
    for (const partial of guilds.values()) {
        try {
            const guild = await partial.fetch();
            const registered = await guild.commands.set(payload);
            totalRegistered += registered.size;
            console.log(`[Commands] Registered ${registered.size} commands on ${guild.name} (${guild.id}).`);
        } catch (err) {
            console.error(`[Commands] Failed to register on guild ${partial.id}:`, err.message);
        }
    }

    if (guilds.size === 0) {
        console.warn("[Commands] Bot is in 0 guilds. Re-invite with applications.commands scope.");
    }

    console.log(`[--- All commands loaded! Total: ${totalRegistered} ---]`);
};