const { query } = require('../../../functions')

module.exports.info = {
    name: 'rpg equip',
    category: 'points',
    usage: '$rpg equip <item id>',
    short_description: 'Equip an item!',
    help: {
        enabled: true,
        title: 'Equip An Item',
        aliases: [],
        description: 'Equip a item to deal more damage.',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0][0]
            let inventory = JSON.parse(result.inventory)
            
            let item_id = args[1].toLowerCase()
            if (!item_id) return msg.channel.send(`You have to provide a item id!`)
            let equippedWeapon = inventory.find(item => item.equipped === true)

            if (equippedWeapon) { if (equippedWeapon.equipped === true) {
                return msg.channel.send(`You already have an equipped item! Unequip with \`$rpg unequip <item id>\``)
            } } else {
                let item = inventory.find(item => item.name === item_id)
                if (!item) return msg.channel.send(`Item \`${item_id}\` does not exist!`)

                inventory = JSON.parse(result.inventory)

                let inventoryItems = `[`
                let i = 0
                for (let item of inventory) {
                    i++

                    if (item.name !== item_id) {
                        inventoryItems += `{ \"name\": \"${item.name}\", \"amount\": ${item.amount}, \"equipped\": ${item.equipped}, \"category\": \"weapons\" }, `
                    }
                }
                inventoryItems += `{ \"name\": \"${item_id}\", \"amount\": 1, \"equipped\": true, \"category\": \"weapons\" } `

                inventoryItems += ']'

                msg.channel.send(`You have equipped item **${item_id}**!`)

                query(`UPDATE members_rpg SET inventory = '${inventoryItems}' WHERE member_id = ${msg.member.id}`)
            }
        })
    }
}