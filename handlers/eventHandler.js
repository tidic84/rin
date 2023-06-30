const path = require("path")
const getAllFiles = require("../util/getAllFiles")

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a>b);
        console.log(eventFiles);
        const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

        console.log(`Loading ${eventName}`);

        if (eventName == "player") {
            for(const eventFile of eventFiles) {console.log(eventFile)}
        }
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                console.log(`Running ${eventFile}`);
                const eventFunction = require(eventFile);
                eventFunction(client, arg);
            }
        })
    }
}