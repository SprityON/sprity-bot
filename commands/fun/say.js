const { config } = require("../../variables")

module.exports.info = {
    name: 'say',
    category: 'fun',
    usage: '$say <text>',
    short_description: 'Bot says your message',
    help: {
        enabled: true,
        title: 'Echo-ing Bot',
        aliases: ['echo'],
        description: 'The bot says the message that you typed in',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        msg.channel.send(msg.content.slice(0, config.prefix.length))
    }
}