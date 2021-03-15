module.exports = {
    name: 'messageDelete',
    async execute(msg) {
        const Discord = require('discord.js')
        if (msg.partial) {
            try {
                await msg.fetch()
            } catch (error) {
                console.error('Uncached message was deleted')
            }
        }
    
        if (!msg.guild) return
        const fetchedLogs = await msg.guild.fetchAuditLogs({
            limit: 1,
            type: "MESSAGE_DELETE",
        })
        const deletionLog = fetchedLogs.entries.first()
        if (!deletionLog) return
        if (deletionLog.target.bot == true || deletionLog.executor.bot == true) return
    
        let msgContent = ''
        let authorId = ''
        let msgId = ''
        let executor // user who deleted the message
        let target // creator of the deleted message
        let avatar
        

        if (msg.partial) { 
            msgContent += 'Message was uncached, thus no content was received.'
            authorId += 'Uncached Message'
            msgId += 'Uncached Message'
    
            target = '(not found)'
            executor = '(not found)'
        } else {
            if (Date.now() - deletionLog.createdTimestamp < 2000) { 
                // when someone removed a message
                executor = deletionLog.executor.username
                target = msg.author.username
                avatar = deletionLog.executor.displayAvatarURL({format: 'png', dynamic: true})
            } else {
                // when user removed their own message
                executor = msg.author.username
                target = msg.author.username
                avatar = msg.author.displayAvatarURL()
            }
            msgContent = msg.content
            authorId = msg.author.id
            msgId = msg.id
            
            
        }
    
        let embed = new Discord.MessageEmbed()
        .addField(
            `A message of ${target} was deleted by ${executor}`,
            `Channel: ${msg.channel}\nContent:\n\`${msgContent}\`` 
        )
        .setThumbnail(avatar)
        .setFooter(`Author ID: ${authorId} | Message ID: ${msgId}`)
        .setTimestamp()
        .setColor('#7289da')
        let commandLog = msg.guild.channels.cache.get('729687704891162645')
        commandLog.send(embed)
    },
};