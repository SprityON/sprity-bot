module.exports.info = {
    name: 'mute',
    category: 'moderation',
    usage: '$mute <member> <duration: 10m, 1h, etc...>',
    short_description: 'Mute a member',
    help: {
        enabled: true,
        title: 'Mute A Member',
        aliases: ['silence'],
        description: 'Mute a member for a specific amount of time',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		const { Functions } = require('../../variables.js')
		const moment = require('moment')
		const ms = require('ms')

		let muteRole = msg.guild.roles.cache.find(role => role.name === "Muted")
		
		let permission = msg.member.permissions.has('MANAGE_MESSAGES')
		if (!permission) return(msg.channel.send(`You don't have permission to mute other members, ${msg.author.tag}!`))

		let member = msg.mentions.members.first()
		if (!member) return(msg.reply('you have to mention a member!'))

		if (member.roles.cache.find(role => role.name === 'Muted')) return msg.reply(`this member has already been muted!`)

		let time;
		if (args[0].startsWith('<') && args[0].endsWith('>')) {
			time = args[1]
		} else { time = args[0] }

		if (!time) time = '10m'
		
		const acceptableUnits = ["ms", "s", "m", "h", "d", "w", "y"]
		let unit = ''; // e.g.: m, h, d, etc. (minute, hour, day)

		let timeINT; // the time as only a digit
		const firstDate = moment().format('M/D/YYYY H:mm:ss:SSS') // the begindate.

		// make the unit, and replace every char to nothing from var timeINT
		for (let index = 0; index < time.length; index++) {
			const char = time[index];
			if (isNaN(char)) {
				unit += char
				timeINT = time.replace(char, '')
			}
		}
		
		let checkAU = false
		acceptableUnits.forEach(au => {
			if (unit == au) {
				checkAU = true
			}
		});
		if (checkAU == false) return msg.reply(`invalid time unit!\nAccepted units: \`ms\` \`s\` \`m\` \`h\` \`d\` \`w\` \`y\``)

		let secondDate = moment().add(`${timeINT}`, `${unit}`).format('M/D/YYYY H:mm:ss:SSS')

		Functions.query(`INSERT INTO timer_dates(member_id, begindate, enddate) VALUES ('${member.id}', '${firstDate}', '${secondDate}')`)
		member.roles.add(muteRole)

		setTimeout(function() {
			member.roles.remove(muteRole)
			msg.channel.send(`${member.displayName} has been unmuted!`)

			Functions.query(`DELETE FROM timer_dates WHERE member_id = ${member.id}`)
		}, ms(time));
		return msg.channel.send(`**${member.user.username}** has been muted for ${ms(ms(time), {long: true})}!`)
    }
}