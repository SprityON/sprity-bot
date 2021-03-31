const { query, checkRPGprofile, userLevel, normalizePrice } = require("../../../functions")
const { Discord, embedcolor } = require("../../../variables")

module.exports.info = {
    name: 'profile',
    category: 'points',
    usage: '$rpg profile <member>',
    short_description: 'View a profile',
    help: {
        enabled: true,
        title: 'View A Profile',
        aliases: ['stats', 's', 'p'],
        description: 'View your rpg-profile or that of others!',
        permissions: ['SEND_MESSAGES']
    }
}
 
module.exports.command = {
    execute(msg, args, amount, client) {
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            if (args[1]) {
                args[1].toLowerCase()
                if (args[1] !== 'upgrade' && args[1] !== 'u') return msg.channel.send(`Did you mean \`upgrade\`?`)
                if (!args[2]) return msg.channel.send(`Select a stat you want to upgrade!`)
                args[2].toLowerCase()

                let amount 
                console.log(args)
                if (args[3]) {
                    if (!isNaN(args[3])) { amount = args[3] } else return msg.channel.send(`A amount can only be a number!`)
                } else {
                    amount = 1
                }

                if (data[0][0].attributes < amount) return msg.channel.send(`You cannot spend **${amount}** attributes, you only have **${data[0][0].attributes}**!`)

                let acceptableStats = ['hp', 'def', 'att']

                switch (args[2]) {
                    case 'health':
                        args[2] = 'hp'
                    break
                    
                    case 'defense':
                        args[2] = 'def'
                    break
                    
                    case 'attack':
                        args[2] = 'att'
                    break
                }

                if (acceptableStats.find(stat => stat === args[2])) {
                    let newStat
                    let change
                    let backToJSON
                    switch (args[2]) {
                        case 'hp':
                            newStat = JSON.parse(data[0][0].basic_stats)
                            change = newStat.health + (amount * 10)
                            backToJSON = `{"health": ${change}, "defense": ${newStat.defense}, "attack": ${newStat.attack}}`
                            query(`UPDATE members_rpg SET basic_stats = '${backToJSON}' WHERE member_id = ${msg.member.id}`)
                            msg.channel.send(`Allocated **${amount * 10}** points to your ${args[2]}. You now have **${change}**.`)
                        break
                        case 'def':
                            newStat = JSON.parse(data[0][0].basic_stats)
                            change = newStat.defense + (amount * 10)
                            backToJSON = `{"health": ${newStat.health}, "defense": ${change}, "attack": ${newStat.attack}}`
                            query(`UPDATE members_rpg SET basic_stats = '${backToJSON}' WHERE member_id = ${msg.member.id}`)
                            msg.channel.send(`Allocated **${amount * 10}** points to your ${args[2]}. You now have **${change}**.`)
                        break
                        case 'att':
                            newStat = JSON.parse(data[0][0].basic_stats)
                            change = newStat.attack + (amount * 10)
                            backToJSON = `{"health": ${newStat.health}, "defense": ${newStat.defense}, "attack": ${change}}`
                            query(`UPDATE members_rpg SET basic_stats = '${backToJSON}' WHERE member_id = ${msg.member.id}`)
                            msg.channel.send(`Allocated **${amount * 10}** points to your ${args[2]}. You now have **${change}**.`)
                        break
                    }

                    return query(`UPDATE members_rpg SET attributes = ${data[0][0].attributes - amount}`)
                }
            }

            let result = data[0][0]

            const basic_stats_json = JSON.parse(result.basic_stats)
            const armor = JSON.parse(result.armor)

            let goldEmoji = msg.guild.emojis.cache.find(e => e.name === 'gold')
            let expEmoji = msg.guild.emojis.cache.find(e => e.name === 'exp')
            
            let inventory = JSON.parse(result.inventory)
            let equippedWeapon = inventory.find(item => item.equipped === true)
            let weapons = require('./items/weapons/items.json')

            let weapon
            equippedWeapon 
            ? weapon = weapons.find(weapon => weapon.id === equippedWeapon.name).name 
            : weapon = "none"

            let embed = new Discord.MessageEmbed().setColor(embedcolor)
            .setDescription(`Weapon: **${weapon}**`)
            .setAuthor(`Profile of ${result.rpg_name} | LVL. ${result.level}`, msg.author.avatarURL({dynamic: true}))
            .addField(`Stats (${data[0][0].attributes} ATTR.)`, `HP: ${basic_stats_json.health}\nDEF: ${basic_stats_json.defense}\nATT: ${basic_stats_json.attack}`, true)
            .addField(`Armor`, `Armor: ${armor.name}`, true)
            .addField(`Gold and EXP`, `${goldEmoji} ${normalizePrice(result.gold)}\n${expEmoji} ${normalizePrice(result.experience)}`, true)

            msg.channel.send(embed)
        })
    }
}