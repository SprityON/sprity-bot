module.exports = {
    name: 'guildMemberRemove',
    execute(member, client) {
        const channel = member.guild.channels.cache.get('718838641815715880');
    
        const botCount = member.guild.members.cache.filter(member => member.user.bot).size
        const memberCount = member.guild.members.cache.size
        
        const totalUsersChannelID = member.guild.channels.cache.get('723051368872673290')
        totalUsersChannelID.setName('All Members: ' + (memberCount - botCount).toString())
    
        const totalBotsChannelID = member.guild.channels.cache.get('751176168614527007')
        totalBotsChannelID.setName('All Bots: ' + botCount.toString())
        channel.send(`Sadly, **${member.user.username}** has left the server.`);
    },
};