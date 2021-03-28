module.exports.info = {
    name: 'settings',
    category: 'points',
    usage: '$rpg settings <setting> <enable|disable>',
    short_description: 'Enable/disable a RPG setting',
    help: {
        enabled: true,
        title: 'RPG Settings',
        aliases: [],
        description: 'Set a setting for your RPG profile',
        permissions: ['SEND_PERMISSIONS']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}