module.exports = {
    name: 'ban',
	usage: '$ban (member/memberID)',
    description: 'Ban a member',
    category: 'moderation',
    aliases: [],
	help: true,
    execute(msg, args) {
		if (msg.member.permissions.has('BAN_MEMBERS')) {
			let mentionedMember = msg.mentions.members.first()
			let memberID = args[0]
			if (memberID && !mentionedMember) {
				if (isNaN(memberID)) { return msg.reply('id\'s can only be numbers!') }
				if (memberID.length < 18 || memberID.length > 18) return msg.reply(`\`${memberID}\` is not a valid member ID!`)
			} else {
				if (!mentionedMember) return msg.reply('you have to mention a member!')
			}
			
			if (memberID && !mentionedMember) {
				let memberFindById = msg.guild.members.cache.find(member => member.id === memberID)
				if (!memberFindById) return msg.reply(`could not find a member with this ID: \`${memberID}\``)
				if (memberFindById.bannable && memberFindById.manageable) {
					let argsWithoutMention = args.splice(1)
					let reason = argsWithoutMention.join(' ')
					if (!reason) return msg.reply(`please provide a reason!`)
	
					memberFindById.ban(memberFindById, reason)
					msg.channel.send(`${memberFindById.displayName} was banned for: ${reason}`)
				}
				else return msg.reply('you cannot ban members that have more permissions.')
			} else {
				let firstArgumentMemberId = args[0].slice(3, -1)
				if (firstArgumentMemberId == mentionedMember.id && args[0].startsWith('<@') && args[0].endsWith('>')) {
					if (mentionedMember.bannable && mentionedMember.manageable) {
						let argsWithoutMention = args.splice(1)
						let reason = argsWithoutMention.join(' ')
						if (!reason) return msg.reply(`please provide a reason!`)
		
						mentionedMember.ban(mentionedMember, reason)
						msg.channel.send(`${mentionedMember.displayName} was banned for: ${reason}`)
					}
					else return msg.reply('you cannot ban members that have more permissions.')
				}
				else return msg.reply(`please provide a member first before providing your reason!`)
			}
		}
    }
}