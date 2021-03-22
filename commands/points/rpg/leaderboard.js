module.exports.info = {
    name: 'rpg leaderboard',
    category: 'points',
    usage: '$rpg leaderboard',
    short_description: 'View the RPG leaderboard',
    help: {
        enabled: true,
        title: 'View RPG Leaderboard',
        aliases: [],
        description: 'View the top 5 players using the RPG system',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}