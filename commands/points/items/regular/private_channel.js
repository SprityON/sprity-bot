const { Discord } = require("../../../../variables")

module.exports.info = {
    name: 'private_channel',
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
        msg.channel.send(`Please specify an argument. Allowed arguments are:\n\`create (to create a private channel)\`\n\`invite <member>\`\n\`remove <member>\`\n\`remove (to delete your private channel)\`\n\n*Type \`cancel\` to cancel*`)

        filter = m => m.author.id === msg.author.id

        let status
        await msg.channel.awaitMessages(filter, {max: 1, time: 60000})
        .then(collected => {
            if (collected.first().content.toLowerCase() !== 'cancel') {

                let content = collected.first().content.toLowerCase()
    
                const privateChannel = msg.guild.channels.cache.find(channel => channel.permissionOverwrites.find(overwrite => overwrite.id === msg.member.id))
                if (content === 'invite') {
                    if (privateChannel) {
                        let mentioned = msg.channel.mentions.members
                        if (mentioned) {
                            channel.updateOverwrite(mentioned.id, {
                                VIEW_CHANNEL: true
                            })
    
                            return msg.channel.send(`You invited ${mentioned.displayName} to your private channel!`)
                        } else status = [false, `You did not mention a member to invite!`]
                    } else status = [false, 'You do not have a private channel!']
                }
                else if (content.startsWith('remove')) {
                    if (content.includes('<@>')) {
                        if (privateChannel) {

                            let mentioned = msg.channel.mentions.members
                            if (mentioned) {
                                channel.updateOverwrite(mentioned.id, {
                                    VIEW_CHANNEL: false
                                })
                                return msg.channel.send(`You removed ${mentioned.displayName} from your private channel!`)
                            } else status = [false, `You did not mention a member to remove!`]
                
                        } else status = [false, `You do not have a private channel!`]
                        
                    } else {
                        msg.channel.send(`Are you sure you want to remove your private channel? (y/n)`)
                        msg.channel.awaitMessages(filter, {max: 1, time: 60000})
                        .then(collected => {
                            if (collected.first().content.toLowerCase() === 'y' || collected.first().content.toLowerCase() === 'yes' ) {
                                privateChannel.delete()
                            } else status = [false, `Your private channel was not removed.`]
                        })
                    }
                } else if (content === 'create') {
                    if (!privateChannel) {
                        msg.guild.channels.create(`${msg.author.username.toLowerCase()}'s private channel`).then(channel => {
                            /*
                            channel.setParent('827183999738445884')
                            */
                
                            channel.setParent('827183999738445884')
                            //827186285231734824
                
                            channel.updateOverwrite(msg.guild.id, {
                                VIEW_CHANNEL: false
                            })
                
                            channel.updateOverwrite(msg.member.id, {
                                VIEW_CHANNEL: true
                            })
                            msg.channel.send(`Creation successful! Go to your private channel: ${channel}`)
                            channel.send(new Discord.MessageEmbed()
                            .setTitle(`Welcome to your private channel, ${msg.author.username}!`)
                            .setDescription(`**Invite/Remove a member from your channel**\n\`$private-channel invite <member>\` let a member join your private channel\n\`$private-channel remove <member>\` remove a member from your private channel\n\nRemove your channel by doing: \`$private-channel remove\``))
                        })
                    }
                }
        
            } else status = [false, 'Cancelled!']
        })

        if (status) { return status } else return
    }
}