const { BaseExtractor } = require('discord-player');
const playDL = require('play-dl');
const ytdl = require('ytdl-core-discord');

class YouTubePlayDLExtractor extends BaseExtractor {
    static identifier = 'com.custom.youtube-playdl';

    async validate(query, context) {
        // Handle YouTube URLs and general searches
        if (typeof query === 'string') {
            // Don't handle if it's clearly for another platform
            if (query.includes('soundcloud.com') ||
                query.includes('spotify.com') ||
                query.includes('apple.com')) {
                return false;
            }
            return true; // Handle everything else (YouTube URLs and searches)
        }
        return false;
    }

    async handle(query, context) {
        try {
            console.log('[YouTube Extractor] Searching for:', query);

            // Check if it's a URL or search query
            const isURL = query.startsWith('http://') || query.startsWith('https://');
            let info;

            if (isURL && (query.includes('youtube.com') || query.includes('youtu.be'))) {
                // Direct YouTube URL
                info = await playDL.video_info(query);
                info = info.video_details;
            } else {
                // Search YouTube
                const searchResults = await playDL.search(query, {
                    limit: 1,
                    source: { youtube: 'video' }
                });

                if (!searchResults || searchResults.length === 0) {
                    console.log('[YouTube Extractor] No results found');
                    return this.createResponse(null);
                }

                info = searchResults[0];
            }

            console.log('[YouTube Extractor] Found:', info.title);

            const track = {
                title: info.title,
                author: info.channel?.name || 'Unknown',
                url: info.url,
                thumbnail: info.thumbnails?.[0]?.url || null,
                duration: this.formatDuration(info.durationInSec),
                views: info.views || 0,
                source: 'youtube',
                engine: info,
                queryType: 'youtubeVideo'
            };

            return this.createResponse(null, [track]);
        } catch (error) {
            console.error('[YouTube Extractor] Error:', error);
            return this.createResponse(null);
        }
    }

    async stream(info) {
        try {
            const url = info.url || info.raw?.url;

            console.log('[YouTube Extractor] Creating ytdl-core-discord stream for:', url);

            if (!url) {
                throw new Error('No URL found in track info');
            }

            // Use ytdl-core-discord which returns opus stream optimized for Discord
            console.log('[YouTube Extractor] Calling ytdl-core-discord...');
            const stream = await ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            });

            console.log('[YouTube Extractor] Stream created successfully (Opus format)');
            return stream;
        } catch (error) {
            console.error('[YouTube Extractor] Stream error:', error.message);
            throw error;
        }
    }

    formatDuration(seconds) {
        if (!seconds) return '00:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

module.exports = YouTubePlayDLExtractor;
