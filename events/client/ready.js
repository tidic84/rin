const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // initializing commands
        await require("../../handlers/commandHandler")(client);
        console.log("Rin is ready!");

    },
};