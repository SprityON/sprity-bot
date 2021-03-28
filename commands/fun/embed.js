const { Discord, embedcolor } = require("../../variables")

module.exports.info = {
    name: 'embed',
    category: '',
    usage: '',
    short_description: '',
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
        // msg.channel.send(new Discord.MessageEmbed()
        // .setTitle(`About The Official Sprity Server`)
        // .setDescription(`Well, hello there! In this channel you will read about all the stuff that our server provides.\n\nInterested? Then check out the following sections!`)
        // .setColor(`#ffaa00`)
        // )

        msg.channel.send(new Discord.MessageEmbed()
        .setTitle(`Rules`)
        .setDescription(`Obviously, just like in any other server, there are <#380724759740153866> which you have to follow.\n\nThere are many great perks you can get in the server, and by disobeying the rules your chance of losing these perks will grow bigger.`)
        .setColor(embedcolor)
        )

        // msg.channel.send(new Discord.MessageEmbed()
        // .setTitle(`Customized Content`)
        // .setDescription(`We have many customized stuff in this server! Read for more info`)
        // .addField(`Points`, `In this server, we have a "currency" called \`points\`.\nWith Points, you can buy your own color role, advertisement tickets (in <#818558571410096148>), change your nickname and much, much more!\n\nQ: Okay sure, having a Points system is fine. But how do you get Points?\nA: You can get Points by either doing: \`$daily\` \`$weekly\` \`$monthly\` OR by creating an RPG account and get Points that way! (\`$rpg start\`)`)
        // .setColor(`00ff00`)
        // )
    }
}