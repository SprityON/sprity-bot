module.exports = {
    name: 'giverole',
	usage: '$giverole (member) (role)',
    description: 'Give a role to a member',
    category: 'utils',
    aliases: [],
	help: true,
    execute(msg, args, client) {
		if (!msg.member.permissions.has("MANAGE_GUILD")) return msg.reply(`you don't have permission to use this command!`)
		
		let mentionedRole = msg.mentions.roles.first()
		let mentionedUser= msg.mentions.members.first()
		if (!mentionedRole || mentionedUser) return(msg.reply(`you didn't mention a role/member!`))
		
		let userRole = mentionedUser.roles.cache.find(role => role === mentionedRole)
		let findRole = msg.guild.roles.cache.find(role => role === mentionedRole)
		if (!findRole) return(msg.reply(`couldn't find that role!`))
		
		if (args[2]) return(msg.reply('you can only mention 1 role or member!'))
		let roleToString = mentionedRole.toString()
		
		if (userRole) return(msg.channel.send(`${mentionedUser} already has this role, ${msg.author}!`))

		mentionedUser.roles.add(mentionedRole)

		let botChatChannel = msg.guild.channels.cache.find(channel => channel.id === '719290506177282140')
		botChatChannel.send(`Congratulations ${mentionedUser}, you have been given the ${roleToString} role!`)
    },
};