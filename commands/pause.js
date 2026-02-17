module.exports = {
    name: 'pause',
    aliases: ['ps'],
    description: 'Pause the currently playing song',
    async execute(message, args, client) {
        if (!message.guild) 
            return message.channel.send('```This command only works in servers```');

        const queue = client.queueManager.get(message.guild.id);

        if (!queue || !queue.nowPlaying) {
            return message.channel.send('```Nothing is currently playing```');
        }

        if (queue.paused) {
            return message.channel.send('```Music is already paused```');
        }

        try {
            // Pause Lavalink player
            await client.lavalink.updatePlayerProperties(message.guild.id, {
                paused: true
            });

            queue.paused = true;

            let response = '```\n';
            response += '╭─[ MUSIC PAUSED ]─╮\n\n';
            response += `  ⏸️ ${queue.nowPlaying.info.title}\n`;
            response += '\n╰────────────────────────────╯\n```';

            message.channel.send(response);

            if (message.deletable) message.delete().catch(() => { });

        } catch (err) {
            console.error('[Pause Error]:', err);
            message.channel.send(`\`\`\`js\n❌ Error: ${err.message}\n\`\`\``);
        }
    },
};
