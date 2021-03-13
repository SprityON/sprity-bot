const { query } = require("../../functions")
const { Functions, Discord, embedcolor } = require("../../variables")

module.exports.info = {
    name: 'points',
    category: 'points',
    usage: '$points',
    short_description: 'Amount of member points',
    help: {
        enabled: true,
        title: 'Amount of Member Points',
        aliases: ['bal', 'balance'],
        description: 'See a member\'s amount of points',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        query(`SELECT * FROM members WHERE member_id = ${msg.author.id}`, data => {
            for (let row of data[0]) {
                if (!args[0]) {
                    let embed = new Discord.MessageEmbed()
                    embed.setColor(embedcolor)
                    embed.setFooter(`For more information, use $help points`)
                    embed.setAuthor(msg.author.username + "'s points", msg.author.avatarURL({ dynamic: true }))
    
                    let p = row.points
                    embed.setDescription(`**Points:** ${Functions.normalizePrice(p)} (\`0% boost\`)`)
                    msg.channel.send(embed)
                }
            }
        })
    }
}