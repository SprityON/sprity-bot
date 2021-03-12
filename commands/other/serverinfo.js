const { embedcolor, Discord } = require('../../variables');
module.exports = {
    name: 'serverinfo',
	usage: '$serverinfo',
    description: 'Server info',
    category: 'other',
    aliases: [],
    execute(msg, args) {
		const moment = require('moment')
        
        let memberCount = msg.guild.members.cache.filter(member => !member.user.bot).size
        let botCount = msg.guild.members.cache.filter(member => member.user.bot).size

        let date = new Date(msg.guild.createdAt)
        let dateMoment = moment(date.getDate() + '-' + date.getMonth() + `-` + date.getFullYear(), 'DD-M-YYYY')
        let currentDate = new Date()
        let currentDateMoment = moment(currentDate.getDate() + '-' + currentDate.getMonth() + `-` + currentDate.getFullYear(), 'DD-M-YYYY')

        let amountOfDays = currentDateMoment.diff(dateMoment, 'days')
        let amountOfMonths = currentDateMoment.diff(dateMoment, 'months')
        let amountOfYears = currentDateMoment.diff(dateMoment, 'years')

        let daysAmount = '';
		if (amountOfDays == 1) {
			daysAmount += amountOfDays + ' day ago'
		} else if (amountOfDays < 31 && amountOfMonths == 0){
			daysAmount += amountOfDays + ' days ago'
		} else if (amountOfMonths >= 1 && amountOfYears == 0){
			
			if (amountOfMonths == 1) {
				daysAmount += amountOfMonths + ' month ago'
			} else {
				daysAmount += amountOfMonths + ' months ago'
			}
			
		} else if (amountOfYears >= 1) {

			function monthsLeft(amountOfYears, amountOfMonths) {
				let YearsToMonths = amountOfYears * 12
				let TotalMonths = amountOfMonths - YearsToMonths
				return TotalMonths
			}

			if (amountOfYears == 1) {
				if (amountOfMonths == 1) { 
					daysAmount += amountOfYears + ' year and ' + monthsLeft(amountOfYears, amountOfMonths) + ' month ago'
				} else {
					daysAmount += amountOfYears + ' year and ' + monthsLeft(amountOfYears, amountOfMonths) + ' months ago'
				}
			} else {
				daysAmount += amountOfYears + ' years and ' + monthsLeft(amountOfYears, amountOfMonths) + ' months ago'
			}

			daysAmount = '(' + daysAmount + ')'
		} else {
			daysAmount += ''
		}

		const embed = new Discord.MessageEmbed()
		.setColor(embedcolor)
        .setTitle(`Information of ${msg.guild.name}`)
        .addField(`Total Member Count`,`${msg.guild.members.cache.size}`,true)
        .addField(`Member Count (excl. bots)`,`${memberCount}`,true)
        .addField(`Bot Count`,`${botCount}`,true)
        .addField(`Server Creation Date`, `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${daysAmount}`)
        
        msg.channel.send(embed)
    },
};