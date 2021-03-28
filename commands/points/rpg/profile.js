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
        aliases: ['stats'],
        description: 'View your rpg-profile or that of others!',
        permissions: ['SEND_MESSAGES']
    }
}
 
module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return

        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0][0]

            const basic_stats_json = JSON.parse(result.basic_stats)
            const armor = JSON.parse(result.armor)

            let goldEmoji = msg.guild.emojis.cache.find(e => e.name === 'gold')
            let expEmoji = msg.guild.emojis.cache.find(e => e.name === 'exp')
            
            let inventory = JSON.parse(result.inventory)
            let equippedWeapon = inventory.find(item => item.equipped === true)
            let weapons = require('./items/weapons/items.json')

            let weapon
            
            if (equippedWeapon) {
                if (equippedWeapon.equipped === true) {
                    weapon = weapons.find(weapon => weapon.id === equippedWeapon.name).name
                }
            } else weapon = 'none'
            
            let embed = new Discord.MessageEmbed().setColor(embedcolor)
            .setDescription(`Weapon: **${weapon}**`)
            .setAuthor(`Profile of ${result.rpg_name} | LVL. ${result.level}`, msg.author.avatarURL({dynamic: true}))
            .addField(`Stats`, `HP: ${basic_stats_json.health}\nDEF: ${basic_stats_json.defense}\nATT: ${basic_stats_json.attack}`, true)
            .addField(`Armor`, `Armor: ${armor.name}`, true)
            .addField(`Gold and EXP`, `${goldEmoji} ${normalizePrice(result.gold)}\n${expEmoji} ${normalizePrice(result.experience)}`, true)

            msg.channel.send(embed)
        })
    }
}