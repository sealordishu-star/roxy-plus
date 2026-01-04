const { joinVoiceChannel } = require('@discordjs/voice');

function createIdentifier(query) {
    return /^(https?:\/\/|www\.)/i.test(query) ? query : `ytmsearch:${query}`;
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

async function playLogic(client, guildId, query) {
    const identifier = createIdentifier(query);
    let result;
    try {
        result = await client.lavalink.loadTracks(identifier);
    } catch (e) {
        return { success: false, reason: e.message };
    }

    if (result.loadType === 'empty') return { success: false, reason: 'No results found' };
    if (result.loadType === 'error') return { success: false, reason: result.data.message || 'Lavalink Error' };

    let track;
    if (result.loadType === 'track') track = result.data;
    else if (result.loadType === 'playlist') track = result.data.tracks[0];
    else if (result.loadType === 'search') track = result.data[0];

    if (!track) return { success: false, reason: 'No track found' };

    let queue = client.queueManager.get(guildId);
    if (!queue) {
        queue = client.queueManager.create(guildId);
    }

    if (queue.nowPlaying) {
        client.queueManager.addSong(guildId, track);
        return { success: true, type: 'queue', track };
    } else {
        // Assume bot is joined. Or we fail if no voiceState.
        const voiceState = client.voiceStates[guildId];
        if (!voiceState || !voiceState.token) {
            return { success: false, reason: 'Bot not connected to voice' };
        }

        queue.nowPlaying = track;
        queue.position = 0;
        queue.lastUpdate = Date.now();

        await client.lavalink.updatePlayer(guildId, track, voiceState, {
            volume: queue.volume,
            filters: queue.filters
        });

        return { success: true, type: 'play', track };
    }
}

module.exports = {
    name: 'play',
    description: 'Play a song from YouTube or search query',
    playLogic,
    async execute(message, args, client) {
        if (!message.guild) return message.channel.send('```This command only works in servers```');

        const vc = message.member?.voice?.channel;
        if (!vc) return message.channel.send('```You need to be in a voice channel```');
        if (!args.length) return message.channel.send('```Please provide a song name or URL```');

        try {
            // Join Voice
            joinVoiceChannel({
                channelId: vc.id,
                guildId: vc.guild.id,
                adapterCreator: vc.guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use shared logic
            const result = await playLogic(client, message.guild.id, args.join(' '));

            if (!result.success) {
                return message.channel.send(`\`\`\`Error: ${result.reason}\`\`\``);
            }

            if (result.type === 'queue') {
                let response = '```\n';
                response += '╭─[ ADDED TO QUEUE ]─╮\n\n';
                response += `  Title: ${result.track.info.title}\n`;
                response += `  Artist: ${result.track.info.author}\n`;
                response += `  Position: ${client.queueManager.get(message.guild.id).songs.length}\n`;
                response += '\n╰──────────────────────────────────╯\n```';
                message.channel.send(response);
            } else {
                let response = '```\n';
                response += '╭─[ NOW PLAYING ]─╮\n\n';
                response += `  🎵 ${result.track.info.title}\n`;
                response += `  👤 ${result.track.info.author}\n`;
                response += `  ⏱️ ${formatDuration(result.track.info.length)}\n`;
                response += '\n╰──────────────────────────────────╯\n```';
                message.channel.send(response);

                // Set text channel for queue if new
                const queue = client.queueManager.get(message.guild.id);
                if (queue) queue.textChannel = message.channel;
            }

            if (message.deletable) message.delete().catch(() => { });

        } catch (err) {
            console.error('[Play Error]:', err);
            message.channel.send(`\`\`\`js\n❌ Error: ${err.message}\n\`\`\``);
        }
    },
};
