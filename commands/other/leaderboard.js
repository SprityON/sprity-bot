const { query, commandCooldown } = require("../../functions");
const { Discord, embedcolor } = require("../../variables");

module.exports.info = {
    name: 'leaderboard',
    category: 'other',
    usage: '$leaderboard',
    short_description: 'Show leaderboard',
    help: {
        enabled: true,
        title: 'Show Leaderboard',
        aliases: ['lb'],
        description: 'Show 5 members with the most highest amount of messages',
        permissions: ['SEND_MESSAGES']
    }
}

let set = new Set()
module.exports.command = {
    execute(msg, args, client) {
        let bool = commandCooldown(msg, set, 5000)
        if (bool === true) return

        if (args[0] === 'points') {
            query(`SELECT * FROM members ORDER BY points DESC LIMIT 5`, data => {
                let memberList = []
                data[0].forEach(row => {
                    let member = msg.guild.members.cache.find(member => member.id === row.member_id)
                    if (!member) { 
                        memberList.push({"name": `Member not found`, "points": `NULL`})
                        return
                    } else {
                        memberList.push({"name": `${member.displayName}`, "points": `${row.points}`})
                    }
                });
    
                query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                    let thisMember = data[0]
    
                    query(`SELECT * FROM members ORDER BY points LIMIT 5`, data => {
                        let members = data[0]
                        let boolThisMember = ''
    
                        let topChatter = msg.guild.members.cache.find(member => member.displayName === memberList[0].name)
                        let firstplacetext = `${topChatter} is 1st place with over ***${memberList[0].points}*** points!`
    
                        let i
                        for (i = 0; i < memberList.length; i++) {
                            const member = memberList[i];

                            if (i < memberList.length) {
                                if (member.name == msg.member.displayName) {
                                    boolThisMember = '(YOU)'
                                }
                            }
                        }

                        let embed = new Discord.MessageEmbed()
                        .addField(`\u200b`, `**Top 5 Richest Members [All-Time]\n**`)
                        for (i = 0; i < memberList.length; i++) {
                            embed.addField(`**${i+1}. ${memberList[i].name}**`, `Points: ${memberList[i].points}`)
                        }

                        // embed for leaderboard
                        embed.setTitle(`Leaderboard`)
                        .setDescription(`${firstplacetext}`)
                        .setColor(embedcolor)

                        // if member is not in top 5, then add new field
                        if (!memberList.find(member => member.name === msg.member.displayName)) {

                            let index
                            for (index = 0; index < members.length; index++) {
                                const member = members[index];
                                
                                if (member.member_id == msg.member.id) {
                                    let you = msg.guild.members.cache.find(member => member.id === `${thisMember[0].member_id}`)
                                    embed.addField(`\u200b`, `**${index + 1}. ${you.displayName} (YOU)**\nPoints: ${thisMember[0].points}`)
                                }
                            }
                        }

                        msg.channel.send(embed)
                    })
                })
            })
        } else if (args[0] === 'gold' || args[0] === 'rpg') {
            query(`SELECT * FROM members_rpg ORDER BY gold DESC LIMIT 5`, data => {
                let memberList = []
                data[0].forEach(row => {
                    let member = msg.guild.members.cache.find(member => member.id === row.member_id)
                    if (!member) { 
                        memberList.push({"name": `Member not found`, "gold": `NULL`})
                        return
                    } else {
                        memberList.push({"name": `${member.displayName}`, "gold": `${row.gold}`})
                    }
                });

                query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                    let thisMember = data[0]

                    query(`SELECT * FROM members_rpg ORDER BY gold LIMIT 5`, data => {
                        let members = data[0]
                        let boolThisMember = ''

                        let goldEmoji = msg.guild.emojis.cache.find(e => e.name === 'gold')
                        let topChatter = msg.guild.members.cache.find(member => member.displayName === memberList[0].name)
                        let firstplacetext = `${topChatter} is 1st place with over ${goldEmoji} ***${memberList[0].gold}*** gold!`

                        let i
                        for (i = 0; i < memberList.length; i++) {
                            const member = memberList[i];

                            if (i < memberList.length) {
                                if (member.name == msg.member.displayName) {
                                    boolThisMember = '(YOU)'
                                }
                            }
                        }

                        let embed = new Discord.MessageEmbed()
                        .addField(`\u200b`, `**Richest RPG Players [All-Time]\n**`)
                        for (i = 0; i < memberList.length; i++) {
                            embed.addField(`**${i+1}. ${memberList[i].name}**`, `Gold: ${memberList[i].gold}`)
                        }

                        // embed for leaderboard
                        embed.setTitle(`RPG Leaderboard`)
                        .setDescription(`${firstplacetext}`)
                        .setColor(embedcolor)

                        // if member is not in top 5, then add new field
                        if (!memberList.find(member => member.name === msg.member.displayName)) {

                            let index
                            for (index = 0; index < members.length; index++) {
                                const member = members[index];
                                
                                if (member.member_id == msg.member.id) {
                                    let you = msg.guild.members.cache.find(member => member.id === `${thisMember[0].member_id}`)
                                    embed.addField(`\u200b`, `**${index + 1}. ${you.displayName} (YOU)**\nGold: ${thisMember[0].gold}`)
                                }
                            }
                        }

                        msg.channel.send(embed)
                    })
                })
            })
        } else {
            query(`SELECT * FROM members ORDER BY messages DESC LIMIT 5`, data => {
                let memberList = []
                data[0].forEach(row => {
                    let member = msg.guild.members.cache.find(member => member.id === row.member_id)
                    if (!member) { 
                        memberList.push({"name": `Member not found`, "messages": `NULL`})
                        return
                    } else {
                        memberList.push({"name": `${member.displayName}`, "messages": `${row.messages}`})
                    }
                });

                query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                    let thisMember = data[0]

                    query(`SELECT * FROM members ORDER BY messages LIMIT 5`, data => {
                        let members = data[0]
                        let boolThisMember = ''

                        let topChatter = msg.guild.members.cache.find(member => member.displayName === memberList[0].name)
                        let firstplacetext = `${topChatter} is 1st place with over ***${memberList[0].messages}*** messages!`

                        let i
                        for (i = 0; i < memberList.length; i++) {
                            const member = memberList[i];

                            if (i < memberList.length) {
                                if (member.name == msg.member.displayName) {
                                    boolThisMember = '(YOU)'
                                }
                            }
                        }

                        let embed = new Discord.MessageEmbed()
                        .addField(`\u200b`, `**Most Active Players [This Week]\n**`)
                        for (i = 0; i < memberList.length; i++) {
                            embed.addField(`**${i+1}. ${memberList[i].name}**`, `Messages: ${memberList[i].messages}`)
                        }

                        // embed for leaderboard
                        embed.setTitle(`Leaderboard`)
                        .setDescription(`${firstplacetext}`)
                        .setColor(embedcolor)

                        // if member is not in top 5, then add new field
                        if (!memberList.find(member => member.name === msg.member.displayName)) {

                            let index
                            for (index = 0; index < members.length; index++) {
                                const member = members[index];
                                
                                if (member.member_id == msg.member.id) {
                                    let you = msg.guild.members.cache.find(member => member.id === `${thisMember[0].member_id}`)
                                    embed.addField(`\u200b`, `**${index + 1}. ${you.displayName} (YOU)**\nMessages: ${thisMember[0].messages}`)
                                }
                            }
                        }

                        msg.channel.send(embed)
                    })
                })
            })
        }
    }
}