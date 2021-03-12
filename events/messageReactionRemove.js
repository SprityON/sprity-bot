module.exports = {
    name: 'messageReactionRemove',
    aliases: [],
    async execute(reaction, user, client) {
        // *** important variables ***
        const Functions = require('../functions.js')
        const config = require('../config.json')
        const con = Functions.dbConnection()
        
        // *** start of event ***
        const guild = client.guilds.cache.get('380704827812085780')
	
        if (reaction.message.channel.id == '732895465494020107') {
            switch (reaction.emoji.name) {
                case ('1️⃣'): Functions.removeRoleByReaction(guild, 'Final Stand', reaction, user, reaction.message); break;
                case ('2️⃣'): Functions.removeRoleByReaction(guild, 'DB Online Generations', reaction, user, reaction.message); break;
                case ('✅'): Functions.removeRoleByReaction(guild, 'Active', reaction, user, reaction.message); break;
                case ('4️⃣'): Functions.removeRoleByReaction(guild, 'Destiny 2', reaction, user, reaction.message); break;
                case ('✅'): Functions.removeRoleByReaction(guild, 'Active', reaction, user, reaction.message); break;
            }
        }
        
        if (reaction.message.channel.id == '760217772621430874') {
            switch (reaction.emoji.name) {
                case ('1️⃣'): Functions.removeRoleByReaction(guild, 'Grinder [DBZ FS]', reaction, user, reaction.message); break;
                case ('2️⃣'): Functions.removeRoleByReaction(guild, 'PvP [DBZ FS]', reaction, user, reaction.message); break;
            }
        }
    },
};