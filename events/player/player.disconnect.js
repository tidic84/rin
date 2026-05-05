module.exports = {
    name: 'disconnect',
    player: true,
    execute(client, queue) {
        console.log(`[Queue] Disconnected from voice channel in guild ${queue.guild.name}`);
    }
};
