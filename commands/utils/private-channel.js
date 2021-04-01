const { query } = require("../../functions")
const { Discord, embedcolor } = require("../../variables")

module.exports.info = {
    name: 'private-channel',
    category: '',
    usage: '',
    short_description: 'Create your private channel',
    help: {
        enabled: false,
        title: 'Create Your Private Channel',
        aliases: ['pc', 'private'],
        description: 'Ever wanted to be alone while using bot commands? Then this command is just for you!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    async execute(msg, args, amount, client) {

        query(`SELECT * FROM private_channels WHERE member_id = ${msg.member.id}`, data => {

            filter = m => m.author.id === msg.author.id

            if (!data[0][0]) {
                msg.channel.send(`Seems like you do not have a private channel yet!\nA private channel costs \`10,000\` points. Want to buy one? (y/n)`)
                msg.channel.awaitMessages(filter, {max: 1, time: 60000})
                .then(collected => {
                    let cont = collected.first().content.toLowerCase()
                    if (cont === 'y' || cont === 'yes') {
                        query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                            let result = data[0][0]
                            if (result.points < 10000) return msg.channel.send(`You do not have enough points to create a private channel!`)

                            msg.guild.channels.create(`${msg.author.username.toLowerCase()}'s private channel`).then(channel => {
                                channel.setParent('827185165985906729')

                                channel.setTopic(`Owner: ${msg.author.username}`)
                                
                                channel.updateOverwrite(msg.guild.id, {
                                    VIEW_CHANNEL: false
                                })
                    
                                channel.updateOverwrite(msg.member.id, {
                                    VIEW_CHANNEL: true
                                })

                                query(`UPDATE members SET points = ${result.points - 10000} WHERE member_id = ${msg.member.id}`)
                                query(`INSERT INTO private_channels (member_id, channel_id) VALUES (${msg.member.id}, ${channel.id}) `)

                                msg.channel.send(`Creation successful! Check out your private channel: ${channel}`)
                                channel.send(new Discord.MessageEmbed().setColor(embedcolor)
                                .setTitle(`Welcome to your private channel, ${msg.author.username}!`)
                                .setDescription(`**Invite/Remove a member from your channel**\n\`$use private_channel, and after that: invite <member>\` let a member join your private channel\n\`$use private-channel, and after that: remove <member>\` remove a member from your private channel\n\nRemove your channel by doing: \`$use private-channel. and after that: remove\``))
                            })
                        })

                    } else return msg.channel.send(`Cancelled!`)
                })
            } else {
                msg.channel.send(`Please specify an argument. Allowed arguments are:\n\`change <topic|name>\`\n\`invite <member>\`\n\`remove <member>\`\n\`remove (to delete your private channel)\`\n\n*Type \`cancel\` to cancel*`)
    
                msg.channel.awaitMessages(filter, {max: 1, time: 60000})
                .then(collected => {
                    if (collected.first().content.toLowerCase() !== 'cancel') {
    
                        let content = collected.first().content.toLowerCase()
            
                        const privateChannel = msg.guild.channels.cache.find(channel => channel.id === data[0][0].channel_id)

                        if (content.startsWith('invite')) {
                            let mentioned = collected.first().mentions.members.first()
                            if (mentioned) {
                                privateChannel.updateOverwrite(mentioned.id, {
                                    VIEW_CHANNEL: true
                                })
                                msg.channel.send(`You invited ${mentioned.displayName} to your private channel!`)
                            } else return msg.channel.send(`To invite a member, mention them!`)
                        }
                        else if (content.startsWith('remove')) {
                            if (content.includes('<@>')) {
                                let mentioned = collected.first().mentions.members.first()
                                
                                if (mentioned) {
                                    privateChannel.updateOverwrite(mentioned.id, {
                                        VIEW_CHANNEL: false
                                    })
                                    return msg.channel.send(`You removed **${mentioned.user.username}** from your private channel!`)
                                } else {
                                    return msg.channel.send(`You did not mention a member to remove!`)
                                }
                                
                            } else {
                                msg.channel.send(`Are you sure you want to remove your private channel? (y/n)\nNote: You have to buy a private channel again!`)
                                msg.channel.awaitMessages(filter, {max: 1, time: 60000})
                                .then(collected => {
                                    if (collected.first().content.toLowerCase() === 'y' || collected.first().content.toLowerCase() === 'yes' ) {
                                        privateChannel.delete()
                                        query(`DELETE FROM private_channels WHERE member_id = ${msg.member.id}`)
                                        return msg.channel.send(`Your private channel was removed`)
                                    } else return msg.channel.send(`Your private channel was not removed.`)
                                })
                            }
                        } else if (content.startsWith(`change`)) {
                            let contentArgs = content.split(/ +/).shift()

                            switch (contentArgs) {
                                case ('description' || 'topic'): 
                                    msg.channel.send(`What would you like your channel topic to be?`)
                                    msg.channel.awaitMessages(filter, {max: 1, time: 300000})
                                    .then(collected => {
                                        privateChannel.setTopic(collected.first().content)
                                        return msg.channel.send(`Your channel topic has been changed.`)
                                    })
                                break
                                case ('name'): 
                                    msg.channel.send(`What would you like your channel name to be?`)
                                    msg.channel.awaitMessages(filter, {max: 1, time: 300000})
                                    .then(collected => {
                                        privateChannel.setName(collected.first().content)
                                        return msg.channel.send(`Your channel name has been changed.`)
                                    })
                                break
                                default:
                                    msg.channel.send(`You have to provide more arguments! Accepted arguments are: \`change topic\`,  \`change name\``)
                                break
                            }
                        }
                        
                    } else return msg.channel.send('Cancelled!')
                })
            }
        })
    }
}