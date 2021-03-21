const { query } = require('../../functions')
const { Discord, embedcolor, space } = require('../../variables')

module.exports.info = {
    name: 'deletefield',
    category: 'utils',
    usage: '$deletefield <table> <field>',
    short_description: 'Deletion of a field',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, amount, client) {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(`Wow, what are you doing? Only administrators can use this command!`)
        if (!args[0]) return msg.channel.send(`You have to provide both a table and a field! Usage: \`$deletefield <table> <field>\``)
        let table = args[0]
        let column = args[1]

        try {
            if (args[0].toLowerCase() === 'list') {
                if (!args[1]) return msg.channel.send(`You also have to provide a column name!`)
                
                query(`SELECT * FROM ${column} LIMIT 1`, data => {
                    let columns = Object.values(data[1])
                    let amount = 0

                    let embed = new Discord.MessageEmbed()
                    .setColor(embedcolor)

                    columns.forEach(column => {
                        amount++
                        embed.addField(`${column.name}`, `Column ${amount}`, true)
                    })

                    embed.setTitle(`Column: ${column} (${amount})`)

                    msg.channel.send(embed)
                })
                
                return
            }

            query(`ALTER TABLE ${table} DROP COLUMN ${column}`)
            msg.channel.send(`Column \`${column}\` dropped from table \`${table}\``)
        } catch (error) {
            msg.channel.send(`Something went wrong... Are you sure you provided both a valid table and field? Usage: \`$deletefield <table> <field>\``)
        }
    }
}