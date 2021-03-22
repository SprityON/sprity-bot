module.exports.info = {
    name: 'rpg inventory',
    category: 'points',
    usage: '$rpg inventory <member>',
    short_description: 'View inventory of member',
    help: {
        enabled: true,
        title: 'View Inventory of Member',
        aliases: [],
        description: 'View the inventory of yourself or a member',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}