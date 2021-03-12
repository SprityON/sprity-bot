module.exports = {
name: 'settings',
usage: '$settings (category)',
description: 'See or change settings',
category: 'other',
aliases: [],
help: false,
execute(msg, args, Discord, embedcolor, space) {
    // *** important variables ***
    const moment = require('moment')
    const Functions = require('../../functions.js')
    const config = require('../../config.json')
    const con = Functions.dbConnection()
    
    // *** start of code ***

    let sql = `SELECT * FROM members WHERE member_id = ${msg.member.id}`
    con.query(sql, function(err, result,fields) {
        for (let row of result) {
            if (row.staff == 1) {
                
            } else {
                return msg.reply(`you don\'t have enough permissions!`)
            }
        }
    })
},
}