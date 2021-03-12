module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const vars = require('../variables.js')
        const Functions = vars.Functions

        const con = Functions.dbConnection()
        const memberCount = member.guild.members.cache.size
        const channel = member.guild.channels.cache.get('718838641815715880');
        if (!channel) return
        if (member.user.bot === true) return member.roles.add('729698345161064559')
        
        const botCount = member.guild.members.cache.filter(member => member.user.bot).size
        const totalUsersChannelID = guild.channels.cache.get('723051368872673290')
        
        totalUsersChannelID.setName('All Members: ' + (memberCount - botCount).toString())

        channel.send(`Welcome to our server, ${member}! Please read the <#380724759740153866>`);

        var roleMember = member.guild.roles.cache.get('719173522538365008')
        member.roles.add(roleMember)

        const totalBotsChannelID = guild.channels.cache.get('751176168614527007')
        totalBotsChannelID.setName('All Bots: ' + botCount.toString())

        Functions.updateDB.addInventory(member)
        Functions.updateDB.insertInDatabase(member)
        Functions.updateDB.isMemberKicked(member)

        let sql = "SELECT * FROM members"
        con.query(sql, function(err, result, fields) {
            if (err) throw err

            let warnRole = guild.roles.cache.find(role => role.name === "Warning 1")
            let warnRoleTwo = guild.roles.cache.find(role => role.name === "Warning 2")

            for (let row of result) {
                let member = member.guild.members.cache.get(row.member_id)
                if (!member) return
                if (row.warns == 0) {
                    if (member.roles.cache.has(warnRole.id)) { member.roles.remove(warnRole) }
                    if (member.roles.cache.has(warnRoleTwo.id)) { member.roles.remove(warnRoleTwo) }
                }

                if (row.warns == 1) {
                    if (!member.roles.cache.has(warnRole.id)) { member.roles.add(warnRole) }
                    if (member.roles.cache.has(warnRoleTwo.id)) { member.roles.remove(warnRoleTwo) }
                }
                if (row.warns == 2) {
                    if (!member.roles.cache.has(warnRole.id)) { member.roles.add(warnRole) }
                    if (!member.roles.cache.has(warnRoleTwo.id)) { member.roles.add(warnRoleTwo) }
                }
            }
        })
    }
}