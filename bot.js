require('dotenv').config()

let { path, fs, Discord, Functions } = require('./variables.js')
const client = new Discord.Client()

let con = Functions.dbConnection()
con.connect(function(err) {
	if (err) throw err
	console.log("Database connected!")
})

client.commands = new Discord.Collection()

const commandCategoryFolders = fs.readdirSync('./commands').filter(file => !file.endsWith('.js') && !file.endsWith('.json'))
for (const folder of commandCategoryFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`)
	for (const file of commandFiles) {
		if (file.endsWith('.js')) {
			const command = require(`./commands/${folder}/${file}`)
			
			client.commands.set(command.info.name, command)
		}
	}
}

const eventFolders = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const e of eventFolders) {
	const event = require(`./events/${e}`)
	const ifOnce = event ? event.once : false;

	client[ifOnce ? "once" : "on"](path.basename(e, '.js'), (...args) => {
		event.execute(...args,	client)
	})
}

client.login(process.env.TOKEN)