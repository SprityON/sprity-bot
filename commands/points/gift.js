const { query } = require('../../functions')

module.exports = {
    name: 'gift',
    usage: '$gift (member) (item id) (amount)',
    description: 'Gift an item',
    category: 'points',
    aliases: [],
    help: true,
    execute(msg, args) {
        const shop = require('./shop-items.json')

        let member = msg.mentions.members.first()
        if (!member) return msg.channel.send(`**${msg.author.username}**, you have to mention a member!`)
        
        let second_args = args

        let id
        let amount

        var gift = (amount, item_id) => {
            let item = shop.items.find(item => item.id === item_id)
            if (!item) return msg.channel.send(`**${msg.author.username}**, item \`${item_id}\` does not exist.`)

            let additionalText = ''
            if (amount > 1) { additionalText += "'s"}

            query("SELECT "+item_id+" FROM members_inventory WHERE member_id = '"+msg.member.id+"'", data => {
                let prevAmount = parseInt(Object.values(result[0]))

                if ((prevAmount - amount) < 0) return msg.reply(`you can't gift ${amount} item(s) since you don't have those items.`)
                
                query("UPDATE `members_inventory` SET "+item_id+" = "+(prevAmount - amount)+" WHERE member_id = '"+msg.member.id+"'")
                query("UPDATE `members_inventory` SET "+item_id+" = "+(prevAmount + amount)+" WHERE member_id = '"+member.id+"'")
                
                msg.channel.send(`You gifted ${amount} ${item.name}${additionalText} to **${member.displayName}**`)
            })
        }
        
        if (args[0].startsWith('<@!') && second_args[0].slice(3, second_args[0].length - 1) == member.id && args[0].endsWith('>')) { 
            amount = 1
            if (!args[1]) return msg.reply(`you have to provide a second argument, e.g.: \`$gift (member) (item id) (amount)\``)
            if (!isNaN(args[1])) { 
                amount = parseInt(args[1]) 
                if (!args[2]) return msg.reply(`you have to provide an item id.`)
                id = args[2]

                gift(amount, id)
                return
            }
            
            if (!args[1]) return msg.reply(`you have to provide an item id.`)
            id = args[1]
            if (!args[2]) amount = 1
            if (!isNaN(amount)) {
                if (args[2]) amount = parseInt(args[2])

                gift(amount, id)
                return
            }

        } else if (args[1].startsWith('<@!') && second_args[1].slice(3, second_args[1].length - 1) == (member.id) && args[1].endsWith('>')) {

            amount = 1
            if (!args[0]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
            if (!isNaN(args[0])) { 
                amount = parseInt(args[0]) 
                if (!args[2]) return msg.reply(`you have to provide an item id.`)
                id = args[2]

                gift(amount, id)
                return
            }
            
            if (!args[2]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
            if (!isNaN(args[2])) {
                if (!args[0]) return msg.reply(`you have to provide an item id.`)
                id = args[0]
                amount = parseInt(args[2])

                gift(amount, id)
                return
            }

        } else if (args[2].startsWith('<@!') && second_args[2].slice(3, second_args[2].length - 1) == (member.id) && args[2].endsWith('>')) {
            amount = 1
            if (!args[0]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
            if (!isNaN(args[0])) { 
                amount = parseInt(args[1]) 
                if (!args[1]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
                id = args[0]

                gift(amount, id)
                return
            }
            
            if (!args[0]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
            if (!args[1]) return msg.reply(`incorrect set of arguments, e.g.: \`$gift (member) (item id) (amount)\``)
            id = args[1]
            if (!isNaN(args[0])) {
                amount = parseInt(args[0])

                gift(amount, id)
                return
            }
        } else {
            msg.reply(`that member does not exist, or it is not a valid member ID.`)
            return
        }
    },
}