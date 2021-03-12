const Discord = require('discord.js')
const config = require('./config.json')
const Functions = require('./functions')
const embedcolor = process.env.EMBEDCOLOR
const fs = require('fs')
let path = require('path')
let space = '\u200b'

module.exports = {
    Discord, 
    config, 
    Functions, 
    fs,
    embedcolor,
    path,
    space
}