const { query } = require("../../functions");

module.exports.info = {
    name: 'unmute',
    category: 'moderation',
    usage: '$unmute <member>',
    short_description: 'Unmute a member',
    help: {
        enabled: true,
        title: 'Unmute A Member',
        aliases: [],
        description: 'Unmute a member ',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		let member = msg.mentions.members.first()
		if (!member) return msg.reply('you have to mention a user first!')
		let muteRole = msg.guild.roles.cache.find(role => role.name === "Muted")
		let checkIfHasRole = member.roles.cache.find(role => role === "Muted")
		let permission = msg.member.permissions.has('MANAGE_MESSAGES')

		if (!permission) return msg.channel.send(`You don't have permission to mute other members, ${msg.author.tag}!`)
		
		if (!checkIfHasRole) return msg.reply(`this member is already unmuted.`)

		msg.channel.send(`**${member.displayName}** has been unmuted!`)
		member.roles.remove(muteRole)

		query(`DELETE FROM timer_dates WHERE member_id = ${member.id}`)
    }
}