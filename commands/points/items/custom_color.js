const { embedcolor, Discord, Functions } = require("../../../variables")

module.exports = {
    name: 'custom_color',
    usage: '',
    description: '',
    category: '',
    aliases: [],
    help: false,
    execute(msg, args, amount) {
        const filter = m => m.author.id === msg.author.id

        msg.channel.send(`**${msg.author.username}**, please type in the hexcode of your custom color. *Type 'cancel' to cancel*`)
        msg.channel.awaitMessages(filter, {
            max: 1,
            time: 180000
        }).then(collected => {
            if (!collected.first().content) return msg.reply(`you have to type in a hexcode.`)
            if (collected.first().content == 'cancel') return msg.channel.send(`Command cancelled, **${msg.author.username}**`)
            
            let hexcode = collected.first().content.toLowerCase()
            hexcode = hexcode.replace('#', '')
            let str = hexcode
            const legend = '0123456789abcdef';
            for(let i = 0; i < str.length; i++){
                if(!legend.includes(str[i])) {
                    var embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .addField(`Something went wrong, ${msg.author.username}...`, `Error: \`#${hexcode}\` is not a valid hexcode`)
                    return(msg.reply(embed))
                }
            }
            if (hexcode.length == 3 || hexcode.length == 6) { /* ignore */ }
            else {
                let embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .addField(`Something went wrong, ${msg.author.username}...`, `Error: a valid hexcode requires 3 or 6 numbers`)
                return(msg.reply(embed))
            }
            
            let otherRole = msg.member.roles.cache.find(role => role.name === `⨀`)
            if (otherRole) {
                let otherGuildRole = msg.guild.roles.cache.get(otherRole.id)
                otherGuildRole.setColor(hexcode).then(role => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .addField(`Changed ${msg.author.username}'s nickname color!`, `Color hexcode: \`${role.hexColor}\``)
                    .setFooter(`use $del-color to delete your nickname color`)
                    msg.channel.send(embed)
                })
                Functions.changeInventory(amount, 'custom_color', msg)
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

                    Functions.changeInventory(amount, 'custom_color', msg)
                    
                    var rolePosition = msg.guild.me.roles.highest.position - 2
                    role.setPosition(rolePosition)
                }
                
                addRole()
            })
        }).catch(collected => {
            console.log(collected)
			msg.channel.send(`Cancelled suggestion for ${msg.member}. You ran out of time...`)
        }) 
    },
}