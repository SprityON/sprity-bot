const { query } = require("../../../functions")

module.exports.info = {
    name: 'convert',
    category: 'points',
    usage: '$rpg convert',
    short_description: 'Convert gold to points',
    help: {
        enabled: true,
        title: 'Convert Gold To Points',
        aliases: ['c'],
        description: 'You can convert your gold into points with this command',
        permissions: ['SEND_PERMISSIONS']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        msg.channel.send(`How much gold do you want to convert?`)
        
        const filter = m => m.author.id === msg.author.id
        msg.channel.awaitMessages(filter, {max: 1, time: 30000} )
        .then(collected => {
            const amount = collected.first().content
            if (isNaN(amount[0])) return msg.channel.send(`${amount} is not a number!`)
            
            query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                let points = data[0][0].points

                query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
                    if (amount > data[0][0].gold) return msg.channel.send(`You do not have ${amount} gold! You only have ${data[0][0].gold}.`)

                    let newPoints = points + parseInt(amount)
                    let newGold = data[0][0].gold - amount

                    query(`UPDATE members SET points = ${newPoints} WHERE member_id = ${msg.member.id}`)
                    query(`UPDATE members_rpg SET gold = ${newGold} WHERE member_id = ${msg.member.id}`)

                    msg.channel.send(`Successfully converted ${amount} gold to points!\nBefore: ${points} points\nAfter: ${newPoints} points`)
                })
            })
        }).catch(collected => {
            msg.channel.send(`Something went wrong... Did the time reach its limit?`)
        })
    }
}