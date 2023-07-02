module.exports = {
    name: "skip",
    description: "Skip current track",
    category: "music",
    execute(client, interaction, queue) {
        if (queue.size < 1 && queue.repeatMode !== 3)
        return client.say.error(client, interaction, "The queue has no more track.");

        queue.node.skip();

        return client.say.success(client, interaction, "Skipped the current track.", false);
    },
};