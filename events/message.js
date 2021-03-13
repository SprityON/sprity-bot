module.exports = {
    name: 'message',
    execute(msg, client) {
        const vars = require('../variables.js')
        const Functions = vars.Functions
        
        if (msg.author.bot == true) return
        Functions.incrementMessageAmountDB(msg)
        Functions.publicAdvert(msg)
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
                                console.log('\n***ERROR***\ncouldn\'t execute command: ' + error + '\ncommand of error: ' + command + '\n***ERROR***\n')
                            }
                        }
                    }
                }
            }
        });
    }
}