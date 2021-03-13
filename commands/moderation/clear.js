module.exports.info = {
    name: 'clear',
    category: 'moderation',
    usage: '$clear <amount>',
    short_description: 'Clear messages',
    help: {
        enabled: true,
        title: 'Clear Messages',
        aliases: ['purge'],
        description: 'Clear a certain amount of messages (max 100)',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		if (!msg.member.permissions.has("MANAGE_MESSAGES")) {
			msg.channel.send(`You don't have permission to do that, ${msg.author}!`)
			return
		} 
		
		if (!args[0]) return msg.channel.send(`You have to type in a number, ${msg.author}!`);

		else if (args[0] > 100) {
			msg.reply(`I can only delete up to 100 messages!`).then(msg => msg.delete({ timeout: 5000 }));
			return
		}

		else if (args[0] < 2) {
			msg.delete({timeout: 25})
			msg.reply(`I can only delete messages from 2 - 100!`).then(msg => msg.delete({ timeout: 5000 }))
			
			return
		}

		else if (isNaN(args[0])) {
			msg.delete({timeout: 25})
			msg.reply(`please do not use anything other than numbers!`).then(msg => msg.delete({timeout: 5000}))
			return
		}
		
		msg.channel.bulkDelete(args[0]).then(() => {
			msg.reply(`cleared ${args[0]} messages.`).then(msg => msg.delete({ timeout: 5000 }));
		})
    }
}