module.exports.info = {
    name: 'change_nick',
    category: 'points',
    usage: '',
    short_description: 'Ticket for advertising',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    async execute(msg, args, amount, client) {
        if (!msg.member.manageable) return [false, `I cannot nickname members above my rank.`]

        msg.channel.send(`Hey **${msg.author.username}**! What would you like your nickname to be? *To cancel, type: 'cancel'*`)
        const filter = m => m.author.id === msg.author.id

        let result = []
        
        await msg.channel.awaitMessages(filter, {max: 1, time: 180000})
        .then(collected => {
            if (!collected.first().content) return result.push(false, `You have to provide a nickname as argument!`)
            if (collected.first().content === 'cancel') return result.push(false, `The use of your current item was cancelled.`)
            const nickname = collected.first().content

            if (nickname === 'reset') { msg.member.setNickname(msg.author.username) } else {
                msg.member.setNickname(nickname)
            }
            
            return result.push(true)
        }).catch(collected => {
            result.push(false, `Your time is up! Cancelled.`)
        })
            
        

        if (result[0] === false) return [result[0], result[1]]
        return result[0]
    }
}