const { Events, ActivityType } = require("discord.js");
const { exec } = require('child_process');
let serverState = false;
let previousServerState = false;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const channelId = process.env.CHANNEL_ID; // Remplacez par l'ID de votre canal
        const channel = await client.channels.fetch(channelId);

        setInterval(() => {
            exec(`nc -vz ${process.env.SERVER_IP} 25565`, (error, stdout, stderr) => {
                if (error) {
                    serverState = false;
                } else {
                    serverState = true;
                }

                if (previousServerState !== null && previousServerState !== serverState) {
                    console.log(serverState ? 'Le serveur Minecraft est en ligne!' : 'Le serveur Minecraft est hors ligne!')
                    const message = serverState ? 'Le serveur Minecraft est en ligne!' : 'Le serveur Minecraft est hors ligne!';
                    channel.send(message);
                }

                previousServerState = serverState;
            });
        }, 2000);
    },
};