const { query } = require('../../functions.js')

module.exports = {
    name: 'use',
    usage: '$use (item id)',
    description: 'Use an item',
    category: 'points',
    aliases: [],
    help: true,
    execute(msg, args) {
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
    },
}