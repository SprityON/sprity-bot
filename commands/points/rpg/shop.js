module.exports.info = {
    name: 'rpg shop',
    category: 'points',
    usage: '$rpg shop <category> <page>',
    short_description: 'Buy RPG items',
    help: {
        enabled: true,
        title: 'RPG Shop',
        aliases: [],
        description: 'Buy RPG items and boosts!',
        permissions: ['SEND_PERMISSIONS']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        Functions.updateDB.updateItemsDB()
        
        
    }
}