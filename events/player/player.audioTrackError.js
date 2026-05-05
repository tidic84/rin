module.exports = {
    name: 'audioTrackError',
    player: true,
    execute(client, queue, track, error) {
        console.error(`[Track Error] Failed to play track "${track.title}":`, error.message);
        console.error('Error details:', error);

        // Try to skip to next track
        if (queue.tracks.data.length > 0) {
            queue.node.skip();
        }
    }
};
