module.exports = {
    name: 'volume',
    aliases: ['vol', 'v'],
    category: 'Music',
    description: 'Set volume (0-1000)',
    usage: 'volume <0-1000>',
    async execute(message, args, client) {
        if (!message.guild) return;

        const queue = client.queueManager.get(message.guild.id);
        if (!queue) {
            return message.channel.send('bro no music playing!');
        }

        if (!args[0]) {
            return message.channel.send(`Current Volume: **${queue.volume || 100}%**`);
        }

        const vol = parseInt(args[0]);
        if (isNaN(vol) || vol < 0 || vol > 1000) {
            return message.channel.send('provide a volume between 0-1000.');
        }

        queue.volume = vol;

        try {
            await client.lavalink.updatePlayerProperties(message.guild.id, {
                volume: vol
            });

            // Professional volume bar (accurate for 0-1000)
            const totalBars = 20;
            const progress = Math.round((vol / 1000) * totalBars);
            const empty = totalBars - progress;

            const volumeBar = '▰'.repeat(progress) + '▱'.repeat(empty);

            let response = '```js\n';
            response += `╭─── 🔊 Volume Control ───╮\n`;
            response += `│\n`;
            response += `│  ${volumeBar}\n`;
            response += `│  ${vol}%\n`;
            response += `│\n`;
            response += `╰─────────────────────────╯\n`;
            response += '```';

            await message.channel.send(response);

        } catch (err) {
            console.error('[Volume Error]:', err);
            await message.channel.send('Failed to set volume.');
        }
    }
};
