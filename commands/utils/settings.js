const { query } = require("../../functions")
const { Discord, embedcolor } = require("../../variables")

module.exports.info = {
	name: 'settings',
	category: 'utils',
	usage: '$settings',
    short_description: 'View your settings',
    help: {
        enabled: true,
        title: 'View Settings',
        aliases: [],
        description: 'View or set your settings. Settings are based on the server!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
	execute(msg, args, client) {
		let embed = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username}'s settings`)
        .setDescription(`These are all your settings which you can enable/disable`)
        .setColor(embedcolor)

        const setting = args[0] // could be a item
        const status = args[1]

        const shop_categories = require('../points/shop-categories.json')
        let allShopItems = []
        for (let category of shop_categories) {
            let items = require(`../points/items/${category.category}/items.json`)
            allShopItems.push(items.items)
        }

        if (!setting) {
            query(`SELECT * FROM members_inventory WHERE member_id = ${msg.member.id}`, data => {
                let result = data[0]

                result.forEach(row => {
                    let r = Object.entries(row)

                    let enabled 
                    for (let i = 0; i < r.length; i++) {
                        if (r[i][0] === 'enabled') { enabled = r[i][1]; break; }
                    }

                    let objs = []
                    let arr = enabled.split(`,`)

                    let i = 0
                    for (let value of arr) {
                        if (value === 't') {
                            objs.push({id: i + 1, value: value})
                        }

                        i++
                    }

                    switch (item.type) {
                        case 'role':
                            let role = msg.guild.roles.cache.find(role => role.name === item.role_name)

                            msg.member.roles.cache.has(role.id) 
                            ? embed.addField(`${item.id}`, `Enabled`) 
                            : embed.addField(`${item.id}`, `Disabled`)
                        break
                        case 'tool':
                            if (item.once === true) {
                                 
                            }
                        break
                    }
                })
            })
        } else {
            let isItem = false
            let item
            for (let i = 0; i < allShopItems.length; i++) {
                const temporary_item = allShopItems[i].find(item => item.id === setting)
                
                if (temporary_item) {
                    isItem = true; item = temporary_item; break
                }
            }

            if (isItem === true) {
                switch (item.type) {
                    case 'role':
                        let role = msg.guild.roles.cache.find(role => role.name === item.role_name)
                        if (msg.member.roles.cache.has(role.id))
                    break
                }
            } else {
    
            }
        }
	}
}