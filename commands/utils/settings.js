module.exports.info = {
	name: 'settings',
	category: 'utils',
	usage: '$settings',
    short_description: 'View your settings',
    help: {
        enabled: true,
        title: 'View Settings',
        aliases: [],
        description: 'View or set your settings. Settings are based on the server!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
	execute(msg, args, client) {
		return msg.reply(`in construction.`)
	}
}