const { query } = require("../../functions")

module.exports.info = {
    name: 'test',
    category: '',
    usage: '$vote <text>',
    short_description: 'Send a message as a vote',
    help: {
        enabled: false,
        title: 'Send Message As Vote',
        aliases: [],
        description: 'Command only usable in a vote channel\nOnly for YouTubers or staff',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        
    }
}