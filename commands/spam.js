module.exports = {
    name: 'spam',
    description: 'Spam a message (1-100 times, fast mode)',
    async execute(message, args, client) {

        if (!message.guild)
            return message.channel.send('This command only works in servers');

        const count = parseInt(args[0]);
        if (isNaN(count)  count < 1  count > 100)
            return message.channel.send('Choose a number between 1 and 100');

        const text = args.slice(1).join(' ');
        if (!text)
            return message.channel.send('Please provide a message');

        try {
            for (let i = 0; i < count; i++) {
                await message.channel.send(text);
                await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
            }
        } catch (err) {
            console.error('[Spam Error]:', err);
            message.channel.send('Stopped due to rate limit');
        }
    }
};
