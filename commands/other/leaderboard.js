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
        let bool = commandCooldown(msg, set, 15000)
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
                        let boolThisMember1 = ''
                        let boolThisMember2 = ''
                        let boolThisMember3 = ''
                        let boolThisMember4 = ''
                        let boolThisMember5 = ''
    
                        let topChatter = msg.guild.members.cache.find(member => member.displayName === memberList[0].name)
                        let firstplacetext = `${topChatter} is 1st place with over ***${memberList[0].points}*** points!`
    
                        let i
                        for (i = 0; i < memberList.length; i++) {
                            const member = memberList[i];
    
                            if (member.name == msg.member.displayName) {
                                switch (i) {
                                    case 0: boolThisMember1 = '(YOU)'; firstplacetext = `You are 1st place with over ***${memberList[0].points}*** points!`; break;
                                    case 1: boolThisMember2 = '(YOU)'; break;
                                    case 2: boolThisMember3 = '(YOU)'; break;
                                    case 3: boolThisMember4 = '(YOU)'; break;
                                    case 4: boolThisMember5 = '(YOU)'; break;
                                }
                            }
                        }
    
                        // embed for leaderboard
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Leaderboard`)
                        .setDescription(`${firstplacetext}`)
                        .addField(`\u200b`, `**Top 5 Richest [All-Time]\n**`)
                        .addField(`**1. ${memberList[0].name} ${boolThisMember1}**`,`Points: ${memberList[0].points}`)
                        .addField(`**2. ${memberList[1].name} ${boolThisMember2}**`,`Points: ${memberList[1].points}`)
                        .addField(`**3. ${memberList[2].name} ${boolThisMember3}**`,`Points: ${memberList[2].points}`)
                        .addField(`**4. ${memberList[3].name} ${boolThisMember4}**`,`Points: ${memberList[3].points}`)
                        .addField(`**5. ${memberList[4].name} ${boolThisMember5}**`,`Points: ${memberList[4].points}`)
                        .setColor(embedcolor)
    
                        // if member is not in top 5, then add new field
                        if (!memberList.find(member => member.name === msg.member.displayName)) {
    
                            let index
                            for (index = 0; index < members.length; index++) {
                                const member = members[index];
                                
                                if (member.member_id == msg.member.id) {
                                    let you = msg.guild.members.cache.find(member => member.id === `${thisMember.member_id}`)
                                    embed.addField(`\u200b`, `**${index + 1}. ${you.displayName} (YOU)**\nPoints: ${thisMember[0].points}`)
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
                        let boolThisMember1 = ''
                        let boolThisMember2 = ''
                        let boolThisMember3 = ''
                        let boolThisMember4 = ''
                        let boolThisMember5 = ''

                        let topChatter = msg.guild.members.cache.find(member => member.displayName === memberList[0].name)
                        let firstplacetext = `${topChatter} is 1st place with over ***${memberList[0].messages}*** messages!`

                        let i
                        for (i = 0; i < memberList.length; i++) {
                            const member = memberList[i];

                            if (member.name == msg.member.displayName) {
                                switch (i) {
                                    case 0: boolThisMember1 = '(YOU)'; firstplacetext = `You are 1st place with over ***${memberList[0].messages}*** messages!`; break;
                                    case 1: boolThisMember2 = '(YOU)'; break;
                                    case 2: boolThisMember3 = '(YOU)'; break;
                                    case 3: boolThisMember4 = '(YOU)'; break;
                                    case 4: boolThisMember5 = '(YOU)'; break;
                                }
                            }
                        }

                        // embed for leaderboard
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Leaderboard`)
                        .setDescription(`${firstplacetext}`)
                        .addField(`\u200b`, `**Top 5 Chatters [This Week]\n**`)
                        .addField(`**1. ${memberList[0].name} ${boolThisMember1}**`,`Messages: ${memberList[0].messages}`)
                        .addField(`**2. ${memberList[1].name} ${boolThisMember2}**`,`Messages: ${memberList[1].messages}`)
                        .addField(`**3. ${memberList[2].name} ${boolThisMember3}**`,`Messages: ${memberList[2].messages}`)
                        .addField(`**4. ${memberList[3].name} ${boolThisMember4}**`,`Messages: ${memberList[3].messages}`)
                        .addField(`**5. ${memberList[4].name} ${boolThisMember5}**`,`Messages: ${memberList[4].messages}`)
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