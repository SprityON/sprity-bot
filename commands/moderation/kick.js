module.exports.info = {
    name: 'kick',
    category: 'moderation',
    usage: '$kick <member> <reason>',
    short_description: 'Kick a member',
    help: {
        enabled: true,
        title: 'Kick A Member',
        aliases: [],
        description: 'Kick a certain member with a reason',
        permissions: ['KICK_MEMBERS']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		const Functions = require('../../functions.js')

		let mentionedMember = msg.mentions.members.first()
		if (!mentionedMember) return msg.reply(`you did not mention a member!`)
		if (mentionedMember.id == msg.guild.me.id) return msg.channel.send('u wot m8? don\'t even try to kick me bro')
		if (msg.member.permissions.has('KICK_MEMBERS')){

			let firstArgumentMemberId = args[0].slice(3, -1)
			if (firstArgumentMemberId == mentionedMember.id && args[0].startsWith('<@') && args[0].endsWith('>')) {
				if (mentionedMember.kickable && mentionedMember.manageable) {
					let argsWithoutMention = args.splice(1)
					let reason = argsWithoutMention.join(' ')
					if (!reason) return msg.reply(`please provide a reason!`)

					Functions.updateDB.isMemberKicked(mentionedMember)

					msg.reply(`${mentionedMember.displayName} was kicked for: ${reason}`)
					
					mentionedMember.kick(`${mentionedMember.displayName} was kicked for: ${reason}`)

					Functions.updateDB.kickMember(mentionedMember, reason)
				}
				else msg.reply('you cannot kick members that have more permissions.')
			}
			else return msg.reply(`please provide a member first before providing your reason!`)
		}
		else { return msg.reply('you don\'t have permission to use this command!') }
    }
}