const { query } = require('../../functions')
const { Functions } = require('../../variables')

module.exports = {
    name: 'buy',
    usage: '$buy (item id/tag)',
    description: 'Buy a specific item',
    category: 'points',
    aliases: [],
    help: true,
    execute(msg, args) {
        const shop = require('./shop-items.json')

        query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
            let points = data[0]

            for (let row of points) {
                if (!args[0]) return msg.channel.send(`**${msg.author.username}**, you did not specify an item.`)
                let item_id = args[0]
                let item = shop.items.find(i => i.id === item_id)
                if (!item) return msg.channel.send(`**${msg.author.username}**, item \`${item_id}\` does not exist.`)

                let amount = 1
                if (args[1]) amount = parseInt(args[1])
                
                let additionalText = ''
                if (amount > 1) { additionalText += "'s"}

                if (points[0].points > (parseInt(item.price) * amount)) {
                    query(`SELECT * FROM members_inventory WHERE member_id = ${msg.member.id}`, data => {
                        let result = data[0]

                        if (result.length == 0) { query(`INSERT INTO members_inventory (member_id, ${item.tags}) VALUES (${msg.member.id}, ${1 * amount})`) } 
                        else {
                            sql = "SELECT "+item_id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'"
                            Functions.checkError(sql, 'return', 'something went wrong, please try again.', msg)
                            query(sql, data  => {
                                let prevAmount = parseInt(Object.values(result[0]))
                                
                                query("UPDATE `members_inventory` SET "+item_id+" = "+(prevAmount + amount)+" WHERE member_id = '"+msg.member.id+"'")
                                query(`UPDATE members SET points = ${points[0].points - (item.price * amount)} WHERE member_id = ${msg.member.id}`)
                                msg.channel.send(`You successfully bought ${amount} ${item.name}${additionalText}\nYour current points: ${row.points - (item.price * amount)}`)
                            })
                        }
                    })
                } else {
                    msg.channel.send(`You don't have enough points to buy ${amount} **${item.name}${additionalText}**`)
                }
            }
        })
    },
}