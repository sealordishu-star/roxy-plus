module.exports = {
    name: 'resume',
    aliases: ['rs'],
    description: 'Resume the paused song',
    async execute(message, args, client) {
        if (!message.guild)
            return message.channel.send('```This command only works in servers```');

        const queue = client.queueManager.get(message.guild.id);

        if (!queue || !queue.nowPlaying) {
            return message.channel.send('```Nothing is currently playing```');
        }

        if (!queue.paused) {
            return message.channel.send('```Music is not paused```');
        }

        try {
            // Resume Lavalink player
            await client.lavalink.updatePlayerProperties(message.guild.id, {
                paused: false
            });

            queue.paused = false;

            let response = '```\n';
            response += '╭─[ MUSIC RESUMED ]─╮\n\n';
            response += `  ▶️ ${queue.nowPlaying.info.title}\n`;
            response += '\n╰────────────────────────────╯\n```';

            message.channel.send(response);

            if (message.deletable) message.delete().catch(() => { });

        } catch (err) {
            console.error('[Resume Error]:', err);
            message.channel.send(`\`\`\`js\n❌ Error: ${err.message}\n\`\`\``);
        }
    },
};
