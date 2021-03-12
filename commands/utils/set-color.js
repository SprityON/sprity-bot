const { Discord, embedcolor } = require("../../variables");

module.exports = {
    name: 'set-color',
	usage: '$set-color (hexcode)',
    description: 'Set a color role',
    category: 'utils',
    aliases: [],
	help: true,
    execute(msg, args) {
        // *** start of code ***
		if (msg.channel.id == config.channels.botChatChannel.id || msg.channel.id == config.channels.devDebugChannel.id) { /* do nothing */ } else return(msg.reply(`bot commands are only allowed in <#719290506177282140>`))
		if (!msg.member.permissions.has('MANAGE_MESSAGES')){
			return msg.reply(`you have to buy this item! For more info, use \`$help points\``)
		}
		
		if(!args[0]) {
			var embed = new Discord.MessageEmbed()
			.setColor(embedcolor)
			.addField(`Something went wrong, ${msg.author.username}...`, `Error: a valid hexcode **pattern** looks like this: either \`#123\` OR \`#123456\``)
			return(msg.reply(embed))
		}
		var hexcode = args[0].toLowerCase()
		hexcode = hexcode.replace('#', '')
		var str = hexcode
		const legend = '0123456789abcdef';
		for(let i = 0; i < str.length; i++){
			if(legend.includes(str[i])){
				/* do nothing */
			}
			else {
				var embed = new Discord.MessageEmbed()
				.setColor(embedcolor)
				.addField(`Something went wrong, ${msg.author.username}...`, `Error: \`#${hexcode}\` is not a valid hexcode`)
				return(msg.reply(embed))
			}
		}
		if (hexcode.length == 3 || hexcode.length == 6) { /* ignore */ }
		else {
			var embed = new Discord.MessageEmbed()
			.setColor(embedcolor)
			.addField(`Something went wrong, ${msg.author.username}...`, `Error: a valid hexcode requires 3 or 6 numbers`)
			return(msg.reply(embed))
		}
		
		var otherRole = msg.member.roles.cache.find(role => role.name === `⨀`)
		if (otherRole) {
			var otherGuildRole = msg.guild.roles.cache.get(otherRole.id)
			otherGuildRole.setColor(hexcode).then(role => {
				var embed = new Discord.MessageEmbed()
				.setColor(embedcolor)
				.addField(`Changed ${msg.author.username}'s nickname color!`, `Color hexcode: \`${role.hexColor}\``)
				.setFooter(`use $del-color to delete your nickname color`)
				msg.channel.send(embed)
			})
			return
		}

		msg.guild.roles.create({
			data: {
				name: `⨀`,
				color: `${hexcode}`,
				mentionable: false,
				permissions: 0,
			},
			reason: `Created role for ${msg.member}`
		}).then(role => {
			async function addRole() {
				msg.member.roles.add(role)
				var embed = new Discord.MessageEmbed()
				.setColor(embedcolor)
				.addField(`Assigned ${msg.author.username}'s nickname color!`, `Color hexcode: \`${role.hexColor}\``)
				.setFooter(`use $del-color to delete your nickname color`)
				msg.channel.send(embed)
				
				var rolePosition = msg.guild.me.roles.highest.position - 2
				role.setPosition(rolePosition)
			}
			
			addRole()
		})
    },
};