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
        if (commandCooldown(msg, set, 30000) === true) return
        query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
            let randomGold = Math.floor(Math.random() * 50) + 10
            let randomEXP = Math.floor(Math.random() * 15) + 5

            let thisGold = randomGold + data[0][0].gold
            let thisEXP = randomEXP + data[0][0].experience

            let chestLoot = false

            let embed = new Discord.MessageEmbed()
            let message = [`Adventure time!`, `These monsters are hard to kill...`, `Woah, close one!`, `I hope my Sword hasn't been damaged...`, `I'm too powerful for these lowlives!`]
            let randomMessage = message[Math.floor(Math.random() * message.length)]

            function getChest() {
                let chanceChest = Math.floor(Math.random() * 200)
                if (chanceChest >= 0 && chanceChest <= 50) return true
                return false
            }

            if (getChest() === true) {
                const types = ['common', 'rare', 'epic', 'legendary']
                const randomAmount = Math.floor(Math.random() * 1000)
                let randomGold
                let randomEXP

                let thisType
                if (randomAmount < 650) { 
                    thisType = types.find(type => type === 'common');

                    randomGold = Math.floor(Math.random() * 200) + 50
                    randomEXP = Math.floor(Math.random() * 100) + 20
                }
                else if (randomAmount >= 650 && randomAmount < 875) { 
                    thisType = types.find(type => type === 'rare')

                    randomGold = Math.floor(Math.random() * 600) + 200
                    randomEXP = Math.floor(Math.random() * 200) + 50
                }
                else if (randomAmount >= 875 && randomAmount < 995)  {
                    thisType = types.find(type => type === 'epic')

                    randomGold = Math.floor(Math.random() * 2000) + 1500
                    randomEXP = Math.floor(Math.random() * 400) + 200
                }
                else if (randomAmount >= 995 && randomAmount <= 1000) {
                    thisType = types.find(type => type === 'legendary')

                    randomGold = Math.floor(Math.random() * 30000) + 15000
                    randomEXP = Math.floor(Math.random() * 800) + 400
                }

                chestLoot = { gold: randomGold, exp: randomEXP, items: 'none', rareItem: 'none', type: `${thisType}`}
                
                thisGold += chestLoot.gold
                thisEXP += chestLoot.exp

                embed.addField(`You found a ${chestLoot.type.charAt(0).toUpperCase() + chestLoot.type.slice(1)} chest!`, `You got: ${chestLoot.gold} gold and ${chestLoot.exp} EXP.`)
                checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)
            } else checkIfNewLevel(data[0][0].experience, thisEXP, embed, msg.member)

            let adventureGold
            let adventureEXP
            if (chestLoot === false) { adventureGold = thisGold - data[0][0].gold; adventureEXP = thisEXP - data[0][0].experience }
            else { adventureGold = (thisGold - data[0][0].gold) - chestLoot.gold; adventureEXP = (thisEXP - data[0][0].experience) - chestLoot.exp }

            embed.setTitle('🏹  ' + randomMessage)
            embed.setDescription(`You went on a adventure and got ${adventureGold} gold and ${adventureEXP} experience levels`)
            embed.setColor('#00FF00')


            query(`UPDATE members_rpg SET gold = ${thisGold}, experience = ${thisEXP} WHERE member_id = ${msg.member.id}`)

            msg.channel.send(embed)

            const randomAmount = Math.floor(Math.random() * 100) + 1
            if (randomAmount > 0 && randomAmount <= 35) {
                query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
                    let allData = {}
                    const result = data[0][0]
    
                    const enemiesJSON = require('./enemies/enemies_bosses.json')
    
                    function doFn() {
                        determineEnemy(() => {})
                    }
    
                    function determineEnemy(callback) {
                        let pickRandomEnemy = Math.floor(Math.random() * enemiesJSON[0].enemies.length)
                        let enemy = enemiesJSON[0].enemies[pickRandomEnemy]

                        function checkPower(userLevel, enemyDifficulty) {
                            if (userLevel < 4) { if (enemyDifficulty !== 'easy') doFn() }
                            else if (userLevel >= 4 && userLevel < 9) { if (enemyDifficulty !== 'easy') {
                                if (enemyDifficulty !== 'mediun') doFn()
                            } }
                            else if (userLevel >= 8 && userLevel < 13) { if (enemyDifficulty !== 'medium') {
                                if (enemyDifficulty !== 'hard') doFn()
                            } }
                            else {
                                if (enemyDifficulty === 'easy') doFn()
                            }

                            return true
                        }

                        if (checkPower(result.level, enemy.difficulty) === true) {
                            return callback(enemy)
                        }
                    }
    
                    determineEnemy(enemyData => {
                        allData.enemy = enemyData

                        const basic_stats_json = JSON.parse(result.basic_stats)
    
                        let health
                        let attack
        
                        let randomInt
                        switch (allData.enemy.difficulty) {
                            case 'easy':
                                randomInt = (Math.random() * 0.8) + 0.6
                                health = basic_stats_json.health * randomInt
                                attack = basic_stats_json.attack * randomInt
                                
                            break
        
                            case 'medium':
                                randomInt = (Math.random() * 1) + 0.8
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

                        let newEmbed = new Discord.MessageEmbed().setColor('ff0000').setTitle(`${allData.enemy.name} appeared! (Gold Bonus)`)
                        .addField(`Difficulty`, ` ${allData.enemy.difficulty.charAt(0).toUpperCase() + allData.enemy.difficulty.slice(1)}`, true)
                        .addField(`Basic Stats`, `**HP:** ${allData.enemy.health}\n**ATT:** ${allData.enemy.attack}`, true)
                        .addField(`More info`, `Coming Soon`, true)
                        .attachFiles([`./commands/points/rpg/enemies/gifs-pictures/${allData.enemy.name}.png`])
                        .setImage(`attachment://${allData.enemy.name}.png`)

                        msg.channel.send(newEmbed).then(() => { msg.channel.send(`Quick! Use: \`attack\`, \`defend (unavailable)\` or \`run\``) })

                        
                        /***
                        every time that a new awaitMessages() is made, it still exists, ofcourse.
                        we want to check if the amount of awaitMessages() methods are still running. we only need one.
                        so we declare a variable, in this case 'amount', and increment it once we are in a function (except for handlers)

                        so now we can check if there actually were more awaitMessages()
                        this is to actually prevent multiple messages from sending.

                        so if 'amount' is not '1', then it doesnt run the code, since it has already ran.
                        */

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
                                } else { amount = 0; channelMessage() }
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

                                        if (randomInt < 8 && randomInt > 0) {
                                            msg.channel.send(`You successfully blocked **${allData.enemy.name}'s** attack!`)
                                        } else {
                                            let random = Math.floor(Math.random() * 1.05) + 0.95
                                            let damage = allData.enemy.attack * random
                                            userHealth -= damage

                                            lostGold = (result.gold / 100) * 5
    
                                            if (userHealth <= 0) { 
                                                query(`UPDATE members_rpg SET gold = ${lostGold - result.gold} WHERE member_id = ${msg.member.id}`)
                                                return msg.channel.send(`You failed to block and took **${damage} HP**!\nYou lost against **${allData.enemy.name}** and lost ${lostGold} gold. You now have ${lostGold - result.gold} gold left.`) 
                                            }

                                            msg.channel.send(`You failed to block **${allData.enemy.name}'s** attack and took ${damage} HP`)
                                        }

                                        setTimeout(() => {
                                            msg.channel.send(`\nUse: \`attack\`, \`defend (unavailable)\` or \`run\``)
                                            return actionHandler()
                                        }, 1000);
                                    } else {
                                        let random = Math.floor(Math.random() * 1.05) + 0.95
                                        let damage = Math.floor(allData.enemy.attack * random)
                                        userHealth -= damage

                                        if (userHealth <= 0) { 
                                            lostGold = Math.floor((result.gold / 100) * 5)

                                            query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                            return msg.channel.send(`**${allData.enemy.name}** did ${damage} damage, but you died with **${userHealth} HP**!\nYou lost **${lostGold}** gold, and you now have **${result.gold - lostGold}**.`) 
                                        }

                                        setTimeout(() => {
                                            msg.channel.send(`**${allData.enemy.name}** did ${damage} damage! You have **${userHealth} HP** left.\nUse: \`attack\`, \`defend (unavailable)\` or \`run\``)
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
                                            lostGold = (result.gold / 100) * 5

                                            query(`UPDATE members_rpg SET gold = ${result.gold - lostGold} WHERE member_id = ${msg.member.id}`)
                                            return msg.channel.send(`You ran away, but **${allData.enemy.name}** took ${lostGold} of your gold. You now have ${result.gold - lostGold}`) 
                                        }
    
                                        if (action === 'attack') {
                                            let random = Math.floor(Math.random() * 1.05) + 0.95
                                            let damage = basic_stats_json.attack * random
                                            enemyHealth -= damage
                                            if (enemyHealth <= 0) { 
                                                return msg.channel.send(`Good job! You did **${damage}** damage and defeated **${allData.enemy.name}**.`).then(() => {

                                                    // check how hard the enemy was and how much gold the user gets
                                                    let userGold = result.gold
                                                    let goldAmount = (userGold / 100) * 5
                                                    let totalGold

                                                    switch (allData.enemy.difficulty) {
                                                        case 'easy':
                                                            goldAmount = goldAmount * 1.25
                                                            totalGold = goldAmount + result.gold
                                                            msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                            query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                        break
                                                        case 'medium':
                                                            goldAmount = goldAmount * 1.75
                                                            totalGold = goldAmount + result.gold
                                                            msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                            query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                        break
                                                        case 'hard':
                                                            goldAmount = goldAmount * 2.25
                                                            totalGold = goldAmount + result.gold
                                                            msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                            query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                        break
                                                        case 'extreme':
                                                            goldAmount = goldAmount * 3.50
                                                            totalGold = goldAmount + result.gold
                                                            msg.channel.send(`You received **${goldAmount}** gold! You now have **${totalGold}**`)
                                                            query(`UPDATE members_rpg SET gold = ${goldAmount + totalGold} WHERE member_id = ${msg.member.id}`)
                                                        break
                                                    }
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

                            }).catch(collected => {})
                        }
                    })
                })
            }
        })
    }
}