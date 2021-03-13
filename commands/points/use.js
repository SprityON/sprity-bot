const { query } = require('../../functions.js')

module.exports.info = {
    name: 'use',
    category: 'points',
    usage: '$use <item id>',
    short_description: 'Use a item from the shop',
    help: {
        enabled: true,
        title: 'Use Item',
        aliases: [],
        description: 'Use a item from the shop. BE AWARE: when used, the item WILL be removed from your inventory!\nIf anything still goes wrong, refund by doing $refund (used items will stay for 15 minutes)',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        let id = args[0]
        if (!id) return msg.channel.send(`**${msg.author.username}**, you have to provide an item id.`)
        try {
            const searchItem = require(`./items/${id}.js`)
            query("SELECT "+id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'", data => {
                let amount = parseInt(Object.values(data[0][0]))
                if (amount == 0) return msg.channel.send(`**${msg.author.username}**, you don't have this item.`)
                
                searchItem.execute(msg, args)
            })
        } catch (error) {
            return msg.channel.send(`**${msg.author.username}**, \`${id}\` is not a valid item id, or this item can't be used.`)
        }
    }
}