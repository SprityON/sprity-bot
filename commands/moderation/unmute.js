const { Functions } = require("../../variables");

module.exports = {
    name: 'unmute',
	usage: '$unmute (member)',
    description: 'Unmute a member',
    category: 'moderation',
    aliases: [],
	help: true,
    execute(msg, args) {
        
        // *** start of code ***
		let member = msg.mentions.members.first()
		if (!member) return msg.reply('you have to mention a user first!')
		let muteRole = msg.guild.roles.cache.get('731524672629506169')
		let checkIfHasRole = member.roles.cache.find(role => role === muteRole)
		let permission = msg.member.permissions.has('MANAGE_MESSAGES')

		if (!permission) return msg.channel.send(`You don't have permission to mute other members, ${msg.author.tag}!`)
		
		if (!checkIfHasRole) return msg.reply(`this member is already unmuted.`)

		msg.channel.send(`**${member.displayName}** has been unmuted!`)
		member.roles.remove(muteRole)

		Functions.query(`DELETE FROM timer_dates WHERE member_id = ${member.id}`)
    },
};