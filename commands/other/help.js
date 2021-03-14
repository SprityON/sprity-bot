module.exports.info = {
    name: 'help',
    category: 'other',
    usage: '$help <category> <command>',
    short_description: 'Show a list of commands/categories',
    help: {
        enabled: true,
        title: 'Help',
        aliases: [],
        description: 'Show a list of commmands or categories',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        const vars = require('../../variables.js')
        const { Discord, fs } = vars
        const Functions = vars.Functions

        let category = args[0]
        let command = args[1]
        const commandCategoryFolders = fs.readdirSync('commands').filter(file => !file.includes('.'))
        if (!category) {
            let embed = new Discord.MessageEmbed()
            .setColor(vars.embedcolor)
            .setTitle(`Command Categories`)
            .setFooter(`For more specific information, do: $help (category)`)

            let num = 0
            commandCategoryFolders.forEach(f => {
                num++

                let config = require(`../config.json`)
                config.forEach(c => {
                    if (f == c.category) {
                        embed.addField(`${c.emote} ${c.title.charAt(0).toUpperCase() + c.title.slice(1)}`,`\`${c.usage}\``, true)
                    }
                })
            });

            let extraFields = 0

            let alt_num = num
            for (i = 0; i < num; i++) {
                let check = alt_num / 3
                if (check.toString().startsWith(Math.floor(check) + '.')) { 
                    extraFields++ 
                    alt_num++
                } else {
                    for (let i = 0; i < extraFields; i++) {
                        embed.addField(`${vars.space}`, `${vars.space}`,true)
                    }
                    break
                }
            }

            msg.channel.send(embed)
            return
        } else {
            let num = 0
            let commands
            let notFound
            try {
                commands = fs.readdirSync(`commands/${category}`).filter(file => file.includes('.'))
                commands.forEach(f => {
                    num++
                })
            } catch (err) {
                notFound = `Category \`${category}\``
            }
            
            
            for (let i = 0; i < commandCategoryFolders.length; i++) {
                const folder = commandCategoryFolders[i];
                if (folder === category) {
                    if (command) {
                        client.commands.includes(command) ? (function() {return Functions.helpCommand(msg, args, num ,client) }) : notFound = `Command \`${command}\` not found`
                    } else {
                        Functions.helpCategory(category, msg, num, client)
                        return
                    }
                }
            }

            msg.channel.send(`${notFound} not found.`)
        }
    }
}