module.exports = {
    name: 'messageReactionAdd',
    aliases: [],
    async execute(reaction, user, client) {
        // *** important variables ***
        const Discord = require('discord.js')
        const Functions = require('../functions.js')
        const config = require('../config.json')
        const con = Functions.dbConnection()
        
        // *** start of event ***
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                return;
            }
        }
    
        let guild = client.guilds.cache.get('380704827812085780')
    
        // if a member reacted an emoji and if its a moderator
        if (reaction.message.channel.id == '720739903331237949') {
            if (user.bot) return
            reaction.users.remove(user)
            if (reaction.emoji.name == '🗑') {
                let member = reaction.message.guild.members.cache.get(user.id)
                if (member.permissions.has("ADMINISTRATOR")) {
                    reaction.message.channel.messages.fetch(reaction.message.id).then(msg => {
                        reaction.message.channel.send(`🗑 Are you sure you want to remove this suggestion? (Y/N)`).then(request => {
                            const filter = m => m.author.id === user.id
                            reaction.message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 10000
                            }).then(collected => {
                                reaction.message.channel.messages.fetch(collected.first().id).then(async fetchedMessage => {
                                    if (collected.first().content.toLowerCase() == 'n' || collected.first().content.toLowerCase() == 'cancel') {
                                        fetchedMessage.reply(`cancelled!`).then(async message => await message.delete({timeout: 500}))
                                    } if (collected.first().content.toLowerCase() == 'y' || collected.first().content.toLowerCase() == 'yes') {
                                        fetchedMessage.reply(`removed this suggestion!`).then(async message => await message.delete({timeout: 500}))
                                        await msg.delete({timeout: 250})
                                    }
                                    await request.delete({timeout: 500})
                                    await fetchedMessage.delete({timeout: 1000})
                                })
                                
                            }).catch(err => {
                                provideReason.delete({timeout: 500})
                                return console.error(err)}
                            )
                        })
                    })
                }
            }
            if (reaction.emoji.name == '✅') {
                let member = reaction.message.guild.members.cache.get(user.id)
                if (member.permissions.has("ADMINISTRATOR")) {
                    reaction.message.channel.messages.fetch(reaction.message.id).then(msg => {
                        reaction.message.channel.send(`✅ You have chosen to review this suggestion as \`accepted\`. Please provide a reason.\n*type \`cancel\` to cancel*`).then(provideReason => {
                            const filter = m => m.author.id === member.id
                            reaction.message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000
                            }).then(collected => {
                                reaction.message.channel.messages.fetch(collected.first().id).then(async message => {
                                    if (!collected.first().content) return msg.reply('you have to provide a reason!')
                                    if (collected.first().content == 'cancel') return msg.reply('cancelled!').then(msg => {
                                        message.delete({timeout: 200})
                                        provideReason.delete({timeout: 500})
                                    })
    
                                    let content = collected.first().content
                                    content += `\n\nReviewed by: ${user}`
    
                                    //msg.channel.send(content)
                                    message.channel.messages.fetch(reaction.message.id).then(fetchedMessage => {
                                        let embed = fetchedMessage.embeds[0]
                                        let receivedEmbed = new Discord.MessageEmbed(embed)
                                        let newEmbed = new Discord.MessageEmbed()
    
                                        // declare some variables
                                        let embedThumbnail = receivedEmbed.thumbnail.url;
                                        let suggestor = receivedEmbed.fields[0]
                                        let suggestion = receivedEmbed.fields[1]
                                        let status = receivedEmbed.fields[2]
                                        embedColor = '43B581'
    
                                        newEmbed.spliceFields(0, embed.fields.length)
                                        newEmbed.setThumbnail(embedThumbnail)
                                        newEmbed.addField(suggestor.name, suggestor.value)
                                        newEmbed.addField(suggestion.name, suggestion.value)
                                        newEmbed.addField(status.name, 'Accepted')
                                        newEmbed.addField('Status Reason', content)
                                        newEmbed.setColor(embedColor)
                                        newEmbed.setTimestamp(embed.timestamp)
                                        newEmbed.setFooter(embed.footer.text)
                                        fetchedMessage.edit(newEmbed)
                                    })
                                    await message.delete({timeout: 500})
                                    await provideReason.delete({timeout: 1000})
                                })
                            }).catch(err => {
                                provideReason.delete({timeout: 500})
                                console.log(err)
                            })
                        })
                    })
                }
            }
            if (reaction.emoji.name == '❌') {
                let member = reaction.message.guild.members.cache.get(user.id)
                if (user.bot) return
                if (member.permissions.has("ADMINISTRATOR")) {
    
                    // fetch the suggestor's message
                    reaction.message.channel.messages.fetch(reaction.message.id).then(msg => {
                        reaction.message.channel.send(`❌ You have chosen to review this suggestion as \`denied\`. Please provide a reason.\n*type \`cancel\` to cancel*`).then(provideReason => {
                            const filter = m => m.author.id === member.id
                            reaction.message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000
                            }).then(collected => {
                                reaction.message.channel.messages.fetch(collected.first().id).then(message => {
                                    if (!collected.first().content) return msg.reply('you have to provide a reason!')
                                    if (collected.first().content == 'cancel') return msg.reply('cancelled!').then(msg => {
                                        message.delete({timeout: 200})
                                        provideReason.delete({timeout: 200})
                                    })
    
                                    let content = collected.first().content
                                    content += `\n\nReviewed by: ${user}`
    
                                    //msg.channel.send(content)
                                    msg.channel.messages.fetch(reaction.message.id).then(fetchedMessage => {
                                        let embed = fetchedMessage.embeds[0]
                                        let receivedEmbed = new Discord.MessageEmbed(embed)
                                        let newEmbed = new Discord.MessageEmbed()
    
                                        // declare some variables
                                        let embedThumbnail = receivedEmbed.thumbnail.url;
                                        let suggestor = receivedEmbed.fields[0]
                                        let suggestion = receivedEmbed.fields[1]
                                        let status = receivedEmbed.fields[2]
                                        embedColor = 'ff0000'
    
                                        newEmbed.spliceFields(0, embed.fields.length)
                                        newEmbed.setThumbnail(embedThumbnail)
                                        newEmbed.addField(suggestor.name, suggestor.value)
                                        newEmbed.addField(suggestion.name, suggestion.value)
                                        newEmbed.addField(status.name, 'Denied')
                                        newEmbed.addField('Status Reason', content)
                                        newEmbed.setColor(embedColor)
                                        newEmbed.setTimestamp(embed.timestamp)
                                        newEmbed.setFooter(embed.footer.text)
                                        fetchedMessage.edit(newEmbed)
                                    })
                                    message.delete({timeout: 500})
                                    provideReason.delete({timeout: 1000})
                                })
                            }).catch(err => {
                                provideReason.delete({timeout: 500})
                                console.log(err)
                            })
                        })
                    })
                }
            }
        }
    
        if (reaction.message.channel.id == '732895465494020107') {
            switch (reaction.emoji.name) {
                case ('1️⃣'): Functions.addRoleByReaction(guild, 'Final Stand', reaction, user, reaction.message); break;
                case ('2️⃣'): Functions.addRoleByReaction(guild, 'DB Online Generations', reaction, user, reaction.message); break;
                case ('3️⃣'): Functions.addRoleByReaction(guild, 'Among Us', reaction, user, reaction.message); break;
                case ('4️⃣'): Functions.addRoleByReaction(guild, 'Destiny 2', reaction, user, reaction.message); break;
                case ('✅'): Functions.addRoleByReaction(guild, 'Active', reaction, user, reaction.message); break;
            }
        }
    
        if (reaction.message.channel.id == '760217772621430874') {
            switch (reaction.emoji.name) {
                case ('1️⃣'): Functions.addRoleByReaction(guild, 'Grinder [DBZ FS]', reaction, user, reaction.message); break;
                case ('2️⃣'): Functions.addRoleByReaction(guild, 'PvP [DBZ FS]', reaction, user, reaction.message); break;
            }
        }
        
    },
};