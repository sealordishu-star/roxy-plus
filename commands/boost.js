module.exports = {
    name: 'boost',
    aliases: ['loud'],
    category: 'Music',
    description: 'Enable or disable audio boost mode',
    usage: 'boost <on/off>',
    async execute(message, args, client) {
        if (!message.guild)
            return message.channel.send('```This command only works in servers```');

        const queue = client.queueManager.get(message.guild.id);
        if (!queue || !queue.nowPlaying)
            return message.channel.send('```Nothing is currently playing```');

        if (!args[0])
            return message.channel.send('```Usage: boost <on/off>```');

        const option = args[0].toLowerCase();

        try {

            if (option === 'on') {

                await client.lavalink.updatePlayerProperties(message.guild.id, {
                    filters: {
                        equalizer: [
                            { band: 0, gain: 0.05 },
                            { band: 1, gain: 0.07 },
                            { band: 2, gain: 0.1 },
                            { band: 3, gain: 0.08 },
                            { band: 4, gain: 0.05 },
                            { band: 5, gain: 0.03 },
                            { band: 6, gain: 0.02 },
                            { band: 7, gain: 0.02 },
                            { band: 8, gain: 0.01 },
                            { band: 9, gain: 0.01 },
                            { band: 10, gain: 0.01 },
                            { band: 11, gain: 0.01 },
                            { band: 12, gain: 0.01 },
                            { band: 13, gain: 0.01 },
                            { band: 14, gain: 0.01 }
                        ]
                    }
                });

                queue.boost = true;

                let response = '```\n';
                response += '╭─[ BOOST ENABLED ]─╮\n\n';
                response += '  🔊 Enhanced Loudness Mode\n';
                response += '  🎧 Clearer & Fuller Sound\n';
                response += '\n╰────────────────────────╯\n```';

                return message.channel.send(response);

            } else if (option === 'off') {

                await client.lavalink.updatePlayerProperties(message.guild.id, {
                    filters: {}
                });

                queue.boost = false;

                let response = '```\n';
                response += '╭─[ BOOST DISABLED ]─╮\n\n';
                response += '  🔉 Back To Normal Audio\n';
                response += '\n╰────────────────────────╯\n```';

                return message.channel.send(response);

            } else {
                return message.channel.send('```Usage: boost <on/off>```');
            }

        } catch (err) {
            console.error('[Boost Error]:', err);
            message.channel.send(`\`\`\`js\n❌ Error: ${err.message}\n\`\`\``);
        }
    },
};
