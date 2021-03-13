module.exports.info = {
    name: 'vote',
    category: 'other',
    usage: '$vote <text>',
    short_description: 'Send a message as a vote',
    help: {
        enabled: true,
        title: 'Send Message As Vote',
        aliases: [],
        description: 'Command only usable in a vote channel\nOnly for YouTubers or staff',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		if(msg.member.permissions.has("MANAGE_MESSAGES") || msg.member.roles.cache.find(role => role.name === "YouTuber")) {
			const voteChannel = msg.guild.channels.cache.find(channel => channel.id === '718152742832701541')
        
			if (msg.channel.id == voteChannel.id) {
				let message = msg.content.join(" ")
				msg.delete({timeout: 100})
				if (!message) return msg.channel.send(`You have to type in a description, ${msg.author}!`).then(msg => msg.delete({ timeout: 5000 }))
				else {
					msg.channel.send(message).then(async msg => {
						await msg.react('👍')
						await msg.react('👎')
					})
				}
				return
			} else {
				msg.channel.send(`${msg.author}, vote commands are only allowed in <#718152742832701541>!`).then(msg => msg.delete({ timeout: 5000 }))
				return 
			}
		} else return msg.channel.send(`**${msg.author.username}**, only YouTubers or staff can use this command!`)
    }
}