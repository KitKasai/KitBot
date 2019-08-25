const Discord = require('discord.js');
const debug = require('debug')('app.js');
const util = require('./util.js');
const config = util.readJSON('config.json');

const prefix = config.prefix;

const client = new Discord.Client();

var commands = {};

for(var i = 0; i < config.modules.length; i++) {
    var chat_module = require(`./${config.modules[i]}`);
    debug(`Adding chat module ${config.modules[i]}`);
    for (var command in chat_module) {
        if (! (command in commands)) {
            commands[command] = chat_module[command];
        } else {
            debug(`command with name {command} already exists`);
        }
    }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.content.charAt(0) === prefix && message.content.length > 1 && !message.author.bot) {
        var args = message.content.slice(prefix.length).split(' ');
        var command = args.shift().toLowerCase();
        args = array.join(' ').split(','); //probably inefficient, but we aren't concerned about performance for now
        try {
            commands[command](message, args);
        } catch (e) {
            debug(e.toString());
        }
    }
});
client.login(config.token);
