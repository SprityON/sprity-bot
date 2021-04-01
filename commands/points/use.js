const { query, commandCooldown } = require('../../functions.js')
const { Functions, fs } = require('../../variables.js')

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

        const shop_categories = require('./shop-categories.json')
        let allShopItems = []
        for (let category of shop_categories) {
            let items = require(`./items/${category.category}/items.json`)
            allShopItems.push(items.items)
        }

        const id = args[0]
        if (!id) return msg.channel.send(`**${msg.author.username}**, you did not specify an item.`)

        let itemFound = false
        let item
        let category
        for (let i = 0; i < allShopItems.length; i++) {
            const temporary_item = allShopItems[i].find(item => item.id === id)
            
            if (temporary_item) {
                category = i
                itemFound = true; item = temporary_item; break
            }
        }

        let itemFolder = fs.readdirSync('commands/points/items')
        for (let i = 0; i < itemFolder.length; i++) if (i == category) category = itemFolder[i]

        if (itemFound === false) return msg.channel.send(`Item \`${id}\` was not found`)
        try {
            const searchItem = require(`./items/${category}/${id}`)
            query("SELECT "+id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'", async data => {
                let amount = parseInt(Object.values(data[0][0]))
                
                if (amount == 0) return msg.channel.send(`**${msg.author.username}**, you don't have this item.`)
                
                await searchItem.command.execute(msg, args).then(data => {
                    if (data[0] === false || data === false) {
                        if (data[1]) {
                            item.once ? msg.channel.send(data[1]) : msg.channel.send(`${data[1]} The item \`${id}\` was not removed from your inventory.`)
                        } else {
                            msg.channel.send(`Something went wrong when using the item ${searchItem.info.name}. It was not removed from your inventory.`)
                        }
                    } else {
                        item.once ? msg.channel.send(`You have used the item \`${id}\`. Enable/Disable this item in your $settings.`) : (function() {
                            Functions.changeInventory(1, id, msg)
                            msg.channel.send(`You have used the item \`${id}\`. One item was removed from your inventory.`)
                        })
                    }
                })
            })
        } catch (error) {
            console.log(error)
            return msg.channel.send(`**${msg.author.username}**, \`${id}\` is not a valid item id (or this item is unusable)`)
        }
    }
}