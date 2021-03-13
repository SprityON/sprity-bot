module.exports.info = {
    name: 'rules',
    category: 'other',
    usage: '$rules',
    short_description: 'Read the rules',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    execute(msg, args, client) {
		let roleFind = msg.member.roles.cache.get('380721348856774661')
		if (!roleFind) {
			msg.reply('please read the rules in <#380724759740153866>!')
			return
		}

		const embedMessage = {
			title: "Official Sprity Server | Rules",
			description: "Abide by these rules and you'll be safe!",
			color: 7506394,
			fields: [
				{
				name: "​",
				value: "​"
				},
				{
				name: "Rule #1",
				value: "Show proper respect and manners",
				inline: true
				},
				{
				name: "Rule #2",
				value: "No violence against staff or our members",
				inline: true
				},
				{
				name: "Rule #3",
				value: "Abuse of power is disallowed",
				inline: true
				},
				{
				name: "Rule #4",
				value: "Use bot commands in the correct channel",
				inline: true
				},
				{
				name: "Rule #5",
				value: "Promotions will be handled by the owner, and will not be asked for",
				inline: true
				},
				{
				name: "Rule #6",
				value: "Don't ping staff without consent (even staff aren't allowed to ping staff)\n*only ping staff when the user is active*",
				inline: true
				},
				{
				name: "Rule #7",
				value: "Don't invite other servers without permission by the owner.",
				inline: true
				},
				
				{
				name: "​Rule #8",
				value: "Swearing is not allowed when it is directed to Staff or a Member in a hurtful way.",
				inline: true
				},
				{
				name: "​",
				value: "​",
				inline: true
				},
				{
				name: "\u200B",
				value: "\u200B"
				},
				{
				name: "Q: When will I be kicked?",
				value: "A: You will get kicked when you are doing one of the following:\n- breaking the rules 3x in a row",
				inline: true
				},
				{
				name: "Q: When will I be banned?",
				value: "A: Being banned is caused by:\n- breaking the rules 3x again after already being kicked",
				inline: true
				},
				{
				name: "Q: Can I get an unban from the server?",
				value: "A: A ban will be permanent\n*except for rare cases, such as accidents*",
				inline: true
				},
				{
				name: "Q: Are there rules in specific channels? If so, where can I see those rules?",
				value: "A: Rules in specific channels can be read in their descriptions.",
				inline: true
				},
				{
				name: "​",
				value: "​",
				inline: true				
				},
				{
				name: "​",
				value: "​",
				inline: true				
				},
				{
				name: "​",
				value: "​"
				},
				{
				name: "Thanks for reading the rules!",
				value: "Check out our points system by using the command: \`$help points\`! And you may use the secret ||$rules-read|| command!"
				},
				{
				name: "​",
				value: "​"
				}
			],
			footer: {
				text: "That's it! For other information, use $help"
			}
		
		}
		msg.channel.send({ embed: embedMessage })
    }
}