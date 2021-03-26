const { query } = require('../../functions')
const { Discord, embedcolor, space } = require('../../variables')

module.exports.info = {
    name: 'fields',
    category: 'utils',
    usage: '$deletefield <table> <column>',
    short_description: 'YK',
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

        try {
            let action = args[0].toLowerCase()
            let argumentTwo = args[1].toLowerCase()
            let type = args[2].toLowerCase()
            if (action === 'list') {
                if (!column) return msg.channel.send(`You also have to provide a column name!`)
                
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
            } else if (argumentTwo) {
                if (column) {
                    try {
                        switch (action) {
                            case 'delete':
                                if (type === 'table') {
                                    query(`ALTER TABLE ${table} DROP COLUMN ${column}`)
                                    msg.channel.send(`Column \`${column}\` dropped from table \`${table}\``)
                                }
                            break
                            case 'create' || 'add':
                                if (type === 'table') {
                                    //query(`CREATE TABLE ${argumentTwo}`)
                                }
                            break
                        }
                    } catch (error) {
                        msg.channel.send(`That is not a correct column!`)
                    }
                } else return msg.channel.send(`Provide a column.`)
            } else return msg.channel.send(`Provide a table.`)

        } catch (error) {
            msg.channel.send(`Something went wrong... Are you sure you provided both a valid table and field? Usage: \`$deletefield <table> <field>\``)
        }
    }
}