const { query } = require('../../functions')
const { embedcolor, Discord } = require('../../variables')

module.exports.info = {
    name: 'daily',
    category: 'points',
    usage: '$daily',
    short_description: 'Receive your daily points',
    help: {
        enabled: true,
        title: 'Receive Daily Points',
        aliases: [],
        description: 'Receive a daily amount of points. Amount of points added each use is +200 points',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        const moment = require('moment')

        query(`SELECT * FROM currency_times WHERE member_id = ${msg.member.id}`, data => {
            result = data[0]
            let format = 'M/D/YYYY H:mm:ss:SSS'
            let currentDate = moment()
            let prevDate
            let nextDate = currentDate.clone().add(1, 'day')

            if (result.length == 0) {
                query(`INSERT INTO currency_times (member_id) VALUES ( '${msg.member.id}')`, () => {
                })
            } else {
                let amountOfMillisecondsLeft;
                let amountOfWeeks;
                let amountOfDays;
                let amountOfHours;
                let amountOfMinutes;
                let amountOfSeconds;
                console.log(result[0])
                if (result[0].daily_date != '') {
                    let enddate = result[0].daily_date.split(' ')
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

                if (result[0].daily_date == '') amountOfMillisecondsLeft = 0

                if (amountOfMillisecondsLeft <= 0) {
                    query(`SELECT * FROM members WHERE member_id = ${msg.member.id}`, data => {
                        let points = data[0][0].points + 200
                        query(`UPDATE currency_times SET daily_date = '${nextDate.format(format)}' WHERE member_id = ${msg.member.id}`)
                        query(`UPDATE members SET points = ${points} WHERE member_id = ${msg.member.id}`)

                        msg.channel.send(new Discord.MessageEmbed()
                        .setTitle(`Here are your daily points, ${msg.author.username}!`)
                        .setDescription(`You got +200 points`)
                        .setColor(embedcolor))
                    })
                } else {
                    let text
                    if (amountOfMillisecondsLeft > 3600000) {
                        minutes = amountOfMinutes - (amountOfHours * 60)
                        text = `in: \n\`${amountOfHours} hours and ${minutes} minutes\``
                    } else {
                        seconds = amountOfSeconds - (amountOfMinutes * 60)
                        text = `in: \n\`${amountOfMinutes} minutes and ${seconds} seconds\``
                    }
                    msg.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Wow, not so fast ${msg.author.username}!`)
                    .setDescription(`Get more daily points ${text}`)
                    .setColor(embedcolor)
                    .setFooter(`Use $help points for more information`))
                }
            }
        })
    }
}