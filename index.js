const Discord = require('discord.js');
const Player = require('discord-player');
const intents = new Discord.IntentsBitField(3276799);
const client = new Discord.Client({ intents });
const eventHandler = require('./handlers/eventHandler');

const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');

client.player = new Player.Player(client, {
    leaveOnEnd: true,
    leaveOnEmpty: true,
    initialVolume: 25,
    ytdlOptions: {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})
client.player.extractors.loadDefault();
client.player.extractors.register(SpotifyExtractor, {});
client.player.extractors.register(SoundCloudExtractor, {});

client.say = require('./util/say');

require('dotenv').config();

eventHandler(client);

client.login(process.env.TOKEN);
