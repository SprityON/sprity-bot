const { embedcolor, Discord } = require('../../variables.js');

module.exports.info = {
    name: 'suggestion',
    category: 'other',
    usage: '$suggestion',
    short_description: 'Make a suggestion',
    help: {
        enabled: true,
        title: 'Make A Suggestion',
        aliases: [],
        description: 'After entering this command, you will be given a few questions which you will have to reply to',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        const Functions = require('../../functions.js')
        const config = require('../../config.json')
        const suggestionChannel = msg.guild.channels.cache.find(channel => channel.id === '720739903331237949')
        
        const filter = m => m.author.id === msg.author.id

        msg.reply("please type in the title of your suggestion. *Type 'cancel' to cancel*")
        msg.channel.awaitMessages(filter, {
            max: 1,
            time: 180000
        })
        .then(collected => {
            if(collected.first().content == 'cancel') {
                return msg.reply('canceled!')
            }
            let suggestionTitle = collected.first().content
            msg.channel.send(`Suggestions's title has been set to: **${suggestionTitle}**!`)
            setTimeout(async() => {
                await msg.channel.send(`Perfect! Now, please type in the content for your suggestion.`)
            }, 1000);
            
            msg.channel.awaitMessages(filter, {
                max: 1,
                time: 180000
            }).then(collected => {
                let suggestionContent = collected.first().content
                if(suggestionContent == 'cancel') {
                    return msg.reply('canceled!')
                }
				
                var embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .addField(`Issued by:`,`${msg.author}`)
				.addField(`${suggestionTitle}`, `${suggestionContent}`)
				.addField(`Status`, `Under Review`)
				.setThumbnail(msg.author.avatarURL({dynamic: true}))
                .setFooter(`By ${msg.author.tag}`)
				.setTimestamp()

                msg.channel.send(`Sending your suggestion to ${suggestionChannel.name}`).then(msg => {
					let i = 0
					var interval = setInterval(() => {
						if (i < 3) {
							editMessage()
							async function editMessage() {
								if (msg.content == `Sending your suggestion to ${suggestionChannel.name}`) {
									await msg.edit(`Sending your suggestion to ${suggestionChannel.name}.`)
								} else if (msg.content == `Sending your suggestion to ${suggestionChannel.name}.`) {
									await msg.edit(`Sending your suggestion to ${suggestionChannel.name}..`)
								} else if (msg.content == `Sending your suggestion to ${suggestionChannel.name}..`) {
									await msg.edit(`Sending your suggestion to ${suggestionChannel.name}...`)
								} else {
									await msg.edit(`Sending your suggestion to ${suggestionChannel.name}`)
								}
							}
						} else if (i === 3) {
							msg.edit(`Your message has succesfully been sent to ${suggestionChannel.name}!`)

							suggestionChannel.send(embed).then(async message => {
								await message.react('✅')
                                await message.react('❌')
                                await message.react('🗑')
							})
							clearInterval(interval)
							return
						}
						i++
					}, 750)})
            }).catch(collected => {
                console.log(collected)
			msg.channel.send(`Cancelled suggestion for ${msg.member}. You ran out of time...`)
			})
        }).catch(collected => {
			msg.channel.send(`Cancelled suggestion for ${msg.member}. You ran out of time...`)
		})
    }
}