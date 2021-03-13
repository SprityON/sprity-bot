module.exports.info = {
    name: 'removerole',
    category: 'utils',
    usage: '$removerole <member> <role>',
    short_description: 'Remove role from member',
    help: {
        enabled: true,
        title: 'Remove Role from Member',
        aliases: [],
        description: 'Remove any type of role from a member (only for upper-staff)',
        permissions: ['MANAGE_GUILD']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		if (!msg.member.permissions.has("MANAGE_GUILD")) return msg.reply(`you don't have permission to use this command!`)

		let mentionedRole = msg.mentions.roles.first()
		let mentionedUser= msg.mentions.members.first()
		if (!mentionedUser || mentionedRole) return msg.reply(`you didn't mention a role/member!`)
		
		let userRole = mentionedUser.roles.cache.find(role => role === mentionedRole)
		let findRole = msg.guild.roles.cache.find(role => role === mentionedRole)
		if (!findRole) return msg.reply(`couldn't find that role!`)
		
		if (args[2]) return msg.reply('you can only mention 1 role or member!')
		let roleToString = mentionedRole.toString()
		
		if (!userRole) return msg.channel.send(`${mentionedUser} doesn't have this role, ${msg.author}!`)

		mentionedUser.roles.remove(mentionedRole)

		let botChatChannel = msg.guild.channels.cache.find(channel => channel.id === '719290506177282140')
		botChatChannel.send(`Removed ${roleToString} role for ${mentionedUser}.`)
    }
}