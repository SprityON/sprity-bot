const { Functions, Discord, embedcolor } = require("../../variables");

module.exports = {
    name: 'notes',
    usage: '$notes help',
    description: 'Add notes anonimously',
    category: 'fun',
    aliases: ['note'],
    help: true,
    dm: true,
    execute(msg, args) {
        let status = args[0]
        if (status == 'add') {
            let member;
            function sendMessage(msg, text) {
                if (msg.channel.type == 'dm') {
                    member = msg.author.username
                    text = `**${member}**${text}`
                    msg.author.send(text)
                } else {
                    member = msg.member.displayName
                    text = `**${member}**${text}`
                    msg.channel.send(text)
                }
            }

            if (!args[1]) return sendMessage(msg, `, wrong usage! Add a note like this: \`$notes add "Text" (setting)\``)

            let x = args.length - 1
            let setting = args[x]

            args.splice(0,1)
            
            firstChar = args[0].charAt(0)
            if (firstChar != '"') return sendMessage(msg, `, wrong usage! Make sure to add \`""\` in between your text, e.g.: \`$note add "Text" (setting: private/public)\``)

            let temp = []
            let count = 0
            args.forEach(arg => {
                if (!args[1]) {
                    let temp2 = ''
                    for (let index = 0; index < arg.length; index++) {
                        if (count == 2) break
                        let char = arg.charAt(index)
                        
                        if (char != '"') {
                            temp2 += char
                        } else { count++ }
                    } arg = temp2
                } else {
                    let temp2 = ''
                    for (let index = 0; index < arg.length; index++) {
                        if (count == 2) break;
                        let char = arg.charAt(index)

                        if (char != '"') {
                            temp2 += char
                        } else { count++ }
                    } arg = temp2
                }

                temp.push(arg)
            }); args = temp

            noteText = args.toString()

            let temp3 = ''
            for (let index = 0; index < noteText.length; index++) {
                let char = noteText.charAt(index)
                
                if (char == ',') char = ' '
                temp3 += char
            } noteText = temp3

            if (noteText == '' || !noteText) return sendMessage(msg, `, your note needs content!`)

            sendMessage(msg, `, your note has been added.`)

            if (setting == 'public') {
                Functions.addNote(msg, noteText, setting)
            } else if (setting == 'private') {
                Functions.addNote(msg, noteText, setting)
            } else {
                Functions.addNote(msg, noteText, 'public')
            }
        } else if (status == 'remove') {
            // list of registered notes (if selected to be public)
        } else if (status == 'help') {
            let embed = new Discord.MessageEmbed()
            .setTitle(`Notes | Help`)
            .addField("Uh, notes... What are they?",'Notes are multi-purpose anonymous texts for the server and/or yourself!\nYou can choose whether you want your note to be anonymous by specifying a setting.')
            .addField(`Usages and settings`,`*You can either see, add or remove (your own) notes from the server.*\n\nSee global notes: \`$notes\`\nSee your notes: \`$notes me\` *(public notes)*\nAdd a note: \`$notes add "text" (setting: private/public)\`\nRemove a note: \`$notes remove (position: 1,3,37)\``)
            .setColor(embedcolor)

            if (msg.channel.type == 'dm') {
                msg.author.send(embed)
            } else {
                msg.channel.send(embed)
            }
        } else if (!status || !isNaN(status)) {
            if (msg.channel.type == 'dm') {
                return msg.author.send(`I'm sorry, but you can only use the following commands in a DM: \`$notes help\`, \`$notes add\`, \`$notes remove\``)
            }

            Functions.query("SELECT * FROM notes", data => {
                const result = data[0]
                if (!result[0]) return msg.channel.send(`There are no notes in the server, **${msg.member.displayName}**`)
                status = Math.floor(status)

                let lastPage;
                let currentPage;
                if (!status) { currentPage = 1 } else {
                    currentPage = (10 * status) / 10
                }
                let rL = result.length - 1
                
                rL = rL / 10
                if (rL < 1) {
                    lastPage = 1
                } else {
                    lastPage = Math.ceil(rL)
                }

                let text;
                if (lastPage == 1) { text = `there is only **${lastPage}** page.` } else { text = `there are only **${lastPage}** pages.` }
                if (status > lastPage) return msg.channel.send(`**${msg.member.displayName}**, ${text}`)

                let embed = new Discord.MessageEmbed()
                embed.setTitle(`Notes in ${msg.guild.name} [${result.length}]`)
                embed.setFooter(`For more info, use $notes help | Page ${currentPage} of ${lastPage}`)
                embed.setColor(embedcolor)

                let name = ''
                let content = ''
                let i = 0
                let repeats = 0
                let testI = 0
                if (currentPage > 1) { i = ((i + currentPage) * 10) - 10 }
                for (let row of result) {
                    if (testI != i) { testI++ } else {
                        repeats++
                        if (repeats > 10) break;
    
                        let member = msg.guild.members.cache.find(member => member.id === row.member_id)
                        let memberName;
                        if (!member) {
                            memberName = 'Anonymous'
                        } else { memberName = member }
    
                        let id = i + 1
                        name += `${id}. ${memberName}\n`
                        content += `${row.note}\n`
                        
                        testI++
                        i++
                    }
                }

                embed.addField(`Name`,`${name}`, true)
                embed.addField(`Content`,`${content}`, true)

                msg.channel.send(embed)
            })
        }
    },
}