module.exports.info = {
    name: 'rpg-duel',
    category: '',
    usage: '',
    short_description: '',
    help: {
        enabled: true,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}