module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const vars = require('../variables.js')
        console.log(`Logged in as ${client.user.tag}!`)
        client.user.setActivity(`${vars.config.prefix}help`, { type: "LISTENING" })
        let guild = client.guilds.cache.get(`${process.env.GUILDID}`)
        let m = guild.me

        let { Functions } = vars
        Functions.updateDB.updateItemsDB()
        Functions.updateDB.insertInDatabase(m)
        Functions.updateDB.checkLeaderboard(m)
        setInterval(() => {
            Functions.updateDB.checkLeaderboard(m)
        }, 30000);

        Functions.query("SELECT * FROM members", data => {
            data[0].forEach(row => {
                let member = guild.members.cache.get(row.member_id)
                if (member) {
                    if (member.user.bot) return
                    Functions.updateDB.addInventory(member)
                    Functions.updateDB.isMemberKicked(member)
                    Functions.updateDB.checkMemberWarns(member)
                    Functions.updateDB.checkMuted(member)

                    let memberRole = guild.roles.cache.find(role => role.name === "Member")
                    if (!member.roles.cache.has(memberRole.id)) {
                        member.roles.add(memberRole)
                    }
                }
            });
        })
    }
}