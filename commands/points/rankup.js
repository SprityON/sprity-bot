module.exports.info = {
    name: 'rankup',
    category: 'points',
    usage: '$rankup',
    short_description: 'Rank up once',
    help: {
        enabled: true,
        title: 'Rank Up',
        aliases: [],
        description: 'Ranking up will give you additional boosts, rewards, as well as new unlocked items',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        return msg.reply(`under construction.`)
    }
}