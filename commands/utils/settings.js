const { query } = require("../../functions")
const { Discord, embedcolor } = require("../../variables")

module.exports.info = {
	name: 'settings',
	category: 'utils',
	usage: '$settings <item id> <enable/disable>',
    short_description: 'View your settings',
    help: {
        enabled: true,
        title: 'View Settings',
        aliases: ['setting'],
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
                            objs.push({id: i + 3, value: value})
                        }

                        i++
                    }

                    // id is where the item id resides in the database (column number)
                    let enabledItems = []
                    objs.forEach(item => {
                        enabledItems.push( {id: item.id, name: r[item.id][0] } )
                    })

                    // checks if a item has a type of once, then checks if it is enabled or disabled
                    for (let [item_name, amount] of r) {
                        let type = typeof(amount)

                        if (type === 'number') {
                            if (amount > 0) {
                                let isEnabled = enabledItems.find(enabled_item => enabled_item.name === item_name)

                                allShopItems.forEach(shoplist => {
                                    shoplist.forEach(item => {
                                        if (item_name === item.id) {
                                            if (item.once === true) {
                                                isEnabled 
                                                ? embed.addField(`${item.name}`, `🟢 Enabled`, true) 
                                                : embed.addField(`${item.name}`, `🔴 Disabled`, true)
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    }

                    msg.channel.send(embed)
                })
            })
        } else {
            if (!args[1]) return msg.channel.send(`You have provided no setting: A valid setting would be either \`enabled\` or \`disabled\``)

            query(`SELECT * FROM members_inventory WHERE member_id = ${msg.member.id}`, data => {

                let r = Object.entries(data[0][0])

                let enabled 
                for (let i = 0; i < r.length; i++) {
                    if (r[i][0] === 'enabled') { enabled = r[i][1]; break; }
                }

                let objs = []
                let arr = enabled.split(`,`)

                // now in 'objs' there will be a format: {id: 4, value: 't'}, etc...
                let i = 0
                for (let value of arr) {
                    objs.push({id: i + 3, value: value})

                    i++
                }

                let isItem = false
                let item // this will be the item
                for (let i = 0; i < allShopItems.length; i++) {
                    const temporary_item = allShopItems[i].find(item => item.id === setting)
                    
                    if (temporary_item) {
                        isItem = true; item = temporary_item; break
                    }
                }
    
                if (isItem === true) {
                    if (item.once === false) return msg.channel.send(`Item \`${args[0]}\` cannot be enable or disable!`)

                    switch (item.type) {
                        case 'role':
                            let role = msg.guild.roles.cache.find(role => role.name === item.role_name)

                            let isValidStatus = true
                            let successful = true
                            objs.forEach(obj => {
                                if (item.id === r[obj.id][0]) {

                                    if (status === 'enable') {
                                        let bool = obj.value === 't'

                                        if (bool === true) {
                                            msg.channel.send(`Something went wrong! The item \`${item.id}\` is already enabled.`)
                                            successful = false
                                        } else { 
                                            arr[obj.id - 3] = 't' 
                                            const newEnabled = arr.toString()

                                            query(`UPDATE members_inventory SET enabled = '${newEnabled}' WHERE member_id = ${msg.member.id}`)
                                            msg.member.roles.add(role)
                                        }

                                    } else if (status === 'disable') {
                                        let bool = obj.value === 'f'

                                        if (bool === true) {
                                            msg.channel.send(`Something went wrong! The item \`${item.id}\` is already disabled.`)
                                            successful = false
                                        } else { 
                                            arr[obj.id - 3] = 'f' 
                                            const newEnabled = arr.toString()

                                            query(`UPDATE members_inventory SET enabled = '${newEnabled}' WHERE member_id = ${msg.member.id}`)
                                            msg.member.roles.remove(role)
                                        }
                                    } else isValidStatus = false
                                }
                            })
                            
                            if (isValidStatus === false) return msg.channel.send(`\`${status}\` is not a valid status! You can choose to either enable or disable.`)
                            if (successful === false) return
                            return msg.channel.send(`Your **${role.name}** role has been ${status}d!`)
                        break
                        case 'weapon':
                            
                        break
                    }
                } else {
                    return msg.channel.send(`You have provided no valid item to enable or disable!`)
                }
            })
        }
	}
}