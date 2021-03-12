const { Discord, embedcolor } = require("../../variables");

module.exports = {
    name: 'del-color',
    usage: '$del-color',
    description: 'Delete a color role',
    category: 'utils',
    aliases: [],
    help: true,
    execute(msg, args, client) {
		if (!msg.member.permissions.has('MANAGE_MESSAGES')){
			return msg.reply(`you have to buy this item! For more info, use \`$help points\``)
		}
		var otherRole = msg.member.roles.cache.find(role => role.name === `⨀`)
		if (otherRole) {
			otherRole.delete()
            var embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .addField(`Removed ${msg.author.tag}'s nickname color!`, `Color hexcode: \`${otherRole.hexColor}\``)
            .setFooter(`use $set-color to assign a new color`)
            return msg.reply(embed)
		}
		else {
			var embed = new Discord.MessageEmbed()
            .setColor(embedcolor)
            .addField(`Something went wrong, ${msg.author.tag}...`, `Error: member had no custom color`)
            return msg.reply(embed)
		}
    },
};