const { query } = require('../../../../functions')

module.exports.info = {
    name: 'random_enemy',
    category: 'points',
    usage: 'no usage',
    short_description: 'Random Enemy',
    help: {
        enabled: false,
        title: '',
        aliases: [],
        description: '',
        permissions: []
    }
}

module.exports.command = {
    async execute(msg, args, client) {
        
        async function getData(callback2) {
            query(`SELECT * FROM members_rpg WHERE member_id = ${msg.member.id}`, async data => {
                let allData = {}
                const result = data[0][0]

                const enemiesJSON = require('./enemies_bosses.json')

                function doFn() {
                    determineEnemy(() => {})
                }

                function determineEnemy(callback) {
                    let pickRandomEnemy = Math.floor(Math.random() * enemiesJSON[0].enemies.length - 1)
                    let enemy = enemiesJSON[0].enemies[pickRandomEnemy]

                    let enemyIsOK = false

                    // do some checks
                    if (result.level < 4) { if (enemy.difficulty !== 'easy') { doFn() } else { 
                        enemyIsOK = true
                    } }

                    else if (result.level >= 4 && result.level < 8) { if (enemy.difficulty !== 'easy' && enemy.difficulty !== 'medium') { doFn() } else {
                        enemyIsOK = true
                    } }
                    else if (result.level >= 8 && result.level <= 12) { if (enemy.difficulty !== 'medium' && enemy.difficulty !== 'hard') { doFn() } else {
                        enemyIsOK = true
                    } }
                    else { if (enemy.difficulty === 'easy') { doFn() } else {
                        enemyIsOK = true
                    } }

                    if (enemyIsOK === true) { callback(enemy) } else return doFn()
                }

                determineEnemy(enemyData => {
                    if (!enemyData) doFn()
                    allData.enemy = enemyData
                })

                const basic_stats_json = JSON.parse(result.basic_stats)

                let health
                let attack

                console.log(allData)
                
                if (!allData) doFn()

                switch (allData.enemy.difficulty) {
                    case 'easy':
                        health = basic_stats_json.health * 0.3
                        attack = basic_stats_json.attack * 0.3
                        
                    break

                    case 'medium':
                        health = basic_stats_json.health * 0.5
                        attack = basic_stats_json.attack * 0.5
                        
                    break

                    case 'hard':
                        health = basic_stats_json.health * 1.2
                        attack = basic_stats_json.attack * 1.1
                        
                    break

                    case 'extreme':
                        health = basic_stats_json.health * 1.5
                        attack = basic_stats_json.attack * 1.4
                        
                    break
                }

                allData.enemy.health = parseInt(health)
                allData.enemy.attack = parseInt(attack)

                return callback2(allData)
            })
        }
        let dat = getData(data => {
            console.log('OMFG')
            console.log(data)
            return data
        })
        return dat
    }
}