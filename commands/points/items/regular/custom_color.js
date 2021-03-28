const { embedcolor, Discord, Functions } = require("../../../../variables")
module.exports.info = {
    name: 'custom_color',
    category: 'points',
    usage: '',
    short_description: 'Have a custom color',
    help: {
        enabled: false,
        title: 'Custom Color',
        aliases: [],
        description: '',
        permissions: []
    }
}

let thisName = this.info.name
module.exports.command = {
    async execute(msg, args, amount, client) {

        let bool = false;
        let message = 'ERROR';
        let hasRole;
        let hexcode;

        const filter = m => m.author.id === msg.author.id

        msg.channel.send(`**${msg.author.username}**, please type in the hexcode of your custom color. *Type 'cancel' to cancel*\nMake sure you have a hexcode ready!`)

        await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 180000
        }).then(collected => {
            if (collected.first().content) {
                if (collected.first().content !== 'cancel') { 
                    hexcode = collected.first().content.toLowerCase()
                    hexcode = hexcode.replace('#', '')
                    let str = hexcode
                    const legend = '0123456789abcdef';
                    for(let i = 0; i < str.length; i++) {
                        if(legend.includes(str[i])) {
                            if (hexcode.length == 3 || hexcode.length == 6) { 
                                bool = true

                                msg.member.roles.cache.find(role => role.name === `⨀`)
                                ? hasRole = true 
                                : hasRole = false
                            } else { bool = false; message = 'A valid hexcode requires 3 or 6 numbers.' }
                        } else { bool = false; message = `\`${hexcode}\` is not a valid hexcode!` }
                    }
                } else { bool = false; message = 'The use of your current item was cancelled.' }
            } else { bool = false; message = 'You did not provide a hexcode.' }
        }).catch(collected => {
			message = `Cancelled suggestion: you ran out of time...`
            bool = false
        }) 

        if (bool === true) {
            let status = 'Assigned'
            if (hasRole === true) {
                status = 'Changed'

                msg.member.roles.remove('⨀')

                msg.guild.roles.create({
                    data: {
                        name: `⨀`,
                        color: `${hexcode}`,
                        mentionable: false,
                        permissions: 0,
                    },
                    reason: `Created role for ${msg.member}`
                }).then(role => {
                    msg.member.roles.add(role)
                    var rolePosition = msg.guild.me.roles.highest.position - 2
                    role.setPosition(rolePosition)
                })
            } else if (hasRole === false) {
                msg.guild.roles.create({
                    data: {
                        name: `⨀`,
                        color: `${hexcode}`,
                        mentionable: false,
                        permissions: 0,
                    },
                    reason: `Created role for ${msg.member}`
                }).then(role => {
                    msg.member.roles.add(role)
                    var rolePosition = msg.guild.me.roles.highest.position - 2
                    role.setPosition(rolePosition)
                })
            }

            msg.channel.send(new Discord.MessageEmbed().setColor(embedcolor)
            .addField(`${status} ${msg.author.username}'s nickname color!`, `Color hexcode: \`${hexcode}\``)
            .setFooter(`use $del-color to delete your nickname color`))
            
            return true
        } else if (bool === false) {
            return [false, message]
        }
    }
}