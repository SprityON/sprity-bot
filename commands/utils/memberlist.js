module.exports.info = {
    name: 'memberlist',
    category: 'utils',
    usage: '$memberlist',
    short_description: 'View members',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, client) {
		const botCount = msg.guild.members.cache.filter(member => member.user.bot).size
		const memberCount = msg.guild.members.cache.filter(member => !member.user.bot).size
		msg.channel.send(memberCount + ' members.')
		
		const totalUsersChannelID = msg.guild.channels.cache.get('723051368872673290')
		totalUsersChannelID.setName('All Members: ' + memberCount.toString())

		msg.channel.send(botCount + ' bots.')

		const totalBotsChannelID = msg.guild.channels.cache.get('751176168614527007')
		totalBotsChannelID.setName('All Bots: ' + botCount.toString())
    }
}