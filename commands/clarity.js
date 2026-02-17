module.exports = {
    name: 'clarity',
    category: 'Music',
    description: 'Improve vocal clarity',
    async execute(message, args, client) {
        if (!message.guild)
            return message.channel.send('```Server only command```');

        const queue = client.queueManager.get(message.guild.id);
        if (!queue || !queue.nowPlaying)
            return message.channel.send('```Nothing is playing```');

        try {
            await client.lavalink.updatePlayerProperties(message.guild.id, {
                filters: {
                    equalizer: [
                        { band: 0, gain: -0.02 },
                        { band: 1, gain: 0.00 },
                        { band: 2, gain: 0.05 },
                        { band: 3, gain: 0.08 },
                        { band: 4, gain: 0.10 },
                        { band: 5, gain: 0.07 },
                        { band: 6, gain: 0.04 },
                        { band: 7, gain: 0.02 },
                        { band: 8, gain: 0.01 },
                        { band: 9, gain: 0.00 },
                        { band: 10, gain: 0.00 },
                        { band: 11, gain: 0.00 },
                        { band: 12, gain: 0.00 },
                        { band: 13, gain: 0.00 },
                        { band: 14, gain: 0.00 }
                    ]
                }
            });

            message.channel.send('```Clarity mode enabled```');

        } catch (err) {
            console.error(err);
            message.channel.send('```Failed to apply filter```');
        }
    }
};
