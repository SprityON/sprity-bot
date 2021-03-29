const { query } = require("../../../functions")

module.exports.info = {
    name: 'buy',
    category: 'points',
    usage: '$rpg buy',
    short_description: 'Buy RPG items',
    help: {
        enabled: true,
        title: 'Buy RPG Items',
        aliases: [],
        description: 'Buy RPG items, from weapons and armor to all types of buffs!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
            const shop_categories = require('./shop-categories.json')
            
            let allShopItems = []
            for (category of shop_categories) {
                let items = require(`./items/${category.name}/items.json`)

                allShopItems.push(items)
            }

            let item_id = args[1]
            if (!item_id) return msg.channel.send(`**${msg.author.username}**, you did not specify an item.`)
            item_id = item_id.toLowerCase()

            let item = allShopItems[0].find(item => item.id === item_id)
            if (!item) return msg.channel.send(`Item \`${item_id}\` does not exist!`)

            let amount = 1
            if (args[2]) amount = parseInt(args[2])

            query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
                let result = data[0][0]

                let goldEmoji = msg.guild.emojis.cache.find(e => e.name === 'gold')
                if (result.gold < item.price) return msg.channel.send(`You do not have enough ${goldEmoji} Gold to buy this weapon!`)

                let inventory = JSON.parse(result.inventory)

                if (inventory.find(item => item.name === item_id && item.category === 'weapons')) return msg.channel.send(`You already have this weapon!`)

                inventory.push({ name: item_id, amount: 1, equipped: false, category: 'weapon' })

                let inventoryItems = `[`
                let i = 0
                for (let item of inventory) {
                    i++

                    if (i === inventory.length) { 
                        inventoryItems += `{ \"name\": \"${item.name}\", \"amount\": ${item.amount}, \"equipped\": ${item.equipped}, \"category\": \"${item.category}\" }` 
                    } else {
                        inventoryItems += `{ \"name\": \"${item.name}\", \"amount\": ${item.amount}, \"equipped\": ${item.equipped}, \"category\": \"${item.category}\" }, `
                    }
                }
                inventoryItems += ']'

                query(`UPDATE members_rpg SET inventory = '${inventoryItems}' WHERE member_id = ${msg.member.id}`)
                query(`UPDATE members_rpg SET gold = ${result.gold - item.price} WHERE member_id = ${msg.member.id}`)
                return msg.channel.send(`You have bought 1 \`${item_id}\``)
            })
        })
    }
}