const { query, checkRPGprofile, checkIfNewLevel, commandCooldown } = require("../../../functions")
const { Discord } = require("../../../variables")

module.exports.info = {
    name: 'rpg adventure',
    category: '$rpg adventure',
    usage: '$rpg adventure',
    short_description: 'Go on an adventure!',
    help: {
        enabled: true,
        title: 'Adventure Time!',
        aliases: ['rpg-adv'],
        description: 'Grab your Sword & Armor and fight some enemies! Low chance of spotting a boss.',
        permissions: ['SEND_MESSAGES']
    }
}

let set = new Set()
module.exports.command = {
    execute(msg, args, amount, client) {
        if (commandCooldown(msg, set, 60000) === true) return
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let randomGold = Math.floor(Math.random() * 50) + 10
            let randomEXP = Math.floor(Math.random() * 15) + 5

            let thisGold = randomGold + data[0][0].gold
            let thisEXP = randomEXP + data[0][0].experience

            function getChest() {
                let chanceChest = Math.floor(Math.random() * 200)
                if (chanceChest >= 0 && chanceChest <= 25) return true
                return false
            }

            let embed = new Discord.MessageEmbed()
            let message = [`Adventure time!`, `These monsters are hard to kill...`, `Woah, close one!`, `I hope my Sword hasn't been damaged...`, `I'm too powerful for these lowlives!`]
            let randomMessage = message[Math.floor(Math.random() * message.length)]

            if (getChest() === true) {
                const randomGold = Math.floor(Math.random() * 1500) + 500
                const randomEXP = Math.floor(Math.random() * 500) + 50
                const types = ['basic', 'rare', 'epic', 'legendary']
                const randomType = Math.floor(Math.random() * 200)

                let thisType
                if (randomType < 140) thisType = types.find(type => type === 'basic')
                if (randomType >= 140 && randomType < 175) thisType = types.find(type => type === 'rare')
                if (randomType >= 175 && randomType < 190) thisType = types.find(type => type === 'epic')
                if (randomType >= 190 && randomType <= 200) thisType = types.find(type => type === 'legendary')

                let chestLoot = { gold: randomGold, exp: randomEXP, items: 'none', rareItem: 'none', type: `${thisType}`}
                
                embed.addField(`You found a ${chestLoot.type} chest!`, `You got: ${chestLoot.gold} gold, ${chestLoot.exp} EXP.`)
            } 

            embed.setTitle('🏹  ' + randomMessage)
            embed.setDescription(`You went on a adventure and got ${thisGold - data[0][0].gold} gold and ${thisEXP - data[0][0].experience} experience levels`)
            checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)
            embed.setColor('#00FF00')

            query(`UPDATE members_rpg SET gold = ${thisGold}, experience = ${thisEXP} WHERE member_id = ${msg.member.id}`)

            msg.channel.send(embed)
        })
    }
}