const glob = require("glob");

module.exports = function loadEvents(client) {
    const eventFiles = glob.sync("./events/**/*.js");

    for (const file of eventFiles) {

        const event = require(`../${file}`);

        let type = "client";
        if (file.includes("player.")) type = "player";

        if (!event.execute) {
            throw new TypeError(`[ERROR]: execute function is required for events! (${file})`);
        }

        if (!event.name) {
            throw new TypeError(`[ERROR]: name is required for events! (${file})`);
        }
        if (type === "player") {
            const { useMainPlayer } = require("discord-player");
            const player = useMainPlayer();

            player.events.on(event.name, event.execute.bind(null, client));
        } else if (event.once) {
            client.once(event.name, event.execute.bind(null, client));
        } else {
            client.on(event.name, event.execute.bind(null, client));
        }
        delete require.cache[require.resolve(`../${file}`)];

        // debug
        console.log(`Event Loaded ${type}: ${event.name}`);
    }
    console.log("[--- All events loaded! ---]")
};