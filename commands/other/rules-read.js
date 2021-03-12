module.exports = {
    name: 'rules-read',
    description: 'rules-read',
    category: 'other',
    aliases: [],
    async execute(msg, args) {
        
        // *** start of code ***
		let roleFind = msg.member.roles.cache.get('719173192794636368')

		if (roleFind) {
			msg.channel.send(`You already used this command, ${msg.author}!`).then(msg => msg.delete({ timeout: 5000 }));
			msg.delete({timeout: 25})
			return
        }
        
		var role = msg.guild.roles.cache.get('719173192794636368')
		
		await msg.delete({timeout: 25})
		msg.member.roles.add(role)
		
		msg.member.send(`Thank you very much for reading the rules! You have been given the 'Respected Member' role.`)
    },
};