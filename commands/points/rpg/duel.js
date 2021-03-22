module.exports.info = {
    name: 'rpg duel',
    category: 'points',
    usage: '$rpg duel <member to duel>',
    short_description: 'Fight a member!',
    help: {
        enabled: true,
        title: 'Duel A Member',
        aliases: [],
        description: 'Fight a member! Beware, if the member has higher stats then you, then you have a higher chance to die!',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if ( checkRPGprofile(msg) === false ) return
       
    }
}