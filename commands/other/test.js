module.exports.info = {
    name: 'test',
    category: '',
    usage: '$vote <text>',
    short_description: 'Send a message as a vote',
    help: {
        enabled: false,
        title: 'Send Message As Vote',
        aliases: [],
        description: 'Command only usable in a vote channel\nOnly for YouTubers or staff',
        permissions: ['MANAGE_MESSAGES']
    }
}

module.exports.command = {
    execute(msg, args, client) {
        function gemiddelde(values) {
            let gemiddelde = 0;

            for (let value of values) gemiddelde += value

            let result = gemiddelde / values.length

            return result
        }

        let nummers = [10, 15, 25]

        console.log(gemiddelde(nummers))
    }
}