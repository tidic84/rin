require("dotenv").config();

const { Client, Collection, GatewayIntentBits } = require("discord.js");

const { Player } = require("discord-player");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.say = require("./util/reply");
client.colors = require("./util/colors");

const player = Player.singleton(client);
player.extractors.loadDefault();

require("./handlers/eventHandler")(client);

client.login(process.env.TOKEN);
