const { query } = require('../../functions')
const { embedcolor, Discord } = require('../../variables')

module.exports.info = {
    name: 'weekly',
    category: 'points',
    usage: '$weekly',
    short_description: 'Receive your weekly points',
    help: {
        enabled: true,
        title: 'Receive Weekly Points',
        aliases: [],
        description: 'Receive your weekly points',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        const moment = require('moment')

        query(`SELECT * FROM currency_times WHERE member_id = ${msg.member.id}`, data => {
            let result = data[0]
            let format = 'M/D/YYYY H:mm:ss:SSS'
            let currentDate = moment()
            let prevDate
            let nextDate = currentDate.clone().add(1, 'week')

            if (result.length == 0) {
                query(`INSERT INTO currency_times (member_id, weekly_date) VALUES ('${msg.member.id}', '${nextDate.format(format)}')`, async data => {
                    await data

                    query(`UPDATE members SET points = 2000 WHERE member_id = ${msg.member.id}`)
                })

                msg.channel.send(`Here are your first 2000 points, **${msg.author.username}**!`)
                msg.author.send(new Discord.MessageEmbed()
                .setTitle(`Hi ${msg.author.username}!`)
                .setDescription(`With points you can buy amazing stuff like tickets for advertising, having a custom color role and much, much more (e.g. ranking up)!\n\nUse \`$help points\` for more information about this category.`)
                .setColor(embedcolor)
                .setFooter(`From the Official Sprity Server`)
                )
                return
            } else {
                let amountOfMillisecondsLeft;
                let amountOfWeeks;
                let amountOfDays;
                let amountOfHours;
                let amountOfMinutes;
                let amountOfSeconds;
                if (result[0].weekly_date != '') {
                    let enddate = result[0].weekly_date.split(' ')
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

                    prevDate = moment([year,month,day,hours,minutes,seconds,milliseconds], 'YYYYMD H:mm:ss:SSS')
                    
                    amountOfMillisecondsLeft = prevDate.diff(currentDate)
                    amountOfWeeks = prevDate.diff(currentDate, 'weeks')
                    amountOfDays = prevDate.diff(currentDate, 'days')
                    amountOfHours = prevDate.diff(currentDate, 'hours')
                    amountOfMinutes = prevDate.diff(currentDate, 'minutes')
                    amountOfSeconds = prevDate.diff(currentDate, 'seconds')
                }

                if (result[0].weekly_date == '') amountOfMillisecondsLeft = 0

                if (amountOfMillisecondsLeft <= 0) {
                    query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                        let points = data[0][0].points + 2000
                        query(`UPDATE members SET points = ${points} WHERE member_id = ${msg.member.id}`)
                        msg.channel.send(new Discord.MessageEmbed()
                        .setTitle(`Here are your weekly points, ${msg.author.username}!`)
                        .setDescription(`You received +2,000 points`)
                        .setColor(embedcolor))
                        query(`UPDATE currency_times SET weekly_date = '${nextDate.format(format)}' WHERE member_id = ${msg.member.id}`)
                    })
                } else {
                    let text
                    if (amountOfMillisecondsLeft > 86400000 && amountOfMillisecondsLeft > 3600000) {
                        let hours = amountOfHours - (amountOfDays * 24)
                        let minutes = amountOfMinutes - (amountOfHours * 60)
                        text = `${amountOfDays} days, ${hours} hours and ${minutes} minutes`
                    }
                    else if (amountOfMillisecondsLeft > 3600000 && amountOfMillisecondsLeft < 86400000) {
                        let minutes = amountOfMinutes - (amountOfHours * 60)
                        text = `${amountOfHours} hours and ${minutes} minutes`
                    } else {
                        seconds =  amountOfSeconds - (amountOfMinutes * 60)
                        text = `${amountOfMinutes} minutes and ${seconds} seconds`
                    }
                    msg.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Wow, not so fast ${msg.author.username}!`)
                    .setDescription(`Get more weekly points in: \n\`${text}\``)
                    .setColor(embedcolor)
                    .setFooter(`Use $help points for more information`))
                }
            }
        })
    }
}