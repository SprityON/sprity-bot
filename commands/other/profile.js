const { query } = require('../../functions');
const { Discord, embedcolor, space } = require('../../variables')

module.exports.info = {
    name: 'profile',
    category: 'other',
    usage: '$profile <member>',
    short_description: 'View a profile',
    help: {
        enabled: true,
        title: 'View Profile',
        aliases: [],
        description: 'View the profile of a member',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
		const moment = require('moment')
        let mentionedMember = msg.mentions.members.first()
		let thisMember;

		if (mentionedMember) { thisMember = mentionedMember }
		if (!mentionedMember) { 
			if (!isNaN(args[0])) {
				let memberID = args[0]
				if (memberID.length != 18) return msg.reply(`this is not a valid Member ID.`)

				const findMember = msg.guild.members.cache.find(member => member.id === memberID)

				if (findMember) {
					thisMember = findMember
				} else {
					return msg.reply(`could not find this Member.`)
				}
			} else if (isNaN(args[0])) {
				let memberName = args[0]
				if (memberID.length != 18) return msg.reply(`this is not a valid Member ID.`)

				const findMember = msg.guild.members.cache.find(member => member.name === memberName)

				if (findMember) {
					thisMember = findMember
				} else {
					return msg.reply(`could not find this Member.`)
				}
			} else { thisMember = msg.member }
			
		}

		//let everyoneRole = msg.guild.roles.cache.find(role => role.name === "@everyone")
		let memberRoles = thisMember.roles.cache
		
		let roles = ''
		
		let i = 0
		memberRoles.forEach(role => {
			if (role.name == "@everyone" || role.name == "Kicked") {} else {
				roles += `<@&${role.id}> `
				i++
			}
		});	

		const currentDate = new Date
		const currentDateMoment = moment(currentDate.getDate() + '-' + currentDate.getMonth() + `-` + currentDate.getFullYear(), 'DD-M-YYYY')
		const memberJoinedDate = new Date(thisMember.joinedAt.toLocaleString())
		const memberJoinedDateMoment = moment(memberJoinedDate.getDate() + '-' + memberJoinedDate.getMonth() + `-` + memberJoinedDate.getFullYear(), 'DD-M-YYYY')

		const amountOfDays = currentDateMoment.diff(memberJoinedDateMoment, 'days')
		const amountOfMonths = currentDateMoment.diff(memberJoinedDateMoment, 'months')
		const amountOfYears = currentDateMoment.diff(memberJoinedDateMoment, 'years')

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
		let muted = thisMember.roles.cache.find(role => role.name === "Muted")

		query(`SELECT * FROM timer_dates WHERE member_id = ${thisMember.id}`, data => {
			let result = data[0]
			query(`SELECT * FROM members WHERE member_id = ${thisMember.id}`, data => {
				let member = data[0]
				let durationText = ''
				if (result[0]) {
					let enddate = result[0].enddate.split(' ')
					let enddates = enddate[0].split('/')
			
					let endtimes = enddate[1].split(':')
			
					// create variables according to what we need to use
					let month = enddates[0]
					let day = enddates[1]
					let year = enddates[2]
			
					let hours = endtimes[0]
					let minutes = endtimes[1]
					let seconds = endtimes[2]
					let milliseconds = endtimes[3]
					
					// the current date
					let currentDate1 = new Date()
			
					// make the current date into a moment date
					let currentDateMoment1 = moment([currentDate1.getFullYear(), currentDate1.getMonth() + 1, currentDate1.getDate(), ' ', currentDate1.getHours(),currentDate1.getMinutes(),currentDate1.getSeconds(),currentDate1.getMilliseconds()], 'YYYYMMD H:mm:ss:SSS')
					let endDateMoment = moment([year,month,day,hours,minutes,seconds,milliseconds], 'YYYYMMD H:mm:ss:SSS')

					muteDurationYears = endDateMoment.diff(currentDateMoment1, 'years')
					muteDurationMonths = endDateMoment.diff(currentDateMoment1, 'months')
					muteDurationDays = endDateMoment.diff(currentDateMoment1, 'days')

					muteDurationHours = endDateMoment.diff(currentDateMoment1, 'hours')
					muteDurationMinutes = endDateMoment.diff(currentDateMoment1, 'minutes')
					muteDurationSeconds = endDateMoment.diff(currentDateMoment1, 'seconds')
					muteDurationMilliseconds = endDateMoment.diff(currentDateMoment1)

					if (muteDurationYears > 0) {
						if (muteDurationMonths > 0) {
							durationText += `${muteDurationYears} year(s) and ${muteDurationMonths} months left`
						} else {
							durationText += `${muteDurationYears} year(s) left`
						}
					} else if (muteDurationMonths > 0) {
						durationText += `${muteDurationMonths} month(s) left`
					} else if (muteDurationDays > 0) {
						durationText += `${muteDurationDays} day(s) left`
					} else if (muteDurationHours > 0) {
						durationText += `${muteDurationHours} hour(s) left`
					} else if (muteDurationMinutes > 0) {
						durationText += `${muteDurationMinutes} minute(s) left`
					} else if (muteDurationSeconds > 0) {
						durationText += `${muteDurationSeconds} second(s) left`
					} else if (muteDurationMilliseconds > 0) {
						durationText += `${muteDurationMilliseconds} millisecond(s) left`
					}
				}
				

				if (durationText == '' || !durationText) {
					durationText += 'Not muted'
				}
		
				let warnsText = ''
				if (member[0].warns == 1) {
					warnsText += '1 warning'
				} else if (member[0].warns == 2) {
					warnsText += '2 warnings'
				}
				else {
					warnsText += 'No warnings'
				}
	
				const kicked = msg.member.roles.cache.find(role => role.name === "Kicked")
				let checkIfKicked = ''
				if (kicked) { checkIfKicked = 'Yes' } else { checkIfKicked = 'No' }
	
				const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
				const embed = new Discord.MessageEmbed()
				.setColor(embedcolor)
				.setTitle(`${thisMember.displayName}'s profile`)
				.setDescription(`User ID: \`${thisMember.user.id}\``)
				.setThumbnail(thisMember.user.avatarURL({dynamic: true}))
				.addField(`Roles [${i}]`, `${roles}`, true)
				.addField(`Joined Server`, `${thisMember.joinedAt.toLocaleDateString('en-GB', options)}\n${daysAmount}`, true)
				.addField(space, space, true)
				.addField(`Kicked?`, checkIfKicked, true)
				.addField(`Warns?`, `${warnsText}`, true)
				.addField(`Muted?`, `${durationText}`, true)
				.setFooter(`For this server's information, use $serverinfo`)
				msg.channel.send(embed)
			})
		})
    }
}