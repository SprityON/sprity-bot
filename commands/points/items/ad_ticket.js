const { Functions } = require("../../../variables")

module.exports.info = {
    name: 'ad_ticket',
    category: 'points',
    usage: '',
    short_description: 'Ticket for advertising',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    async execute(msg, args, amount, client) {
        let role = msg.member.roles.cache.get('818558804617986089') 
        if(role) {
            return [false, `**${msg.author.username}**, you are already using **1** ticket.`]
        } else {
            Functions.changeInventory(amount, 'ad_ticket', msg)
            msg.member.roles.add('818558804617986089')
            msg.channel.send(`**${msg.author.username}**, you can now advertise **once** in <#818558571410096148>.`)
            return [true]
        }
    }
}