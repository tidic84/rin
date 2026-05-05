const { BaseExtractor } = require('discord-player');
const playDL = require('play-dl');

class PlayDLSoundCloudExtractor extends BaseExtractor {
    static identifier = 'com.custom.playdl-soundcloud';

    async validate(query, context) {
        // Only handle SoundCloud URLs or searches
        if (typeof query === 'string') {
            return query.includes('soundcloud.com') || query.includes('snd.sc');
        }
        return false;
    }

    async handle(query, context) {
        // Only process if it's a SoundCloud URL
        if (!query.includes('soundcloud.com') && !query.includes('snd.sc')) {
            console.log('[Custom Extractor] Not a SoundCloud URL, skipping:', query);
            return this.createResponse(null);
        }

        try {
            console.log('[Custom Extractor] Handling SoundCloud URL with play-dl:', query);

            const info = await playDL.soundcloud(query);

            if (!info) {
                console.log('[Custom Extractor] No info found');
                return this.createResponse(null);
            }

            const track = {
                title: info.name,
                author: info.user?.name || 'Unknown',
                url: info.url,
                thumbnail: info.thumbnail,
                duration: this.msToTime(info.durationInMs),
                views: info.playCount || 0,
                source: 'soundcloud',
                engine: info,
                queryType: 'soundcloudTrack'
            };

            return this.createResponse(null, [track]);
        } catch (error) {
            console.error('[Custom Extractor] Error:', error);
            return this.createResponse(null);
        }
    }

    async stream(info) {
        try {
            console.log('[Custom Extractor] Creating stream for:', info.url);
            const stream = await playDL.stream(info.url);

            return stream.stream;
        } catch (error) {
            console.error('[Custom Extractor] Stream error:', error);
            throw error;
        }
    }

    msToTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

module.exports = PlayDLSoundCloudExtractor;
