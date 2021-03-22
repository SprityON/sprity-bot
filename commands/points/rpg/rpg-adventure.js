const { query, checkRPGprofile, checkIfNewLevel } = require("../../../functions")
const { Discord } = require("../../../variables")

module.exports.info = {
    name: 'rpg-adventure',
    category: '$rpg-adventure',
    usage: '$rpg-adventure',
    short_description: 'Go on an adventure!',
    help: {
        enabled: true,
        title: 'Adventure Time!',
        aliases: ['rpg-adv'],
        description: 'Grab your Sword & Armor and fight some enemies! Low chance of spotting a boss.',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return

        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let randomGold = Math.floor(Math.random() * 50) + 10
            let randomEXP = Math.floor(Math.random() * 15) + 5

            let thisGold = randomGold + data[0][0].gold
            let thisEXP = randomEXP + data[0][0].experience

            

            let embed = new Discord.MessageEmbed()
            let message = [`Adventure time!`, `These monsters are hard to kill...`, `Woah, close one!`, `I hope my Sword hasn't been damaged...`, `I'm too powerful for these lowlives!`, `These monsters sure are scary, but easy to beat!`, `Adventure time #18904, lol`]
            let randomMessage = message[Math.floor(Math.random() * message.length)]
            embed.setTitle('🏹  ' + randomMessage)
            embed.setDescription(`You went on a adventure and got ${thisGold - data[0][0].gold} gold and ${thisEXP - data[0][0].experience} experience levels`)
            checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)
            embed.setColor('#00FF00')

            query(`UPDATE members_rpg SET gold = ${thisGold}, experience = ${thisEXP} WHERE member_id = ${msg.member.id}`)

            msg.channel.send(embed)
        })
    }
}