module.exports = {
    name: 'help',
    category: 'Utility',
    description: 'List commands or categories',
    async execute(message, args, client) {
        const commands = Array.from(client.commands.values());
        const categories = {};

        // Sort commands into categories
        commands.forEach(cmd => {
            let cat = cmd.category || 'Utility';
            // Auto-assign Music category for known commands if property missing
            if (['play', 'stop', 'skip', 'queue', 'join', 'left'].includes(cmd.name)) cat = 'Music';

            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        });

        // 1. Show Specific Category
        if (args[0]) {
            const catName = Object.keys(categories).find(c => c.toLowerCase() === args[0].toLowerCase());
            if (catName) {
                let msg = '```\n';
                msg += `╭─[ ${catName.toUpperCase()} COMMANDS ]─╮\n\n`;
                categories[catName].forEach(cmd => {
                    msg += `  • ${cmd.name.padEnd(10)} - ${cmd.description || 'No description'}\n`;
                });
                msg += '\n╰──────────────────────────────────╯\n```';
                return message.reply(msg);
            } else {
                return message.reply('Category not found. Type !help for list.');
            }
        }

        // 2. Show All Categories (Main Menu)
        let helpMessage = '```\n';
        helpMessage += '╭─[ ROXY+ HELP ]─╮\n\n';
        helpMessage += '  Available Categories:\n\n';

        Object.keys(categories).forEach(cat => {
            helpMessage += `  📂 ${cat} (Type !help ${cat.toLowerCase()})\n`;
        });

        helpMessage += '\n╰──────────────────────────────────╯\n```';
        message.reply(helpMessage);
    }
};
