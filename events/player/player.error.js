module.exports = {
    name: 'error',
    player: true,
    execute(client, queue, error) {
        console.error(`[Player Error] in guild ${queue.guild.name}:`, error);
    }
};
