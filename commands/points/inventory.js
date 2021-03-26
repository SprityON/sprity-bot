const { query } = require('../../functions')
const { Functions, embedcolor, Discord } = require('../../variables')

module.exports.info = {
    name: 'inventory',
    category: 'points',
    usage: '$inventory <member>',
    short_description: 'See inventory of member',
    help: {
        enabled: true,
        title: 'See Inventory of Member',
        aliases: ['inv', 'items'],
        description: 'See the amount of items which a member has',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        Functions.updateDB.updateItemsDB()

        query(`SELECT * FROM members_inventory WHERE member_id = ${msg.member.id}`, async data => {
            if (data[0].length == 0) {
                query(`INSERT INTO members_inventory (member_id) VALUES (${msg.member.id})`)
            }
            for (let row of data[0]) {
                const shop_categories = require('../points/shop-categories.json')
                let shop = []
                let shopLength = 0
                let length = 0
                for (let category of shop_categories) {
                    let items = require(`../points/items/${category.category}/items.json`)
                    shopLength += items.items.length
                    shop.push(items.items)
                    length++
                }

                query("SELECT * FROM members_inventory WHERE member_id = '"+msg.member.id+"'", data => {
                    let result = data[0]
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

                    let text1 = ''
                    let itemAmount = 0

                    shop.forEach(shoplist => {
                        shoplist.forEach(item => {
                            for (let [itemname, amount] of Object.entries(result[0])) {
                                if (item.id == itemname) {
                                    if (amount > 0) {
                                        if (testI != i) { testI++ } else {
                                            itemAmount++
    
                                            if (itemAmount > 5) break;
                                            let emote;
                                            if (item.uploaded === true) {
                                                let e = client.emojis.cache.find(e => e.name === item.emote)
                                                emote = client.emojis.resolveID(e)
                                                emote = msg.guild.emojis.cache.get(emote)
                                            } else { emote = `:${item.emote}:`}

                                            text1 += `${emote} **${item.name}** ▬ ${amount}\n*ID* \`${item.id}\`\n\n`
                                            
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
                            for (let [itemname, amount] of Object.entries(result[0])) {
                                if (item.id == itemname) {
                                    if (amount > 0) {
                                        for (let i = 0; i < amount; i++) {
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

                    if (!text1) return msg.channel.send(`**${msg.author.username}**, you have no items.`)
                    
                    msg.channel.send(new Discord.MessageEmbed()
                    .setAuthor(`${msg.author.username}'s inventory`, msg.author.avatarURL({ dynamic: true }))
                    .addField(`${totalItems} total`,`${text1}`)
                    .setFooter(`To use an item, do: $use (item id) | Page ${currentPage} of ${lastPage}`)
                    .setColor(embedcolor)
                    )
                })
            }
        })
    }
}