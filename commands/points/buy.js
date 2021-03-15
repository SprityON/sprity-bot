const { query } = require('../../functions')
const { Functions } = require('../../variables')

module.exports.info = {
    name: 'buy',
    category: 'points',
    usage: '$buy <item id>',
    short_description: 'Buy A item',
    help: {
        enabled: true,
        title: 'Buy A Item',
        aliases: [],
        description: 'Buy a item from the shop. Buy by item id',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        const shop = require('./shop-items.json')

        query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, async data => {
            let points = data[0]

            for (let row of points) {
                if (!args[0]) return msg.channel.send(`**${msg.author.username}**, you did not specify an item.`)
                let item_id = args[0]
                let item = shop.items.find(i => i.id === item_id)
                if (!item) return msg.channel.send(`**${msg.author.username}**, item \`${item_id}\` does not exist.`)

                let amount = 1
                if (args[1]) amount = parseInt(args[1])
                
                for (let item of shop.items) { 
                    if (item.id == item_id) {
                        query(`SELECT ${item_id} FROM members_inventory WHERE member_id = ${msg.member.id}`, data => {
                            let alreadyBought = false
                            if (item.once === true) {
                                let prevAmount = parseInt(Object.values(data[0][0]))
                                if (prevAmount >= 1) alreadyBought = true
                            }
                            
                            if (alreadyBought === true) return msg.channel.send(`You already have the item \`${item_id}\`, which can only be bought once.`)

                            let additionalText = ''
                            if (amount > 1) { additionalText += "'s"}

                            if (points[0].points >= (parseInt(item.price) * amount)) {
                                query(`SELECT * FROM members_inventory WHERE member_id = ${msg.member.id}`, data => {
                                    let result = data[0]

                                    if (result.length == 0) { query(`INSERT INTO members_inventory (member_id, ${item.tags}) VALUES (${msg.member.id}, ${1 * amount})`) } 
                                    else {
                                        query("SELECT "+item_id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'", data  => {
                                            if (data[2]) return msg.channel.send(`**${msg.author.username}**, something went wrong... Please try again.`)
                                            let prevAmount = parseInt(Object.values(data[0][0]))
                                            
                                            query("UPDATE `members_inventory` SET "+item_id+" = "+(prevAmount + amount)+" WHERE member_id = '"+msg.member.id+"'")
                                            query(`UPDATE members SET points = ${points[0].points - (item.price * amount)} WHERE member_id = ${msg.member.id}`)
                                            msg.channel.send(`You successfully bought ${amount} ${item.name}${additionalText}\nYour current points: ${row.points - (item.price * amount)}`)
                                        })
                                    }
                                })
                            } else {
                                msg.channel.send(`You don't have enough points to buy ${amount} **${item.name}${additionalText}**`)
                            }
                        })
                    }
                }
            }
        })
    }
}