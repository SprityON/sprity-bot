const { durationInBetweenMessages, spamCheck, publicAdvert, memberChecks, incrementMessageAmountDB, updateDB } = require('../functions');
const vars = require('../variables')
let set = new Set()
module.exports = {
    name: 'message',
    execute(msg, client) {
        
        if (msg.author.bot == true) return
        memberChecks(msg.member)
        spamCheck(msg, set, 1000)

        let bool = durationInBetweenMessages(msg, set, 5000)
        if (bool === false) incrementMessageAmountDB(msg)
        
        publicAdvert(msg)
        if (!msg.content.startsWith('$')) return
    
        const args = msg.content.slice(vars.config.prefix.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()
        
       client.commands.forEach(cmd => {
            let aliases = cmd.info.help.aliases
            let commandName = cmd.info.name
    
            if (msg.channel.type == 'dm') {
                var dm = true
                if (commandName == command) {
                    if (vars.client.commands.get(commandName).dm) {
                       client.commands.get(commandName).command.execute(msg, args, client)
                    }
                } 
            }
            
            if (!dm) {
                if (aliases) {
                    let alias = aliases.includes(command)
    
                    if (alias === true) {
                        if (commandName == command || alias) {
                            try {
                               client.commands.get(commandName).command.execute(msg, args, client)
                            } catch (error) {
                                console.log('\n***ERROR***\ncouldn\'t execute command: ' + error + '\ncommand of error: ' + command + '\n***ERROR***\n')
                            }
                        }
                    } else {
                        if (commandName == command) {
                            try {
                               client.commands.get(commandName).command.execute(msg, args, client)
                            } catch (error) {
                                msg.channel.send(`Something went wrong... Please try again or contact staff.`)
                                console.log('\n***ERROR***\ncouldn\'t execute command: ' + error + '\ncommand of error: ' + command + '\n***ERROR***\n')
                            }
                        }
                    }
                }
            }
        });
    }
}