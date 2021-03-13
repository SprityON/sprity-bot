module.exports.info = {
    name: 'refund',
    category: 'points',
    usage: '$refund <item id> <amount>',
    short_description: 'Refund a item',
    help: {
        enabled: true,
        title: 'Refund Item',
        aliases: [],
        description: 'Refund a item you recently bought. Items will stay in your refunded list for 30 minutes, after which they will be removed',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        return msg.reply(`under construction`)
    }
}