const { Functions, config } = require('../variables.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`)
        client.user.setActivity(`${config.prefix}help`, { type: "LISTENING" })
        let m = client.guilds.cache.get(`${process.env.GUILDID}`).m
        
        Functions.updateDB.checkLeaderboard(m)
        setInterval(() => {
            Functions.updateDB.checkLeaderboard(m)
        }, 30000);
    }
}