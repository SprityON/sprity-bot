const { query, commandCooldown } = require('../../functions.js')
const { Functions } = require('../../variables.js')

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

let set = new Set()
module.exports.command = {
    execute(msg, args, client) {
        let bool = commandCooldown(msg, set, 10000)
        if (bool === true) return

        let id = args[0]
        if (!id) return msg.channel.send(`**${msg.author.username}**, you have to provide an item id.`)
        try {
            const searchItem = require(`./items/${id}.js`)
            query("SELECT "+id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'", async data => {
                let amount = parseInt(Object.values(data[0][0]))
                if (amount == 0) return msg.channel.send(`**${msg.author.username}**, you don't have this item.`)
                
                await searchItem.command.execute(msg, args).then(([item, message]) => {
                    console.log(item)
                    console.log(message)
                    if (data[0] === false) {
                        if (data[1]) {
                            msg.channel.send(`${data[1]} The item \`${id}\` was not removed from your inventory.`)
                        } else {
                            msg.channel.send(`Something went wrong when using the item ${searchItem.info.name}. It was not removed from your inventory.`)
                        }
                    } else {
                        Functions.changeInventory(1, id, msg)
                        msg.channel.send(`You have used the item \`${id}\`. One item was removed from your inventory.`)
                    }
                    // 
                })
            })
        } catch (error) {
            return msg.channel.send(`**${msg.author.username}**, \`${id}\` is not a valid item id (or this item is unusable)`)
        }
    }
}