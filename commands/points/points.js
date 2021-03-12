const { query } = require("../../functions")
const { Functions, Discord, embedcolor } = require("../../variables")

module.exports = {
    name: 'points',
    usage: '$points',
    description: 'See your amount of points',
    category: 'points',
    aliases: ['bal', 'p', 'balance'],
    help: true,
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
    },
}