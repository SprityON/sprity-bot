const { fn } = require("moment")
const { query, checkRPGprofile, checkIfNewLevel, commandCooldown } = require("../../../functions")
const { Discord } = require("../../../variables")

module.exports.info = {
    name: 'rpg adventure',
    category: '$rpg adventure',
    usage: '$rpg adventure',
    short_description: 'Go on an adventure!',
    help: {
        enabled: true,
        title: 'Adventure Time!',
        aliases: ['rpg-adv'],
        description: 'Grab your Sword & Armor and fight some enemies! Low chance of spotting a boss.',
        permissions: ['SEND_MESSAGES']
    }
}

let set = new Set()
module.exports.command = {
    execute(msg, args, client) {
        //if (commandCooldown(msg, set, 30000) === true) return
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
            let randomGold = Math.floor(Math.random() * 10000 / 100 * 0.4) + 5
            let randomEXP = Math.floor(Math.random() * 20) + 5

            let thisGold = randomGold + data[0][0].gold
            let thisEXP = randomEXP + data[0][0].experience

            let chestLoot = false

            let embed = new Discord.MessageEmbed()
            let message = [`Adventure time!`, `These monsters are hard to kill...`, `Woah, close one!`, `I hope my Sword hasn't been damaged...`, `I'm too powerful for these lowlives!`]
            let randomMessage = message[Math.floor(Math.random() * message.length)]

            function getChest() {
                let chanceChest = Math.floor(Math.random() * 200)
                if (chanceChest >= 0 && chanceChest <= 200) return true
                return false
            }

            if (getChest() === true) {
                const types = ['common', 'rare', 'epic', 'legendary']
                const randomAmount = Math.floor(Math.random() * 1000)
                let randomGold
                let randomEXP

                let gold = 10000

                let thisType
                if (randomAmount < 700) { 
                    thisType = types.find(type => type === 'common');

                    randomGold = Math.floor(Math.random() * (gold / 100 * 2.5)) + (gold / 100 * 1.25)
                    randomEXP = Math.floor(Math.random() * 100) + 20
                }
                else if (randomAmount >= 700 && randomAmount < 900) { 
                    thisType = types.find(type => type === 'rare')

                    randomGold = Math.floor(Math.random() * (gold / 100 * 10)) + (gold / 100 * 5)
                    randomEXP = Math.floor(Math.random() * 200) + 50
                }
                else if (randomAmount >= 900 && randomAmount < 995)  {
                    thisType = types.find(type => type === 'epic')

                    randomGold = Math.floor(Math.random() * (gold / 100 * 50)) + (gold / 100 * 25)
                    randomEXP = Math.floor(Math.random() * 400) + 200
                }
                else if (randomAmount >= 995 && randomAmount <= 1000) {
                    thisType = types.find(type => type === 'legendary')

                    randomGold = Math.floor(Math.random() * (gold / 100 * 250)) + (gold / 100 * 125)
                    randomEXP = Math.floor(Math.random() * 800) + 400
                }

                chestLoot = { gold: randomGold, exp: randomEXP, items: 'none', rareItem: 'none', type: `${thisType}`}
            } else checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)

            let adventureGold
            let adventureEXP

            // if chestloot is false then there is no chest
            if (chestLoot === false) { adventureGold = thisGold - data[0][0].gold; adventureEXP = thisEXP - data[0][0].experience }
            else { adventureGold = thisGold - data[0][0].gold; adventureEXP = thisEXP - data[0][0].experience  }

            embed.setTitle('🏹  ' + randomMessage)
            embed.setDescription(`You went on a adventure and got ${adventureGold} gold and ${adventureEXP} experience levels`)
            embed.setColor('#00FF00')

            const randomAmount = Math.floor(Math.random() * 100) + 1
            if (randomAmount > 35) {
                if (chestLoot !== false) {
                    thisGold += chestLoot.gold
                    thisEXP += chestLoot.exp
                    
                    let emoji = msg.guild.emojis.cache.find(e => e.name === `${chestLoot.type}_chest`)
                    embed.addField(`You found a ${emoji} ${chestLoot.type.charAt(0).toUpperCase() + chestLoot.type.slice(1)} chest!`, `You got: ${chestLoot.gold} gold and ${chestLoot.exp} EXP.`)
                    checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)
                    query(`UPDATE members_rpg SET gold = ${thisGold}, experience = ${thisEXP} WHERE member_id = ${msg.member.id}`)

                    msg.channel.send(embed)
                } else {
                    msg.channel.send(embed)
                }
            }
            if (randomAmount > 0 && randomAmount <= 35) {
                query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
                    let allData = {}
                    const result = data[0][0]
    
                    const enemiesJSON = require('./enemies/enemies_bosses.json')
                    let enemy = enemiesJSON[0].enemies

                    let userLevel = result.level

                    if (userLevel < 5) { enemy = enemy.find(e => e.difficulty === 'easy') }
                    
                    else if (userLevel >= 5 && userLevel < 9) {
                        let enemySearchTerms = ['easy', 'medium']
                        let randomEnemy = Math.floor(Math.random() * enemySearchTerms.length)

                        enemy = enemy.find(e => e.difficulty === enemySearchTerms[randomEnemy])
                    }

                    else if (userLevel >= 9 && userLevel < 13) {
                        let enemySearchTerms = ['easy', 'medium', 'hard']
                        let randomEnemy = Math.floor(Math.random() * enemySearchTerms.length)

                        enemy = enemy.find(e => e.difficulty === enemySearchTerms[randomEnemy])
                    }

                    else {
                        let enemySearchTerms = ['easy', 'medium', 'hard', 'extreme']
                        let randomEnemy = Math.floor(Math.random() * enemySearchTerms.length)

                        enemy = enemy.find(e => e.difficulty === enemySearchTerms[randomEnemy])
                    }

                    allData.enemy = enemy

                    if (chestLoot !== false) {
                        let emoji = msg.guild.emojis.cache.find(e => e.name === `unopenedchest`)
                        embed.addField(`${allData.enemy.name} has a ${emoji} ${chestLoot.type.charAt(0).toUpperCase() + chestLoot.type.slice(1)} chest!`, `To open this chest, defeat **${allData.enemy.name}**.`)
                        checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)

                        msg.channel.send(embed)
                    }

                    const basic_stats_json = JSON.parse(result.basic_stats)

                    let health
                    let attack
    
                    let randomInt
                    switch (allData.enemy.difficulty) {
                        case 'easy':
                            randomInt = (Math.random() * 0.95) + 0.85
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'medium':
                            randomInt = (Math.random() * 1.05) + 0.95
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'hard':
                            randomInt = (Math.random() * 1.3) + 1
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'extreme':
                            randomInt = (Math.random() * 1.6) + 1.3
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
                    }

                    allData.enemy.health = parseInt(health)
                    allData.enemy.attack = parseInt(attack)

                    let newEmbed = new Discord.MessageEmbed().setColor('ff0000').setTitle(`${allData.enemy.name} (${allData.enemy.description}) appeared!`)
                    .addField(`Difficulty`, ` ${allData.enemy.difficulty.charAt(0).toUpperCase() + allData.enemy.difficulty.slice(1)}`, true)
                    .addField(`Stats`, `**HP:** ${allData.enemy.health}\n**ATT:** ${allData.enemy.attack}`, true)
                    .addField(`More info`, `Coming Soon`, true)
                    .attachFiles([`./commands/points/rpg/enemies/gifs-pictures/${allData.enemy.name}.png`])
                    .setImage(`attachment://${allData.enemy.name}.png`)

                    msg.channel.send(newEmbed).then(() => { msg.channel.send(`Quick! Use: \`attack\`, \`defend\` or \`run\``) })

                    /***
                    every time that a new awaitMessages() is made, it still exists, ofcourse.
                    we want to check if the amount of awaitMessages() methods are still running. we only need one.
                    so we declare a variable, in this case 'amount', and increment it once we are in a function (except for handlers)

                    so now we can check if there actually were more awaitMessages()
                    this is to actually prevent multiple messages from sending.

                    so if 'amount' is not '1', then it doesnt run the code, since it has already ran.
                    */

                    function ifWonWithChest(bool) {
                        if (chestLoot !== false) {
                            checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)
                            if (bool === true) {
                                query(`UPDATE members_rpg SET gold = ${result.gold + chestLoot.gold}, experience = ${result.experience + chestLoot.exp} WHERE member_id = ${msg.member.id}`)
                                
                                return msg.channel.send(`You stole and opened the chest!\nLoot: **${chestLoot.gold} Gold** & **${chestLoot.exp} EXP**`)
                            } else {
                                return msg.channel.send('You did not get to open the chest.')
                            }
                        }
                    }

                    let amount = 0
                    channelMessage()
                    
                    function actionHandler(anotherAction, healthLeft, action) {
                        if (amount === 1) {
                            if (anotherAction === true) { 
                                if (action === 'defend') {
                                    amount = 0
                                    channelMessage(anotherAction, action)
                                }
                                
                                else {
                                    let damage = healthLeft[0] // i didnt want to make another input
                                    msg.channel.send(`You did **${damage}** damage! **${allData.enemy.name}** has **${healthLeft[1]} HP** left.`)
                                    amount = 0
                                    channelMessage(true) 
                                }
                            } else if (anotherAction === 'missed') {
                                let randomAttack = Math.floor(Math.random() * allData.enemy.attacks.length)
                                let attack = allData.enemy.attacks[randomAttack]

                                let damage = Math.floor(allData.enemy.attack * attack.damage)
                                userHealth -= damage

                                if (userHealth <= 0) return msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${damage}** damage, but you died with **${userHealth} HP**!`)

                                msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${damage} damage**. You have **${userHealth} HP** left.`)

                                msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                amount = 0; channelMessage()
                            } 
                            else { 
                                msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                amount = 0; channelMessage() 
                            }
                        }
                    }

                    let enemyHealth = allData.enemy.health
                    let userHealth = basic_stats_json.health
                    async function channelMessage(anotherAction, action) {
                        amount++
                        if (amount === 1) {
                            if (anotherAction === true) {
                                if (action === 'defend') {
                                    let randomInt = Math.floor(Math.random() * 10) + 1

                                    if (randomInt < 7 && randomInt > 0) {
                                        msg.channel.send(`You successfully blocked **${allData.enemy.name}'s** attack!`)
                                        return actionHandler()
                                    } else {
                                        let random = Math.floor(Math.random() * 1.05) + 0.95
                                        let damage = Math.floor(allData.enemy.attack * random)
                                        userHealth -= damage

                                        lostGold = (result.gold / 100) * 5

                                        if (userHealth <= 0) { 
                                            query(`UPDATE members_rpg SET gold = ${lostGold - result.gold} WHERE member_id = ${msg.member.id}`)
                                            msg.channel.send(`You failed to block and took **${damage} HP**!\nYou lost against **${allData.enemy.name}** and lost **${lostGold}** gold. You now have **${lostGold - result.gold}** gold left.`) 
                                            
                                            ifHasChestRewards(false)
                                        }

                                        msg.channel.send(`You failed to block **${allData.enemy.name}'s** attack and took **${damage} HP**`)
                                        return actionHandler()
                                    }
                                } else {
                                    let missChance = Math.floor(Math.random() * 4) + 1
                                    if (missChance === 1) { 
                                        msg.channel.send(`**${allData.enemy.name}** missed!`) 
                                        return actionHandler()
                                    }

                                    let randomAttack = Math.floor(Math.random() * allData.enemy.attacks.length)
                                    let attack = allData.enemy.attacks[randomAttack]

                                    let damage = Math.floor(allData.enemy.attack * attack.damage)
                                    userHealth -= damage

                                    if (userHealth <= 0) { 
                                        lostGold = Math.floor((result.gold / 100) * 5)

                                        query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                        msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${damage} damage**, but you died with **${userHealth} HP**!\nYou lost **${lostGold}** gold, and you now have **${result.gold - lostGold}**.`) 

                                        ifWonWithChest(false)
                                        return
                                    }

                                    setTimeout(() => {
                                        msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${damage} damage**! You have **${userHealth} HP** left.\nUse: \`attack\`, \`defend\` or \`run\``)
                                        return actionHandler()
                                    }, 1000);
                                }
                            }
                        }

                        amount = 0
                        const filter = m => m.author.id === msg.author.id
                        await msg.channel.awaitMessages(filter, { max: 1 } ).then(collected => {
                            amount++
                            if (amount === 1) {
                                let action = collected.first().content
                                let acceptableActions = ['attack', 'defend', 'run']
    
                                if (acceptableActions.find(action1 => action1 === action)) {
                                    if (action === 'run') { 
                                        lostGold = Math.floor((result.gold / 100) * 5)

                                        query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                        msg.channel.send(`You ran away, but **${allData.enemy.name}** took ${lostGold} of your gold. You now have ${result.gold - lostGold}`)
                                        ifWonWithChest(false)
                                        return
                                    }

                                    if (action === 'attack') {
                                        let missChance = Math.floor(Math.random() * 4) + 1
                                        if (missChance === 1) { 
                                            msg.channel.send(`You missed!`) 
                                            return actionHandler('missed')
                                        }
                                        let random = Math.floor(Math.random() * 1.05) + 0.95
                                        let damage = Math.floor(basic_stats_json.attack * random)
                                        enemyHealth -= damage
                                        if (enemyHealth <= 0) { 
                                            return msg.channel.send(`**${allData.enemy.name}** took **${damage} damage** and was defeated. Good job! `).then(() => {

                                                // check how difficult the enemy was and how much gold the user gets
                                                let userGold = result.gold
                                                let goldAmount = (userGold / 100) * 5
                                                let totalGold

                                                switch (allData.enemy.difficulty) {
                                                    case 'easy':
                                                        goldAmount = Math.floor(goldAmount * 1.25)
                                                        totalGold = Math.floor(goldAmount + result.gold)
                                                        msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                        query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                    break
                                                    case 'medium':
                                                        goldAmount = Math.floor(goldAmount * 1.75)
                                                        totalGold = Math.floor(goldAmount + result.gold)
                                                        msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                        query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                    break
                                                    case 'hard':
                                                        goldAmount = Math.floor(goldAmount * 2.25)
                                                        totalGold = Math.floor(goldAmount + result.gold)
                                                        msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                        query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                    break
                                                    case 'extreme':
                                                        goldAmount = Math.floor(goldAmount * 3.50)
                                                        totalGold = Math.floor(goldAmount + result.gold)
                                                        msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                        query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                    break
                                                }
                                                
                                                ifWonWithChest(true)
                                            })
                                        } else {
                                            actionHandler(true, [damage, enemyHealth])
                                        }
                                    }

                                    if (action === 'defend') {
                                        actionHandler(true, 0, action)
                                    }
                                } else { msg.channel.send(`\`${action}\` is not a valid action!`); actionHandler() }
                            }

                        }).catch(collected => {console.log(collected)})
                    }
                })
            }
        })
    }
}