const { query } = require("../../../functions")

module.exports = {
    name: 'ad_ticket',
    usage: '',
    description: '',
    category: '',
    aliases: [],
    help: false,
    execute(msg, args, amount) {
        let role = msg.guild.roles.cache.find(role => role.id === '818558804617986089')
        if (msg.member.roles.cache.has(role.id)) {
            return msg.channel.send(`**${msg.author.username}**, you are already using **1** ticket.`)
        } else {
            Functions.changeInventory(amount, 'ad_ticket', msg)
            msg.member.roles.add(role)
        }

        msg.channel.send(`**${msg.author.username}**, you can now advertise **once** in <#818558571410096148>.`)
    },
}