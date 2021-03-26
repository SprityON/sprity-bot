const { query } = require("../../functions")
const { Discord, embedcolor, fs } = require("../../variables")

module.exports.info = {
    name: 'rpg',
    category: 'points',
    usage: '$rpg <info|start>',
    short_description: 'Start your RPG adventure!',
    help: {
        enabled: true,
        title: 'RPG adventure',
        aliases: [],
        description: 'Start an RPG adventure, or read some information about it',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {

            const filter = m => m.author.id === msg.author.id
            if (!args[0]) return msg.channel.send(`Invalid usage! Use either \`start\` or \`info\` as first argument.`) 
            
            else if (args[0].toLowerCase() === 'start') { 
                if (data[2] || data[0].length == 0) { // if it errors out
                    msg.channel.send(`Hmm... seems like you don't have a RPG profile yet. Want to create one? (y/n)`)
                    
                    msg.channel.awaitMessages(filter, {max: 1, time: 60000} )
                    .then(collected => {
                        let answer = collected.first().content
                        
                        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                            msg.channel.send(`Before we actually create your profile, what would you like your RPG name to be?`)

                            msg.channel.awaitMessages(filter, {max: 1, time: 180000} )
                            .then(collected => {
                                const rpg_name = collected.first().content
                                if (rpg_name.toLowerCase() === 'cancel' || rpg_name.toLowerCase() === 'no' || rpg_name.toLowerCase() === 'n') return msg.channel.send(`We were almost there... But I cancelled your RPG profile creation.`)
                                
                                if (rpg_name.length > 18) return msg.channel.send(`Your name is too long! Names are only allowed to have 18 characters.`)
    
                                query(`INSERT INTO members_rpg (member_id, rpg_name, inventory, basic_stats, body_slots, hand_slots, gold, level) VALUES ('${msg.member.id}' , '${rpg_name}', '[{"name": "stick", "amount": 1, "equipped": false}, {"name": "test", "amount": 1, "equipped": false}]', '{"health": 100, "defense": 0, "attack": 20}', '{"head": "none", "chest": "none", "legs": "none", "feet": "none"}', '{"left_hand": "none", "right_hand": "none"}', '100', '1')`)
    
                                msg.channel.send(new Discord.MessageEmbed()
                                .setTitle(`Hi ${rpg_name}!`)
                                .setColor(embedcolor)
                                .addField(`Get started`, `Use command \`$rpg info\` to read information about how to use the RPG System!`)
                                )
                            }).catch(collected => {
                                console.log(collected)
                                msg.channel.send(`Something went wrong creating your profile... Please try again.`)
                            })
                        } 
                        
                        else return msg.channel.send(`I wish we had one more fighter... It's dangerous out here!`)
                    }).catch(collected => { return msg.channel.send(`Something went wrong... Did too much time pass by?`) })
                } else return msg.channel.send(`You already have a RPG profile! Go on an adventure: \`$rpg adventure\``)

            } else if (args[0].toLowerCase() === 'info' || args[0].toLowerCase() === 'help') {
                if (args[1]) {
                    try {
                        const searchItem = require(`./rpg/${args[1]}`)

                        let embed = new Discord.MessageEmbed()
                        .setTitle(`${searchItem.info.help.title} | Help`)
                        .setDescription(`**Category: ${searchItem.info.category}**\n*${searchItem.info.help.description}*\n\n**Usage**\n\`${searchItem.info.usage}\`\n\n**Aliases**\n${searchItem.info.help.aliases.toString().replace(',',', ')}\n\n**Permissions**\n\`${searchItem.info.help.permissions.toString().replace(',' , ', ')}\``)
                        .setFooter(`Hope this helps!`)
                        .setColor(embedcolor)

                        msg.channel.send(embed)
                    } catch (error) {
                        msg.channel.send(`Something went wrong... Is your argument correct?`)
                    } 
                } else {
                    const rpg_commands = fs.readdirSync('./commands/points/rpg').filter(file => file.endsWith('.js'))

                    let embed = new Discord.MessageEmbed().setColor(embedcolor).setTitle(`RPG Help`)
                    for (let cmd of rpg_commands) {
                        const searchItem = require(`./rpg/${cmd}`)

                        embed.addField(`${searchItem.info.help.title}`, `\`${searchItem.info.usage}\`\n${searchItem.info.short_description}`, true)
                    }
                    
                    msg.channel.send(embed)
                }
            } 
            
            else if (args[0].toLowerCase() === 'delete') {
                msg.channel.send(`Hey ${msg.member.displayName}, are you sure you want to delete your RPG profile? Please type \`'I am sure'\` to delete your profile`)
                msg.channel.awaitMessages(filter, {max: 1, time: 60000} ).then(collected => {
                    let answer = collected.first().content.toLowerCase()
                    if (answer === 'i am sure') { 
                        query(`DELETE FROM members_rpg WHERE member_id = ${msg.member.id}`)
                        msg.channel.send(`Your RPG profile was successfully deleted. Use \`$rpg\` again to make a new profile.`)
                    }
                }).catch(console.log())
            } else {
                if (data[2] || data[0].length == 0) return msg.channel.send(`Please create a profile first by using command \`$rpg start\``)

                let command = args[0]

                try {
                    const searchItem = require(`./rpg/${command}`)
                    searchItem.command.execute(msg, args, client)
                } catch (error) {
                    return msg.channel.send(`\`${command}\` is not a rpg command!`)
                }
            }
        })
    }
}