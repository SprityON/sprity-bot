const vars = require('./variables.js')
const Discord = require('discord.js')
/* RANDOM STUFF */
async function addRoleByReaction(guild, roleUser, reaction, user, msg) {
    const member = reaction.message.guild.member(user)
    if (member.roles.cache.find(roleFind => roleFind.name === roleUser)) return

    let role = guild.roles.cache.find(role => role.name === roleUser)
    member.roles.add(role)

    const embed = new Discord.MessageEmbed()
    .setColor('#7289da')
    .addField("Role:", `${role.name}`)
    .addField("Status:", "Added")
    .setFooter(`By Sprity Bot`)
    .setTimestamp()

    user.send(embed)

    let command = ['added', 'role']
    insertInLog(command, msg, guild, role, user, reaction)
}

async function removeRoleByReaction(guild, roleUser, reaction, user, msg) {
    const member = reaction.message.guild.member(user)
    const botChannel = reaction.message.guild.channels.cache.get('719290506177282140')
    if (!member.roles.cache.find(roleFind => roleFind.name === roleUser)) return

    let role = guild.roles.cache.find(role => role.name === roleUser)
    member.roles.remove(role)

    const embed = new Discord.MessageEmbed()
    .setColor('#7289da')
    .addField("Role:", `${role.name}`)
    .addField("Status:", "Deleted")
    .setFooter(`By Sprity Bot`)
    .setTimestamp()

    user.send(embed)

    let command = ['removed', 'role']
    insertInLog(command, msg, guild, role, user, reaction)
}

function insertInLog(command, msg, guild, role, user, reaction) {
    const logChannel = guild.channels.cache.find(channel => channel.id === "729687704891162645")

    if (command[0] === 'added' || command[0] === 'removed') {
        logChannel.send(`${user.tag} ${command[0].toString()} their ${role.name} role at:\n${reaction.message.createdAt}`)
    } else {
        logChannel.send(`${msg.member.tag} used the ${command[0]} command at:\n${msg.createdAt}`)
    }
}

/* END OF RANDOM STUFF */

/* start of database functions */

function dbConnection() {
    require('dotenv').config()
    const mysql = require('mysql')
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "sprity_bot",
        connectTimeout: 300000
    })
    
    return con
}

var con = dbConnection()

const updateDB = {
    addCurrencytime: async function(member) {
        query(`SELECT * FROM currency_times WHERE member_id = ${member.id}`, data => {
            if (data[0].length == 0) {
                query(`INSERT INTO currency_times (member_id) VALUES (${member.id})`)
            }
        })
    },
    addInventory: async function(member) {
        query(`SELECT * FROM members_inventory WHERE member_id = ${member.id}`, data => {
            if (data[0].length == 0) {
                query(`INSERT INTO members_inventory (member_id) VALUES (${member.id})`)
            }
        })
    },
    updateItemsDB: async function() {
        let items = require('./commands/points/shop-items.json')
        items.items.forEach(item => {
            query(`SELECT * FROM members_inventory`, data => {
                let fields = data[1]

                let index = fields.length - 1
                let lastField = fields[index]

                let item_id = item.id

                let bool = false
                fields.forEach(field => {
                    if (field.name == item_id) {
                        bool = true
                    }
                })
                
                if (bool == false) {
                    query("ALTER TABLE members_inventory ADD `"+item_id+"` INT NOT NULL AFTER `"+lastField.name+"`")
                }
            })
        })
    },
    checkLeaderboard: async function(member) {
        query(`SELECT * FROM leaderboard_stats ORDER BY week DESC`, data => {
            if (data[0][0]) {
                const result = data[0]
                query(`SELECT * FROM members ORDER BY messages DESC LIMIT 1`, data => {
                    let topmemberDB = data[0]
                    let currentDate = new Date()
                    let enddate = result[0].enddate
                    let enddates = enddate.split('/')
                    let day = enddates[1]
                    let year = enddates[2]
                    console.log(year)
                    console.log(currentDate.getFullYear())
                    if (currentDate.getDay() == 1 && currentDate.getDate() == day && currentDate.getFullYear() == year) {
                        let topMember = member.guild.members.cache.find(member => member.id === topmemberDB[0].member_id)

                        const moment = require('moment')
    
                        let month = enddates[0]
    
                        let week = result[0].week
    
                        let endDateMoment = moment([year,month,day], 'YYYYMD')
                        let newBeginDate = `${endDateMoment.month() + 1}/${endDateMoment.date()}/${endDateMoment.year()}`
                        let nEndDate = endDateMoment.add(7, 'days')
                        let newEndDate = `${nEndDate.month() + 1}/${nEndDate.date()}/${nEndDate.year()}`
                        let newWeek = week + 1

                        query(`UPDATE leaderboard_stats SET top_member_id = ${topMember.id}, messages = ${topmemberDB[0].messages} WHERE week = ${week}`)
                        query(`SELECT * FROM members ORDER BY messages DESC LIMIT 5`, data => {
                            let memberList = []
                            data[0].forEach(row => {
                                let Amember = member.guild.members.cache.find(member => member.id === row.member_id)
                                if (!Amember) { 
                                    memberList.push({"name": `Member not found`, "messages": `NULL`})
                                } else {
                                    memberList.push({"name": `${Amember.displayName}`, "messages": `${row.messages}`})
                                }
                            })
                            
                            let embed = new Discord.MessageEmbed()
                            .setTitle(`Top 5 Chatters [Week ${week}]`)
                            .setDescription(`Last week's top chatter (***${memberList[0].messages}*** messages): ${topMember}!`)
                            .addField(`1. ${memberList[0].name}`,`Messages: ${memberList[0].messages}`)
                            .addField(`2. ${memberList[1].name}`,`Messages: ${memberList[1].messages}`)
                            .addField(`3. ${memberList[2].name}`,`Messages: ${memberList[2].messages}`)
                            .addField(`4. ${memberList[3].name}`,`Messages: ${memberList[3].messages}`)
                            .addField(`5. ${memberList[4].name}`,`Messages: ${memberList[4].messages}`)
                            .setFooter(`to find more information about the current leaderboard, use $leaderboard`)
                            .setColor('#7289da')

                            let announcementsChannel = member.guild.channels.cache.find(channel => channel.id === '719173855859703868')
                            
                            announcementsChannel.send(embed)

                            query(`INSERT INTO leaderboard_stats(begindate, enddate, week) VALUES ('${newBeginDate}', '${newEndDate}', '${newWeek}')`)

                            let members = member.guild.members.cache
                            members.forEach(member => {
                                query(`UPDATE members SET messages = '0' WHERE member_id = ${member.id}`)
                            })
                        })
                    }
                })
            }
        })
    },
    checkMuted: function(member) {
        query(`SELECT * FROM timer_dates WHERE member_id = ${member.id}`, data => {
            data[0].forEach(row => {
                if (row.member_id == member.id) {
                    const moment = require('moment')
                    
                    let enddate = result[0].enddate.split(' ')
                    let enddates = enddate[0].split('/')

                    let endtimes = enddate[1].split(':')

                    let month = enddates[0]
                    let day = enddates[1]
                    let year = enddates[2]

                    let hours = endtimes[0]
                    let minutes = endtimes[1]
                    let seconds = endtimes[2]
                    let milliseconds = endtimes[3]
                    
                    let currentDate = new Date()

                    let currentDateMoment = moment([currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(), ' ', currentDate.getHours(),currentDate.getMinutes(),currentDate.getSeconds(),currentDate.getMilliseconds()], 'YYYYMD H:mm:ss:SSS')
                    let endDateMoment = moment([year,month,day,hours,minutes,seconds,milliseconds], 'YYYYMD H:mm:ss:SSS')

                    let amountOfMillisecondsLeft = endDateMoment.diff(currentDateMoment)
                    let muteRole = member.guild.roles.cache.get('731524672629506169')
                    let botchannel = member.guild.channels.cache.find(channel => channel.id === '719290506177282140')

                    muteDurationYears = endDateMoment.diff(currentDateMoment, 'years')
					muteDurationMonths = endDateMoment.diff(currentDateMoment, 'months')
					muteDurationDays = endDateMoment.diff(currentDateMoment, 'days')

					muteDurationHours = endDateMoment.diff(currentDateMoment, 'hours')
					muteDurationMinutes = endDateMoment.diff(currentDateMoment, 'minutes')
					muteDurationSeconds = endDateMoment.diff(currentDateMoment, 'seconds')
					muteDurationMilliseconds = endDateMoment.diff(currentDateMoment)

                    let bool = false
                    if (muteDurationYears > 0) {
                        bool = true
                    }
                    if (muteDurationMonths > 0) {
                        bool = true
                    }
                    if (muteDurationDays > 0) {
                        bool = true
                    }
                    if (muteDurationHours > 0) {
                        bool = true
                    }
                    if (muteDurationMinutes > 0) {
                        bool = true
                    }
                    if (muteDurationSeconds > 0) { 
                        bool = true
                    }
                    if (muteDurationMilliseconds > 0) {
                        bool = true
                    }
                    
                    bool ? (function() {
                        setTimeout(function() {
                            member.roles.remove(muteRole)
                            botchannel.send(`${member} has been unmuted!`)

                            query(`DELETE FROM timer_dates WHERE member_id = ${member.id}`)
                        }, amountOfMillisecondsLeft);
                    }) : (function() {
                        member.roles.remove(muteRole)
                        botchannel.send(`Sorry for the delay, but ${member} has been unmuted!`)
                        
                        query(`DELETE FROM timer_dates WHERE member_id = ${member.id}`)
                    })
                } else return
            })
        })
    },
    isMemberKicked: function(member) {
        query(`SELECT * FROM members WHERE member_id = ${member.id}`, data => {
            let kickedRole = member.guild.roles.cache.find(role => role.name === "Kicked")

            for (let row of data[0]) {
                if (row.kicked == 1) {	
                    if (!member.roles.cache.has(kickedRole.id)){
                        member.roles.add(kickedRole)
                    }
                } else if (row.kicked == 0) {
                    if (member.roles.cache.has(kickedRole.id)) {
                        member.roles.remove(kickedRole)
                    }
                }
            }
        })
    },

    checkMemberWarns: function(member) {
        query(`SELECT * FROM members WHERE member_id = ${member.id}`, data => {
            let warnRole = member.guild.roles.cache.find(role => role.name === "Warning 1")
            let warnRoleTwo = member.guild.roles.cache.find(role => role.name === "Warning 2")

            for (let row of data[0]) {
                if (row.warns == 0) {
                    if (member.roles.cache.has(warnRole.id)) { member.roles.remove(warnRole) }
                    if (member.roles.cache.has(warnRoleTwo.id)) { member.roles.remove(warnRoleTwo) }
                }
    
                if (row.warns == 1) {
                    if (!member.roles.cache.has(warnRole.id)) { member.roles.add(warnRole) }
                    if (member.roles.cache.has(warnRoleTwo.id)) { member.roles.remove(warnRoleTwo) }
                }
    
                if (row.warns == 2) {
                    if (!member.roles.cache.has(warnRole.id)) { member.roles.add(warnRole) }
                    if (!member.roles.cache.has(warnRoleTwo.id)) { member.roles.add(warnRoleTwo) }
                }
            }
        })
    },

    insertInDatabase: function(m) {
        query(`SELECT * FROM members`, data => {
            dbMemberList = []
            for (let row of data[0]) {
                dbMemberList.push({"id": row.id, "member_id": row.member_id})
            }

            let members = m.guild.members.cache
            members.forEach(member => {
                if (member.user.bot == true) return
                if (!dbMemberList.find(m => m.member_id === member.id)) {
                    query(`INSERT INTO members (member_id) VALUES (${member.id})`)
                    let channel = m.guild.channels.cache.get('759072966893240330')
                    channel.send(`Welcome to our server, ${member}! Please read the <#380724759740153866>`)
                    updateDB.addInventory(member)
                }
            })

            dbMemberList.forEach(dbMember => {
                if (!members.find(m => m.id === dbMember.member_id)) {
                    if (dbMember.kicked == false || dbMember.warns == 0) {
                        query(`DELETE FROM members WHERE member_id = ${dbMember.member_id}`)
                    }
                }
            })
        })
    },

    kickMember: function(member) {
        query(`SELECT * FROM members WHERE member_id = ${member.id}`, data => {
            if (data[0][0].kicked == 0) { query(`UPDATE SET kicked = 1 WHERE member_id = ${member.id}`) }
        })
    }
}

function incrementMessageAmountDB(msg) {
    if (msg.channel.type == 'dm') return
    if (msg.member.bot == true) return

    query(`SELECT messages FROM members WHERE member_id = ${msg.member.user.id}`, data => {
        let msgAmount = data[0][0].messages + 1
        query(`UPDATE members SET messages = ${msgAmount} WHERE member_id = ${msg.member.user.id}`, () => {})
    })
}

function addNote(msg, noteText, setting) {
    if (setting == 'public') {
        query(`INSERT INTO notes(member_id, note) VALUES ('${msg.member.id}', '${noteText}')`)
    } else if (setting == 'private') {
        query(`INSERT INTO notes(note) VALUES ('${noteText}')`)
    }
}

function helpCommand(msg, args, num, client) {
    const vars = require('./variables.js')

    let cmd = client.commands.get(args[1])

    let embed = new vars.Discord.MessageEmbed()
    .setTitle(`${cmd.info.help.title} | Help`)
    .setDescription(`**Category: ${args[0]}**\n*${cmd.info.help.description}*\n\n**Usage**\n\`${cmd.info.usage}\`\n\n**Aliases**\n${cmd.info.help.aliases.toString().replace(',',', ')}\n\n**Permissions**\n\`${cmd.info.help.permissions.toString().replace(',' , ', ')}\``)
    .setFooter(`Hope this helps!`)
    .setColor(vars.embedcolor)

    /*
    *
    * Normally, when the last field of an embed is for example the 4th field, then it will space it out (using more space then needed)
    * This makes it less beautiful for the eye. Following code resolves this problem.
    *
    */
   
    let space = '\u200b'
        
    let extraFields = 0

    let alt_num = num - 1
    for (i = 0; i < num; i++) {
        let check = alt_num / 3
        if (check.toString().startsWith(Math.floor(check) + '.')) { 
            extraFields++ 
            alt_num++
        } else {
            for (let i = 0; i < extraFields; i++) {
                embed.addField(`${space}`, `${space}`,true)
            }
            break
        }
    }

    return msg.channel.send(embed)
}

function helpCategory(category, msg, num, client) {
    const vars = require('./variables.js')
    let config = require('./commands/config.json')
    
    config.forEach(c => {
        if (category == c.category) {
            let embed = new vars.Discord.MessageEmbed()
            .setDescription(`*${c.description}*`)
            .setTitle(`${c.emote} ${c.title} | Help`)
            .setFooter(`Hope this helps!`)
            .setColor(vars.embedcolor)
        
            let text = ''
            client.commands.forEach(cmd => {
                if (cmd.info.help.enabled == true) {
                    if (cmd.info.category == category) {
                        let commandName = cmd.info.name.charAt(0).toUpperCase() + cmd.info.name.slice(1)
                        text = ''
                        text += `\`${cmd.info.usage}\`\n*${cmd.info.short_description}*`
                        embed.addField(`${commandName}`,`${text}`,true)
                    }
                }
            });
            
            /*
            *
            * Normally, when the last field of an embed is for example the 4th field, then it will space it out (using more space then needed)
            * This makes it less beautiful for the eye. Following code resolves this problem.
            *
            */

            let space = '\u200b'
        
            let extraFields = 0
        
            let alt_num = num - 1
            for (i = 0; i < num; i++) {
                let check = alt_num / 3
                if (check.toString().startsWith(Math.floor(check) + '.')) { 
                    extraFields++ 
                    alt_num++
                } else {
                    for (let i = 0; i < extraFields; i++) {
                        embed.addField(`${space}`, `${space}`,true)
                    }
                    break
                }
            }
        
            msg.channel.send(embed)
        }
    })
}

function changeInventory(amount, item, msg) {
    const file = require(`./commands/points/items/${item}`)
    let id = file.name
    query("UPDATE `members_inventory` SET "+id+" = "+(amount - 1)+" WHERE member_id = '"+msg.member.id+"'")
}

function publicAdvert(msg) {
    if (msg.channel.id == '818558571410096148') {
        let role = msg.guild.roles.cache.get('818558804617986089')
        if (msg.member.roles.cache.has(role.id)) {
            if (msg.content.includes('@everyone')) {
                msg.reply(`mentioning everyone is not allowed!`).then(msg => msg.delete({timeout: 5000}))
                msg.delete({timeout: 5})
                return
            }
            msg.member.roles.remove(role)
            msg.channel.send(`Removed your ${role} role, **${msg.author.username}**.`).then(msg => msg.delete({timeout: 5000}))
        } else {
            msg.delete({timeout: 100})
            msg.reply(`you are not using the item \`ad_ticket\``).then(msg => msg.delete({timeout: 5000}))
        }
    }
}

normalizePrice = function(number){
    let price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumSignificantDigits: 1}).format(number).replace('$', ' ')
    return price
}

function query(sql, callback) {
    let scnd_arg = arguments[1]
    con.query(sql, function(err,result,fields) {
        if (scnd_arg) {
            callback([result, fields, err])
        }
    })
}

module.exports = { 
    addRoleByReaction, 
    removeRoleByReaction, 
    insertInLog, 
    dbConnection, 
    incrementMessageAmountDB, 
    updateDB, 
    addNote, 
    helpCategory,
    helpCommand,
    changeInventory,
    publicAdvert,
    normalizePrice,
    query
}