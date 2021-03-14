const { Discord, embedcolor } = require('../../variables');

module.exports.info = {
    name: 'meme',
    category: 'fun',
    usage: '$meme',
    short_description: 'Your daily dose of memes',
    help: {
        enabled: true,
        title: 'Memes Memes Memes',
        aliases: [],
        description: 'wow, a meme, something you haven\'t heard before',
        permissions: ['SEND_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        let snoowrap = require('snoowrap')
        const r = new snoowrap({
            userAgent: process.env.USERAGENT,
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            username: process.env.APIUSERNAME,
            password: process.env.PASSWORD
        })

        function doFn() {
            getSubreddit(() => {})
        }

        function getSubreddit(callback) {
            r.getSubreddit('memes').getRandomSubmission().then(item => {
                if (item.is_video) { return callback([true]) }
                if (item.permalink.endsWith('v')) item.permalink = item.permalink.replace('v','')

                let embed = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setTitle(`${item.title}`)
                .setURL(`https://www.reddit.com${item.permalink}`)
                .setImage(item.url)
                .setFooter(`👤 ${item.author.name} | 👍 ${item.ups} | 💬 ${item.comments.length}`)
                
                callback([false, embed])
            })
        }

        getSubreddit(data => {
            data[0] ? doFn() : msg.channel.send(data[1])
        })
    }
}