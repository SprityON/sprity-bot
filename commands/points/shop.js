const { query } = require('../../functions')
const { Functions, Discord, embedcolor } = require('../../variables')

module.exports.info = {
    name: 'shop',
    category: 'points',
    usage: '$shop <page>',
    short_description: 'Buy items',
    help: {
        enabled: true,
        title: 'Shop',
        aliases: ['market', 'marketplace'],
        description: 'Buy items with points! From a simple role to converting messages to points',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        Functions.updateDB.updateItemsDB()
        
        query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0]
            for (let row of result) {
                let embed = new Discord.MessageEmbed()
                .setAuthor(`${msg.author.username} | Points: ${Functions.normalizePrice(row.points)}`, msg.author.avatarURL({ dynamic: true }))
                .setColor(embedcolor)
                let shop = require('./shop-items.json')
                let status = args[0]

                status = Math.floor(status)

                let lastPage;
                let currentPage;
                if (!status) { currentPage = 1 } else {
                    currentPage = (10 * status) / 10
                }
                let itemsLength = shop.items.length

                itemsLength = itemsLength / 5
                if (itemsLength < 1) {
                    lastPage = 1
                } else {
                    lastPage = Math.ceil(itemsLength)
                }

                let text;
                if (lastPage == 1) { text = `there is only **${lastPage}** page.` } else { text = `there are only **${lastPage}** pages.` }
                if (status > lastPage) return msg.channel.send(`**${msg.member.displayName}**, ${text}`)

                embed.setTitle(`Shop Items`)
                embed.setFooter(`To use an item, do: $use (item id) | Page ${currentPage} of ${lastPage}`)

                text = ''
                let i = 0
                let repeats = 0
                let testI = 0
                if (currentPage > 1) { i = ((i + currentPage) * 5) - 5}
                for (let item of shop.items) {
                    if (testI != i) { testI++ } else {
                        repeats++
                        if (i == shop.items.length - 1 && repeats < 5) {
                            embed.addField(`\u200b`,`***NO MORE ITEMS***`)
                        }

                        if (repeats > 5) break;
                        
                        let emote;
                        if (item.uploaded === true) {
                            let e = client.emojis.cache.find(e => e.name === item.emote)
                            emote = client.emojis.resolveID(e)
                            emote = msg.guild.emojis.cache.get(emote)
                        } else { emote = `:${item.emote}:`}
                        let price = Functions.normalizePrice(item.price)
                        text += `${emote} **${item.name}** ▬ [[${price}p.]](https://www.youtube.com/sprityen)\n${item.description}\n*ID* \`${item.id}\` \n\n`
                        
                        testI++
                        i++
                    }
                }

                embed.setDescription(`${text}`)

                msg.channel.send(embed)
            }
        })
    }
}