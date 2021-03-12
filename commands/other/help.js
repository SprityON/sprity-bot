module.exports = {
    name: 'help',
    description: 'help',
    category: '',
    aliases: [],
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
                        embed.addField(`${space}`, `${space}`,true)
                    }
                    break
                }
            }

            msg.channel.send(embed)
            return
        } else {
            if (command) {
                
                return
            }
            let num = 0
            let commands = fs.readdirSync(`commands/${category}`).filter(file => file.includes('.'))
            commands.forEach(f => {
                num++
            })

            for (let i = 0; i < commandCategoryFolders.length; i++) {
                const folder = commandCategoryFolders[i];
                if (folder === category) {
                    Functions.helpCategory(category, msg, num, client)
                    return
                }
            }
            
            msg.channel.send(`Category \`${category}\` not found.`)
        }
    },
};