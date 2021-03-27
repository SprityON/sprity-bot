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
        description: 'Grab your weapon and fight some enemies! Low chance of spotting a enemy.\nBuy better weapons in the shop to have a higher success rate.',
        permissions: ['SEND_MESSAGES']
    }
}

let set = new Set()
module.exports.command = {
    execute(msg, args, client) {
        if (commandCooldown(msg, set, 15000) === true) return
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
            let randomGold = Math.floor(Math.random() * 10000 / 100 * 0.25) + 5
            let randomEXP = Math.floor(Math.random() * 20 - 5) + 5

            let thisGold = randomGold + data[0][0].gold
            let thisEXP = randomEXP + data[0][0].experience

            let chestLoot = false

            let embed = new Discord.MessageEmbed()

            function getChest() {
                let chanceChest = Math.floor(Math.random() * 300)
                if (chanceChest >= 0 && chanceChest <= 35) return true
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

                    randomGold = Math.floor(Math.random() * ((gold / 100 * 1) - (gold / 100 * 0.5))) + (gold / 100 * 0.5)
                    randomEXP = Math.floor(Math.random() * 100) + 20
                }
                else if (randomAmount >= 700 && randomAmount < 900) { 
                    thisType = types.find(type => type === 'rare')

                    randomGold = Math.floor(Math.random() * ((gold / 100 * 10) - (gold / 100 * 5))) + (gold / 100 * 5)
                    randomEXP = Math.floor(Math.random() * 200) + 50
                }
                else if (randomAmount >= 900 && randomAmount < 995)  {
                    thisType = types.find(type => type === 'epic')

                    randomGold = Math.floor(Math.random() * ((gold / 100 * 50) - (gold / 100 * 25))) + (gold / 100 * 25)
                    randomEXP = Math.floor(Math.random() * 400) + 200
                }
                else if (randomAmount >= 995 && randomAmount <= 1000) {
                    thisType = types.find(type => type === 'legendary')

                    randomGold = Math.floor(Math.random() * ((gold / 100 * 500) - (gold / 100 * 125))) + (gold / 100 * 125)
                    randomEXP = Math.floor(Math.random() * 800) + 400
                }

                chestLoot = { gold: randomGold, exp: randomEXP, items: 'none', rareItem: 'none', type: `${thisType}`}
            } else checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)

            let adventureGold
            let adventureEXP

            // if chestloot is false then there is no chest
            if (chestLoot === false) { adventureGold = thisGold - data[0][0].gold; adventureEXP = thisEXP - data[0][0].experience }
            else { adventureGold = thisGold - data[0][0].gold; adventureEXP = thisEXP - data[0][0].experience  }

            let emoji = msg.guild.emojis.cache.find(e => e.name === `adventure`)
            let goldEmoji = msg.guild.emojis.cache.find(e => e.name === 'gold')
            let expEmoji = msg.guild.emojis.cache.find(e => e.name === 'exp')
            embed.setTitle(`${emoji} You went on a adventure!`)
            embed.setDescription(`You went on a adventure and got ${goldEmoji} ${adventureGold} gold and ${expEmoji} ${adventureEXP} experience levels`)
            query(`UPDATE members_rpg SET gold = ${adventureGold + data[0][0].gold}, experience = ${adventureEXP + data[0][0].experience} WHERE member_id = ${msg.member.id}`)
            embed.setColor('#00FF00')

            const randomAmount = Math.floor(Math.random() * 100) + 1
            if (randomAmount > 35) {
                if (chestLoot !== false) {
                    thisGold += chestLoot.gold
                    thisEXP += chestLoot.exp
                    
                    emoji = msg.guild.emojis.cache.find(e => e.name === `${chestLoot.type}_chest`)
                    embed.addField(`What's that? You found a ${emoji} ${chestLoot.type.charAt(0).toUpperCase() + chestLoot.type.slice(1)} chest!`, `You got ${goldEmoji} ${chestLoot.gold} gold and ${expEmoji} ${chestLoot.exp} EXP`)
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
                    }
                    msg.channel.send(embed)

                    const basic_stats_json = JSON.parse(result.basic_stats)

                    let health
                    let attack
    
                    let randomInt
                    switch (allData.enemy.difficulty) {
                        case 'easy':
                            randomInt = (Math.random() * (0.95 - 0.85)) + 0.85
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'medium':
                            randomInt = (Math.random() * (1.1 - 0.95)) + 0.95
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'hard':
                            randomInt = (Math.random() * (1.3 - 1.1)) + 1.1
                            health = basic_stats_json.health * randomInt
                            attack = basic_stats_json.attack * randomInt
                            
                        break
    
                        case 'extreme':
                            randomInt = (Math.random() * (1.6 - 1.3)) + 1.3
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

                    setTimeout(() => {
                        msg.channel.send(newEmbed).then(() => { 
                            msg.channel.send(`Quick! Use: \`attack\`, \`defend\` or \`run\``) 
                        })
                    }, 1000)

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
                                
                                return msg.channel.send(`You stole and opened the chest!\nLoot: ${goldEmoji} **${chestLoot.gold} Gold & ${expEmoji} ${chestLoot.exp} EXP**`)
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
                                if (doDamage(msg.member.id) === 'lost') { return }

                                amount = 0
                                channelMessage(true) 
                                
                            } else if (anotherAction === 'missed') {
                                if (doDamage(msg.member.id) === 'lost') return
                                msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                amount = 0; channelMessage()
                            } 
                            else { 
                                amount = 0; channelMessage() 
                            }
                        }

                        amount = 0
                    }

                    let enemyHealth = allData.enemy.health
                    let userHealth = basic_stats_json.health
                    function doDamage(user, extra) {
                        if (amount === 1) {
                            if (user !== msg.member.id) {
                                let inventory = JSON.parse(result.inventory)
                                let equippedWeapon = inventory.find(item => item.equipped === true)
                                let weapons = require('./items/weapons/items.json')

                                let random
                                let attack
                                let attackDescription = ''
                                let damage

                                if (equippedWeapon) {
                                    if (equippedWeapon.equipped === true) {
                                        attack = weapons.find(weapon => weapon.id === equippedWeapon.name)
                                        attackDescription = `You used your **${attack.name}**! `
                                        damage = basic_stats_json.attack * attack.bonuses[0].attack
                                    }
                                } else {
                                    random = Math.floor(Math.random() * 1.01) + 0.99
                                    damage = basic_stats_json.attack * random
                                }
    
                                enemyHealth = enemyHealth - damage

                                if (enemyHealth <= 0) { 
                                    msg.channel.send(`${attackDescription}**${user.enemy.name}** took **${Math.floor(damage)} damage** and was defeated. Good job!`).then(() => {
    
                                        // check how difficult the enemy was and how much gold the user gets
                                        let userGold = result.gold
        
                                        switch (user.enemy.difficulty) {
                                            case 'easy':
                                                msg.channel.send(`You received ${goldEmoji} **${(10000 / 100) * 1.5}** gold! You now have **${(10000 / 100) * 1.5 + result.gold}**`)
                                                query(`UPDATE members_rpg SET gold = ${(10000 / 100) * 1.5 + result.gold} WHERE member_id = ${msg.member.id}`)
                                            break
                                            case 'medium':
                                                msg.channel.send(`You received ${goldEmoji} **${(10000 / 100) * 2}** gold! You now have **${(10000 / 100) * 2 + result.gold}**`)
                                                query(`UPDATE members_rpg SET gold = ${(10000 / 100) * 2 + result.gold} WHERE member_id = ${msg.member.id}`)
                                            break
                                            case 'hard':
                                                msg.channel.send(`You received ${goldEmoji} **${(10000 / 100) * 5}** gold! You now have **${(10000 / 100) * 5 + result.gold}**`)
                                                query(`UPDATE members_rpg SET gold = ${(10000 / 100) * 5 + result.gold} WHERE member_id = ${msg.member.id}`)
                                            break
                                            case 'extreme':
                                                msg.channel.send(`You received ${goldEmoji} **${(10000 / 100) * 25}** gold! You now have **${(10000 / 100) * 10 + result.gold}**`)
                                                query(`UPDATE members_rpg SET gold = ${(10000 / 100) * 10 + result.gold} WHERE member_id = ${msg.member.id}`)
                                            break
                                        }
                                        
                                        ifWonWithChest(true)
                                    })

                                    return 'won'
                                } else {
                                    msg.channel.send(`${attackDescription}You did **${Math.floor(damage)}** damage! \n**${user.enemy.name}** has **${Math.floor(enemyHealth)} HP** left.`)

                                    if (userHealth > 0) {
                                        setTimeout(() => {
                                        }, 1000);
                                    }
                                
                                    return 'continue'
                                }
                            } else if (user === msg.member.id) {
                                let randomAttack = Math.floor(Math.random() * allData.enemy.attacks.length)
                                let attack = allData.enemy.attacks[randomAttack]

                                let damage = allData.enemy.attack * attack.damage
                                userHealth -= damage
    
                                lostGold = Math.floor((result.gold / 100) * 5)
    
                                if (extra === 'defend') {
                                    let randomInt = Math.floor(Math.random() * 10) + 1
    
                                    if (randomInt < 7 && randomInt > 0) {
                                        userHealth += damage
                                        msg.channel.send(`You successfully blocked **${allData.enemy.name}'s** attack!`)
                                        return
                                    } else {
    
                                        if (userHealth <= 0) { 
                                            query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                            msg.channel.send(`You failed to block and took **${Math.floor(damage)} HP**!\nYou lost against **${allData.enemy.name}** and lost ${goldEmoji} **${lostGold}** gold. You now have ${goldEmoji} **${result.gold - lostGold}** gold left.`) 
                                            
                                            ifWonWithChest(false)
                                            return 'lost'
                                        }
                                        msg.channel.send(`You couldn't block **${allData.enemy.name}'s** attack! You took **${Math.floor(damage)} HP**\nYou have **${Math.floor(userHealth)} HP** left.`)
    
                                        return
                                    }
                                }
    
                                if (userHealth <= 0) {
    
                                    query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                    msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${Math.floor(damage)} damage**, but you died with **${Math.floor(userHealth)} HP**!\nYou lost ${goldEmoji} **${lostGold}** gold. You now have ${goldEmoji} **${result.gold - lostGold}**.`) 
    
                                    ifWonWithChest(false)
                                    
                                    return 'lost'
                                } else {
                                    msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${Math.floor(damage)}** damage.\nYou now have **${Math.floor(userHealth)}** HP left.`)
                                    return
                                }
                            }
                        }
                    }

                    async function channelMessage(anotherAction, action) {
                        amount++
                        if (amount === 1) {
                            if (anotherAction === true) {
                                if (action === 'defend') {
                                    msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                    return actionHandler(true)
                                } else {
                                    let missChance = Math.floor(Math.random() * 5) + 1
                                    if (missChance === 1) { 
                                        msg.channel.send(`**${allData.enemy.name}** missed!`) 
                                        return actionHandler()
                                    }

                                    let bool = doDamage(msg.member.id)
                                    if (bool === 'won') { return } else if (bool === 'lost') { return }

                                    msg.channel.send(`**${allData.enemy.name}** used **${attack.name}** and did **${Math.floor(damage)} damage**! You have **${Math.floor(userHealth)} HP** left.\nUse: \`attack\`, \`defend\` or \`run\``)
                                    return actionHandler()
                                }
                            }
                        }

                        amount = 0
                        const filter = m => m.author.id === msg.author.id
                        await msg.channel.awaitMessages(filter, { max: 1 } ).then(collected => {
                            amount++
                            if (amount === 1) {
                                let action = collected.first().content.toLowerCase()
                                console.log(action)
                                let acceptableActions = ['attack', 'defend', 'run']
    
                                if (acceptableActions.find(action1 => action1 === action)) {
                                    if (action === 'run') { 
                                        lostGold = Math.floor((result.gold / 100) * 5)

                                        query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                        msg.channel.send(`You ran away, but **${allData.enemy.name}** took ${goldEmoji} ${lostGold} of your gold. You now have ${goldEmoji} ${result.gold - lostGold}`)
                                        ifWonWithChest(false)
                                        return
                                    }

                                    if (action === 'attack') {
                                        let missChance = Math.floor(Math.random() * 5) + 1
                                        if (missChance === 1) { 
                                            msg.channel.send(`You missed!`) 
                                            actionHandler('missed')
                                            return
                                        }

                                        if (doDamage(allData) === 'won') { return } 
                                        else if ('continue') { if (doDamage(msg.member.id) === 'lost') { return } else { msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``) }}
                                        return actionHandler()
                                    }

                                    if (action === 'defend') {
                                        if (doDamage(msg.member.id, 'defend') === 'lost') return
                                        msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                        return actionHandler()
                                    }
                                } else { 
                                    msg.channel.send(`\`${action}\` is not a valid action!`)
                                    msg.channel.send(`\nUse: \`attack\`, \`defend\` or \`run\``)
                                    return actionHandler() 
                                }
                            }

                        }).catch(collected => {console.log(collected)})
                    }
                })
            }
        })
    }
}