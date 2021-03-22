const { Discord } = require("../../../variables")

module.exports.info = {
    name: 'boss',
    category: 'points',
    usage: '',
    short_description: 'Ticket for advertising',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        msg.channel.send(`Are you sure you want to fight Roqus? [y/n]`)

        const filter = m => m.author.id === msg.author.id
        msg.channel.awaitMessages(filter, { max: 1, time: 30000 }).then(collected => {
            if (collected.first().content.toLowerCase() !== `y` && collected.first().content.toLowerCase() !== `yes`) return msg.channel.send(`Cancelled!`)

            msg.channel.send(new Discord.MessageEmbed()
            .setTitle(`***CHALLENGE ACCEPTED***`)
            .setDescription(`Defeat this boss to get lots of points!`)
            .addField(`Boss Stats (Roqus)`, `AGRESSIVE UNIT\n\nHP:1200\nATT: 40\nDEF:20\n\n**Additional information**\nAgressive boss types get energy-drained quickly!`, true)
            .addField(`Your Stats (${msg.member.displayName})`, `*Killer of dragons.*\n\nHP: 1324\nATT: 142\nDEF: 70\n\n**EQUIPPED ITEMS**\nIn right-hand: \`Energy Sword\`\nOn body: \`Iron helmet\` \`Iron Chestplate\` \`Iron Leggings\` \`Iron Boots\``, true)
            .setColor(`FF0000`))
            setTimeout(() => {
                msg.channel.send(`Type **READY** to fight. Type **CANCEL** to cancel`)
                msg.channel.awaitMessages(filter, { max: 1, time: 120000 }).then(collected => {
                    if (collected.first().content.toLowerCase() !== `ready`) return msg.channel.send(`Cancelled!`)

                    msg.channel.send(new Discord.MessageEmbed()
                    .setAuthor(`${msg.member.displayName}'s ACTIONS`, msg.author.avatarURL({dynamic: true}))
                    .addField(`ATTACK`, `*Sword Attack* (80-142)\n*Sword Swing* (120-150)`, true)
                    .addField(`DEFEND`, `Has a 75% chance to block any next attack`, true)
                    .addField(`RUN`, `Escape from the boss and lose some points`, true))

                    return msg.channel.send('lel')
                })
            }, 1000);
        }).catch(collected => {
            msg.channel.send(`You ran out of time! Cancelled.`)
        })
    }
}