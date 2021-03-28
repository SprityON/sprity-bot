const { query } = require("../../../functions")
const { Functions, Discord, embedcolor } = require("../../../variables")

module.exports.info = {
    name: 'shop',
    category: 'points',
    usage: '$rpg shop <category> <page>',
    short_description: 'Buy RPG items',
    help: {
        enabled: true,
        title: 'RPG Shop',
        aliases: [],
        description: 'Buy RPG items and boosts!',
        permissions: ['SEND_PERMISSIONS']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        let member = msg.mentions.members.first()
        if (!member) member = msg.member
        query(`SELECT * FROM members_rpg WHERE member_id = ${member.id}`, data => {
            let result = data[0][0]

            let category = args[1]
            const categories = require('./shop-categories.json')
            
            let embed = new Discord.MessageEmbed()
            .setAuthor(`${msg.author.username} | Gold: ${Functions.normalizePrice(result.gold)}`, msg.author.avatarURL({ dynamic: true }))
            .setColor(embedcolor)

            if (!category) {
                embed.setTitle(`RPG Shop Categories`)

                if (categories.length === 0) return msg.channel.send(embed.setDescription(`**NO CATEGORIES FOUND**`))

                for (category of categories) {
                    embed.addField(`${category.emote} ${category.title}`, `${category.description}\n\`${category.usage}\``, true)
                }

                return msg.channel.send(embed)
            } 

            const categoriesObject = Object.values(categories)
            if (!categoriesObject.find(cat => cat.name === category) && args.length !== 0) return msg.channel.send(`\`${category}\` is not a shop category!`)
            
            category = category.toLowerCase()
            let shop = require(`./items/${category}/items.json`)
            let status = args[2]

            status = Math.floor(status)

            let lastPage;
            let currentPage;
            if (!status) { currentPage = 1 } else {
                currentPage = (10 * status) / 10
            }
            let itemsLength = shop.length

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
            embed.setFooter(`To buy an item, do: $rpg buy <item_id> | (${currentPage}/${lastPage})`)

            text = ''
            let i = 0
            let repeats = 0
            let testI = 0
            if (currentPage > 1) { i = ((i + currentPage) * 5) - 5}
            for (let item of shop) {
                if (testI != i) { testI++ } else {
                    repeats++
                    if (i == shop.length - 1 && repeats < 5) {
                        embed.addField(`\u200b`,`***NO MORE ITEMS***`)
                    }

                    if (repeats > 5) break;
                    
                    let emote;
                    if (item.uploaded === true) {
                        emote = msg.guild.emojis.cache.find(e => e.name === item.id)
                    } else { emote = `:${item.id}:`}

                    let price = Functions.normalizePrice(item.price)
                    text += `${emote} **${item.name}** ▬ [[${price} Gold]](https://www.youtube.com/sprityen)\n${item.description}\n*Attack Bonus:* ${item.bonuses[0].attack}\n*ID* \`${item.id}\` \n\n`
                    
                    testI++
                    i++
                }
            }

            embed.setDescription(`${text}`)

            msg.channel.send(embed)
        })
    }
}