const { Discord, embedcolor } = require('../../variables');

module.exports.info = {
    name: 'yt-info',
    category: 'fun',
    usage: '$yt-info',
    short_description: 'See Sprity\'s amount of subs',
    help: {
        enabled: true,
        title: 'SprityEN channel',
        aliases: ['subs', 'subscribers', 'yt', 'youtube'],
        description: 'View information about the channel of Sprity',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        let YouTube = require('youtube-node')
        let youtube = new YouTube()

        youtube.setKey(process.env.YOUTUBE_TOKEN)

        youtube.getChannelById('UCCctXOcrgNzGLAhjHneMi8Q', (err, data) => {
            if (err) throw err

            let embed = new Discord.MessageEmbed()
            embed.setColor(embedcolor)
            embed.setTitle(`${data.items[0].snippet.title} | YouTube Stats`)
            embed.addField(`Total Viewcount`, `${data.items[0].statistics.viewCount}`,true)
            embed.addField(`Subscribers`, `${data.items[0].statistics.subscriberCount}`,true)
            embed.addField(`Video Amount`, `${data.items[0].statistics.videoCount}`,true)
            msg.channel.send(embed)
        })
    }
}