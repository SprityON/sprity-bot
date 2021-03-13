module.exports.info = {
    name: 'sell',
    category: 'points',
    usage: '$sell <member id> <amount>',
    short_description: 'Sell a item',
    help: {
        enabled: true,
        title: 'Sell Item',
        aliases: [],
        description: 'It is not guaranteed that a item will sell at the price it was bought, be aware!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        return msg.reply(`under construction.`)
    }
}