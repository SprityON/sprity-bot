module.exports = {
    name: 'unban',
	usage: '$unban (memberID)',
    description: 'Unban a member by ID',
    category: 'moderation',
    aliases: [],
	help: true,
    execute(msg, args) {
		if (msg.member.permissions.has('BAN_MEMBERS')){
			let mentionedMember = msg.mentions.members.first()
			if (mentionedMember) return msg.reply('you cannot ban members by mentioning them! Unban members using only their ID.')
			msg.guild.fetchBans().then(bannedMembers => {
				let bannedMember;
				let memberID = args[0]
				if (memberID) {
					var checkIfBanned = bannedMembers.find(member => member.user.id === memberID)
					if (!checkIfBanned) return msg.reply('this member is not banned in this server!')

					if (isNaN(memberID)) { return msg.reply('id\'s can only be numbers!') }
					if (memberID.length < 18 || memberID.length > 18) return msg.reply(`\`${memberID}\` is not a valid member ID!`)

					msg.channel.send(`A member with the id \`${memberID}\` was unbanned.'`)
				} else {
					return msg.reply('something went wrong... Are you sure you provided a correct Member ID?')
				}
				
				bannedMember = memberID
				msg.guild.members.unban(bannedMember)
			}).catch(err => console.log(err))
		}
    },
};