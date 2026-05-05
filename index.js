require("dotenv").config();

process.env.YOUTUBE_DL_FILE = "yt-dlp_linux";
process.env.YOUTUBE_DL_FILENAME = "yt-dlp_linux";

const { Client, Collection, GatewayIntentBits } = require("discord.js");

const { Player } = require("discord-player");

function silenceYoutubei() {
    const candidates = [
        "youtubei.js",
        "discord-player-youtubei/node_modules/youtubei.js",
    ];
    for (const c of candidates) {
        try {
            const { Log } = require(c);
            Log.setLevel(Log.Level.ERROR);
        } catch {}
    }
    try {
        const { Log } = require("discord-player-youtubei");
        if (Log?.setLevel) Log.setLevel(0);
    } catch {}
}
silenceYoutubei();

(() => {
    const voip = require("discord-voip");
    const original = voip.createAudioPlayer;
    voip.createAudioPlayer = function patchedCreateAudioPlayer(options = {}) {
        return original({
            ...options,
            behaviors: {
                noSubscriber: "pause",
                maxMissedFrames: 50,
                ...options.behaviors,
            },
        });
    };
})();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
    ],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.say = require("./util/reply");
client.colors = require("./util/colors");

const player = new Player(client);

// Register YouTubeI extractor — use yt-dlp under the hood (native API is rate-limited at ~1MB on this server)
(async () => {
    const { YoutubeiExtractor } = require('discord-player-youtubei');
    try {
        await player.extractors.register(YoutubeiExtractor, {
            useYoutubeDL: true,
            logLevel: "NONE",
        });
        console.log('[Player] YoutubeiExtractor registered (yt-dlp mode).');
    } catch (e) {
        console.error('[Player] YoutubeiExtractor register failed:', e.message);
    }
})();

player.extractors.loadMulti(require("@discord-player/extractor").DefaultExtractors).then(() => {
    console.log('[Player] Default extractors loaded.');
}).catch((error) => {
    console.error('[Player] Failed to load default extractors:', error);
});

// Add debug and error events (disabled to avoid too much output)
// player.events.on('debug', (queue, message) => {
//     console.log(`[Player Debug] ${message}`);
// });

player.events.on('error', (queue, error) => {
    console.error(`[Player Error] in guild ${queue.guild.name}:`, error.message);
    console.error('Stack:', error.stack);
});

player.events.on('playerError', (queue, error) => {
    console.error(`[Player Error] in guild ${queue.guild.name}:`, error.message);
    console.error('Stack:', error.stack);
});

player.events.on('playerStart', (queue, track) => {
    console.log(`[Player] Started playing: ${track.title}`);
});

player.events.on('playerFinish', (queue, track) => {
    console.log(`[Player] Finished playing: ${track.title}`);
    console.log(`[Player] Final playback duration: ${queue.node.getTimestamp()?.current.label || 'unknown'}`);
});

require("./handlers/eventHandler")(client);

client.login(process.env.TOKEN);
