module.exports.info = {
    name: 'rpg duel',
    category: 'points',
    usage: '$rpg duel <member to duel>',
    short_description: 'Fight a member!',
    help: {
        enabled: true,
        title: 'Duel A Member',
        aliases: [],
        description: 'Fight a member! Beware, if the member has higher stats then you, then you have a higher chance to die!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        msg.channel.send(`You are about to duel another RPG member.\nMake sure they're online and participating in this duel!\n\nTo start, mention a RPG member.`)

        let filter = m => m.author.id === msg.author.id
        msg.channel.awaitMessages(filter, {max: 1, time: 300000}).then(collected => {
            let mention = collected.first().mentions.members.first()
            if (!mention) return msg.channel.send(`You have to mention a member first before starting a duel!`)

            msg.channel.send(`Perfect! **${mention.user.username}**, do you want to duel **${msg.author.username}**? (y/n)`)
            
            filter = m => m.author.id === mention.id
            msg.channel.awaitMessages(filter, {max: 1, time: 300000}).then(collected => {
                if (collected.first().content.toLowerCase() !== 'y' && collected.first().content.toLowerCase() !== 'yes') return msg.channel.send(`The duel was abanonded by **${mention.user.username}**`)

                msg.channel.send(`**${msg.author.username}**, use \`attack\` \`defend\` or \`run\``)
                return channelMessage()
            })
        })
  
        let mentionedUserHealth = 100
        let msgAuthorHealth = 100

        var previousTurn = mention
        var nextTurn = msg.member

        let amount = 0
        filter = m => m.author.id === nextTurn.id

        async function actionHandler() {
            filter = m => m.author.id === nextTurn.id
            return channelMessage(filter)
        }

        channelMessage()
        async function channelMessage(f) {
            amount++
            if (amount === 1) {
                if (f) filter = f
                msg.channel.awaitMessages(filter, {max: 1, time: 300000}).then(collected => {
                    let action = collected.first().content.toLowerCase()

                    switch (action) {
                        case 'attack':
                            mentionedUserHealth -= 20 
                            msg.channel.send(`**${previousTurn.displayName}** got hit by **${nextTurn.displayName}** and lost 20 HP, and has ${mentionedUserHealth} HP left.`)
                            msg.channel.send(`**${previousTurn.displayName}**, use \`attack\` \`defend\` or \`run\``)

                            amount = 0
                            previousTurn = nextTurn
                            nextTurn = previousTurn
                            return actionHandler()
                        break;

                        case 'defend':

                        break;

                        case 'run':

                        break;

                        default:
                            // go back to channelmessage or something
                        break;
                    }
                })
            }
        }
    }
}