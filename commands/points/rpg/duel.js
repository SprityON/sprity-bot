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
        msg.channel.send(`Mention someone you want to duel, and have them with you!`)

        let filter = m => m.author.id === msg.author.id
        msg.channel.awaitMessages(filter, {max: 1, time: 120000}).then(collected => {
            if (collected.first().content.toLowerCase() === 'cancel') return msg.channel.send(`Cancelled your duel!`)

            console.log(collected)
        })
    }
}