const { query } = require("../../../functions")
const { Discord, embedcolor } = require("../../../variables")

module.exports.info = {
    name: 'inventory',
    category: 'points',
    usage: '$rpg inventory <member>',
    short_description: 'View inventory of member',
    help: {
        enabled: true,
        title: 'View Inventory',
        aliases: ['inv', 'myinv'],
        description: 'View the inventory of yourself or a member',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        query(`SELECT inventory FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0][0]

            let inventory = JSON.parse(result.inventory)

            const shop_categories = require(`./shop-categories.json`)
            let shop = []
            let shopLength = 0
            let length = 0

            for (let category of shop_categories) {
                let items = require(`./items/${category.name}/items.json`)
                shopLength += items.length
                shop.push(items)
                length++
            }

            let status = args[0]

            status = Math.floor(status)

            let lastPage;
            let currentPage;
            if (!status) { currentPage = 1 } else {
                currentPage = (10 * status) / 10
            }
            let itemsLength;
            
            let i = 0
            let testI = 0
            if (currentPage > 1) { i = ((i + currentPage) * 5) - 5}

            let text = ''
            let itemAmount = 0

            shop.forEach(shoplist => {
                shoplist.forEach(item => {
                    for (let invItem of inventory) {
                        if (item.id == invItem.name) {
                            if (invItem.amount > 0) {
                                if (testI != i) { testI++ } else {
                                    itemAmount++

                                    if (itemAmount > 5) break;

                                    let emote;
                                    if (item.uploaded === true) {
                                        emote = msg.guild.emojis.cache.find(e => e.name === item.id)
                                    } else { emote = `:${item.id}:`}
                                    
                                    let equipped = ' '
                                    if (invItem.equipped) equipped += '***Equipped***'
                
                                    text += `${emote} **${item.name}** ▬ ${invItem.amount}${equipped}\n*Attack Bonus:* ${item.bonuses[0].attack}\n*ID* \`${item.id}\`\n\n`
                                    
                                    testI++
                                    i++
                                }
                            }
                        }
                    }
                })
            })

            let itemsLength1 = 0
            let totalItems = 0

            shop.forEach(shoplist => {
                shoplist.forEach(item => {
                    for (let invItem of inventory) {
                        if (item.id == invItem.name) {
                            if (invItem.amount > 0) {
                                for (let i = 0; i < invItem.amount; i++) {
                                    totalItems++
                                }
                                itemsLength1++
                            }
                        }
                    }
                })
            })

            itemsLength = itemsLength1 / 5
            if (itemsLength < 1) {
                lastPage = 1
            } else {
                lastPage = Math.ceil(itemsLength)
            }
            
            let text2 = '';
            if (lastPage == 1) { text2 += `there is only **${lastPage}** page.` } else { text2 += `there are only **${lastPage}** pages.` }
            if (status > lastPage) return msg.channel.send(`**${msg.member.displayName}**, ${text2}`)
            if (totalItems != 1) {
                totalItems = `${totalItems} items`
            } else { totalItems = `${totalItems} item` }

            if (!text) return msg.channel.send(`**${msg.author.username}**, you have no items.`)
            
            msg.channel.send(new Discord.MessageEmbed()
            .setAuthor(`${msg.author.username}'s inventory`, msg.author.avatarURL({ dynamic: true }))
            .addField(`${totalItems} total`,`${text}`)
            .setFooter(`To use an item, do: $use (item id) | Page ${currentPage} of ${lastPage}`)
            .setColor(embedcolor)
            )
        })
    }
}