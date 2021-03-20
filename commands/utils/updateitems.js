const { updateDB } = require("../../functions")

module.exports.info = {
    name: 'updateitems',
    category: '',
    usage: '',
    short_description: '',
    help: {
        enabled: false,
        title: 'Give Member a Role',
        aliases: [],
        description: 'Give a member any kind of role (only for upper-staff)',
        permissions: ['MANAGE_GUILD']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        updateDB.updateItemsDB()
        msg.channel.send(`updated`)
    }
}