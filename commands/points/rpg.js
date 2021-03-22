const { query } = require("../../functions")
const { Discord, embedcolor } = require("../../variables")

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

                            query(`INSERT INTO members_rpg (member_id, rpg_name, basic_stats, body_slots, hand_slots, gold) VALUES ('${msg.member.id}' , '${rpg_name}', '{health: 100, defense: 0, attack: 20}', '{head: "none", chest: "none", legs: "none", feet: "none"}', '{left_hand: "none", right_hand: "none"}', '100')`)

                            msg.channel.send(new Discord.MessageEmbed()
                            .setTitle(`Profile created with name ${rpg_name}!`)
                            .setColor(embedcolor)
                            .addField(`Get started`, `**$rpg-adventure**\nGo on an adventure and earn some Gold & EXP\n\n**$rpg-convert**\nConvert your Gold into points to use as currency for the server!\n\n**$rpg-inventory**\nView your inventory\n\n**$rpg-leaderboard**\nView the leaderboard of all current top 5 RPG players`)
                            )
                        }).catch(collected => {
                            console.log(collected)
                            msg.channel.send(`Something went wrong creating your profile... Please try again.`)
                        })
                    } else return msg.channel.send(`I wish we had one more fighter... It's dangerous out here!`)
                }).catch(collected => {
                    return msg.channel.send(`Something went wrong... Did too much time pass by?`)
                })
            } else if (args[0] === 'delete') {
                msg.channel.send(`Hey ${msg.member.displayName}, are you sure you want to delete your RPG profile? Please type \`'i am sure'\` to delete your profile`)
                msg.channel.awaitMessages(filter, {max: 1, time: 60000} ).then(collected => {
                    let answer = collected.first().content.toLowerCase()
                    if (answer === 'i am sure') { 
                        query(`DELETE FROM members_rpg WHERE member_id = ${msg.member.id}`)
                        msg.channel.send(`Your RPG profile was successfully deleted. Use \`$rpg\` again to make a new profile.`)
                    }
                }).catch(console.log())
            }
        })
    }
}