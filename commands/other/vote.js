module.exports = {
    name: 'vote',
	usage: '$vote (text)',
    description: 'Vote',
    category: 'other',
    aliases: [],
	help: true,
    execute(msg, args) {
        const voteChannel = msg.guild.channels.cache.find(channel => channel.id === '718152742832701541')
        
		if (msg.channel.id == voteChannel.id) {
			let message = args.join(" ")
			msg.delete({timeout: 100})
			if (!message) return msg.channel.send(`You have to type in a description, ${msg.author}!`).then(msg => msg.delete({ timeout: 5000 }))
			else {
				msg.channel.send(message).then(async msg => {
					await msg.react('👍')
					await msg.react('👎')
				})
			}
			return
		}
		else {
			msg.channel.send(`${msg.author}, vote commands are only allowed in <#718152742832701541>!`).then(msg => msg.delete({ timeout: 5000 }))
			return 
		}
    },
};