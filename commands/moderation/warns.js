const { Discord, Functions, embedcolor, space } = require("../../variables");

module.exports.info = {
    name: 'warns',
    category: 'moderation',
    usage: '$warns <member>',
    short_description: 'See or remove warnings',
    help: {
        enabled: true,
        title: 'See & Remove Warnings',
        aliases: [],
        description: 'See warnings or remove warnings\nUsage to remove a warn: $warns clear <all/amount> <member>',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        let member;
        let mentionedMember = msg.mentions.members.first()
        if (!mentionedMember && !args[0]) { member = msg.member }
        else if (!mentionedMember && args[0] != 'clear' && args[0] != 'help') { 
            let memberID = args[0]
            if (isNaN(memberID)) return msg.reply(`Member ID's don't have any letters in them.`)
            foundMember = msg.guild.members.cache.get(memberID)
            if (!foundMember) return msg.reply(`no user with such an ID exists in this server!`)
            
            member = foundMember
        }
        else { 
            member = mentionedMember
            if (!member) {
                member = msg.member
            }
        }

        Functions.query(`SELECT * FROM members WHERE member_id = ${member.id}`, data => {
            for (let row_one of data[0]) {
                if (!args[0] || args[0].startsWith('<@') && args[0].endsWith('>')) {
                    let reason = ''
                    if (row_one.warns == 0) { reason += 'No warns' }
                    else if (row_one.warns == 1) {
                        reason += `Warns: ${row_one.warns}\n\n**Reasons:**\n1. ${row_one.warning_reason_one}`
                    } else if (row_one.warns == 2) {
                        reason += `Warns: ${row_one.warns}\n\n**Reasons:**\n1. ${row_one.warning_reason_one}\n2. ${row_one.warning_reason_two}`
                    }
    
                    let kicked = ''
                    if (row_one.kicked == 1) {
                        kicked += `Kicked: yes`
                    } else if (row_one.kicked == 0) {
                        kicked += `Kicked: no`
                    }
                    
                    if (member) {
                        const embed = new Discord.MessageEmbed()
                        .setColor(embedcolor)
                        .addField(`All warnings of: ${member.displayName}`, `${reason}`, true)
                        .addField(`${space}`,`${kicked}`, true)
                        .setFooter(`use '$warns help' for more information about this command`)

                        msg.channel.send(embed)
                    }

                    return
                } else if (!args[0] && !isNaN(args[0])) {
                    let reason = ''
                    if (row_one.warns == 0) { reason += 'No warns' }
                    else if (row_one.warns == 1) {
                        reason += `Warns: ${row_one.warns}\n\n**Reasons:**\n1. ${row_one.warning_reason_one}`
                    } else if (row_one.warns == 2) {
                        reason += `Warns: ${row_one.warns}\n\n**Reasons:**\n1. ${row_one.warning_reason_one}\n2. ${row_one.warning_reason_two}`
                    }
    
                    let kicked = ''
                    if (row_one.kicked == 1) {
                        kicked += `Kicked: yes`
                    } else if (row_one.kicked == 0) {
                        kicked += `Kicked: no`
                    }
                    
                    if (member) {
                        const embed = new Discord.MessageEmbed()
                        .setColor(embedcolor)
                        .addField(`All warnings of: ${member.displayName}`, `${reason}`, true)
                        .addField(`${space}`,`${kicked}`, true)
                        .setFooter(`use '$warns help' for more information about this command`)

                        msg.channel.send(embed)
                    }

                    return
                } else if (args[0] == 'help') {
                    const embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)
                    .setTitle(`$warns | Help`)
                    .setDescription(`By using the $warns command, you can either see/remove a member's warns.`)
                    .addField(`${space}`, `**Information**\nOptions:\n\`$warns\`\n\`$warns help\`\n\`$warns clear (amount) (member)\`\n\n**Additional information:**\n- for commands like \`$warns clear\`, you need to be a staff member\n- you may also mention a member: \`$warns (member)\``)
                    .setFooter(`to actually warn a member, use the command: $warn (member) (reason)`)
                    msg.channel.send(embed)
                }

                if (args[0] == 'clear') {
                    if (msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply(`you don't have enough permissions!`)
                    let warn1 = msg.guild.roles.cache.find(role => role.name === 'Warning 1')
                    let warn2 = msg.guild.roles.cache.find(role => role.name === 'Warning 2')

                    let warnsAmount = args[1]
                    let warnsAmountText = args[1]
                    if (warnsAmount == 'all') {
                        warnsAmountText = 'all'
                        if (row_one.warns == 2) { warnsAmount = 0; try { member.roles.remove(warn1)} catch(err) {err}; try { member.roles.remove(warn2)} catch(err) {err} }
                        else if (row_one.warns == 1) { warnsAmount = 0; try { member.roles.remove(warn1) } catch(err) {err} }
                        else if (row_one.warns == 0) { 
                            return msg.reply(`clear unsuccessfull! You tried to clear ${warnsAmountText} warns from a member with 0 warns.`)
                            }

                        sql = `UPDATE members SET warns = ${warnsAmount} WHERE member_id = ${member.id}`
                        con.query(sql, function(err, result, fields) {
                            if (err) throw err
                            msg.channel.send(`Succesfully removed **${row_one.warns}** warn(s) from **${member.displayName}**`)
                        })
                        return
                    }
                    if (isNaN(warnsAmount)) return msg.reply(`\`${warnsAmount}\` is not a number!`)
                    if (warnsAmount > 2) return msg.reply(`you can only clear up to 2 warns!`)
                    if (warnsAmount < 1) return msg.reply(`what are you trying to do? You can only clear 1 - 2 warns!`)

                    if (row_one.warns == 0) {
                        return msg.reply(`clear unsuccessfull! You tried to clear ${warnsAmount} warns from a member with 0 warns.`)
                    }

                    if (warnsAmount == 2) {
                        if (row_one.warns == 2) {
                            warnsAmount = 0
                            warnsAmountText = 2

                            member.roles.remove(warn1)
                            member.roles.remove(warn2)
                        } else if (row_one.warns == 1) {
                            warnsAmount = 0
                            warnsAmountText = 1
                            msg.reply(`you tried to clear 2 warns from a member with 1 warn. 1 warn was removed instead.`)
                            member.roles.remove(warn1)
                        }
                    }
                    else if (warnsAmount == 1) { 
                        if (row_one.warns == 1) {
                            warnsAmount = 0
                            warnsAmountText = 1
                            member.roles.remove(warn1)
                        }
                    }

                    msg.channel.send(`Succesfully removed **${warnsAmountText}** warn(s) from **${member.displayName}**`)
                    Functions.query(`UPDATE members SET warns = ${warnsAmount} WHERE member_id = ${member.id}`)
                }
            }
        })
    }
}