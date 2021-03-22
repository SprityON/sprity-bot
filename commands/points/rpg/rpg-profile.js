const { query, checkRPGprofile } = require("../../../functions")
const { Discord, embedcolor } = require("../../../variables")

module.exports.info = {
    name: 'rpg-profile',
    category: 'points',
    usage: '$rpg-profile <member>',
    short_description: 'View a profile',
    help: {
        enabled: true,
        title: 'View A Profile',
        aliases: ['rpg-stats', 'rpg-p'],
        description: 'View your rpg-profile or that of others!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return

        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0][0]

            const basic_stats_json = JSON.parse(result.basic_stats)
            const body_slots_json = JSON.parse(result.body_slots)
            const hand_slots_json = JSON.parse(result.hand_slots)

            console.log(hand_slots_json)

            let embed = new Discord.MessageEmbed().setColor(embedcolor)
            .setDescription(`User id: ${result.member_id}`)
            .setAuthor(`Profile of ${result.rpg_name} | ${result.gold} Gold, ${result.experience} EXP`)
            .addField(`Basic Stats`, `HP: ${basic_stats_json.health}\nDEF: ${basic_stats_json.defense}\nATT: ${basic_stats_json.attack}`, true)
            .addField(`Body Slots`, `Head: ${body_slots_json.head}\nChest: ${body_slots_json.chest}\nLegs: ${body_slots_json.legs}\nFeet: ${body_slots_json.feet}`, true)
            .addField(`Left Hand`,`${hand_slots_json.left_hand}`,true)
            .addField(`Right Hand`,`${hand_slots_json.right_hand}`,true)

            msg.channel.send(embed)
        })
    }
}