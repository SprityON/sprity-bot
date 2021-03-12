module.exports = {
    name: 'say',
    usage: '$say (text)',
    description: 'Bot says your message',
    category: 'fun',
    aliases: [],
    help: true,
    execute(msg, args) {
        let botmessage = args.join(" ")
        msg.delete({timeout: 100})
        msg.channel.send(botmessage)
    },
};