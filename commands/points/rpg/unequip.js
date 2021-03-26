const { query } = require("../../../functions")

module.exports.info = {
    name: 'rpg unequip',
    category: 'points',
    usage: '$rpg unequip <item id>',
    short_description: 'Unequip a item',
    help: {
        enabled: true,
        title: 'Unequip Item',
        aliases: [],
        description: 'Unequip a item. Your additional attack damage will be no more (unless you equip again)!',
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

            if (!equippedWeapon) {
                return msg.channel.send(`You do not have a equipped item! Equip with \`$rpg equip <item id>\``)
            } else {
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
                inventoryItems += `{ \"name\": \"${item_id}\", \"amount\": 1, \"equipped\": false, \"category\": \"weapons\" } `

                inventoryItems += ']'

                msg.channel.send(`You have unequipped item **${item_id}**!`)

                query(`UPDATE members_rpg SET inventory = '${inventoryItems}' WHERE member_id = ${msg.member.id}`)
            }
        })
    }
}