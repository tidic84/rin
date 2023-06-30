const { testServer } = require("../../config.json")
const getLocalCommands = require("../../util/getLocalCommands");
const getApplicationCommands = require("../../util/getApplicationCommands");
const areCommandsDifferent = require("../../util/areCommandsDifferent");

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(
            client
        );

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑 Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                    description,
                    options,
                    });

                    console.log(`🔁 Edited command "${name}".`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(
                    `⏩ Skipping registering command "${name}" as it's set to delete.`
                    );
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                console.log(`👍 Registered command "${name}."`);
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
};