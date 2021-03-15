module.exports.info = {
    name: 'noob_role',
    category: '',
    usage: '',
    short_description: '',
    help: {
        enabled: false,
        title: 'Noob Role',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, client) {
        let noobRole = msg.guild.roles.cache.find(role => role.name === 'Noob')
        if (msg.member.roles.has(noobRole.id)) return [false, `You already have this item equipped. Unequip in \`$settings\``]

         msg.member.roles.add(noobRole)
         return true
    }
}