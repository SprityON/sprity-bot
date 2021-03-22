module.exports.info = {
    name: 'rpg convert',
    category: 'points',
    usage: '$rpg convert <gold amount>',
    short_description: 'Convert gold to points',
    help: {
        enabled: true,
        title: 'Convert Gold To Points',
        aliases: [],
        description: 'You can convert your gold into points with this command',
        permissions: ['SEND_PERMISSIONS']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}