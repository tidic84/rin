module.exports = {
    name: 'emptyQueue',
    player: true,
    execute(client, queue) {
        console.log(`[Queue] Queue became empty for guild ${queue.guild.name}`);
        console.log(`[Queue] Last track duration: ${queue.node.getTimestamp()?.current.label || 'unknown'}`);
    }
};
