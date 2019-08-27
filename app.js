const Discord = require('discord.js');
const debug = require('debug')('app.js');
const util = require('./util.js');
global.config = util.readJSON('config.json');

const prefix = config.prefix;

global.client = new Discord.Client();

var commands = {};

function adminWrapper(command) {
    return (message, args) => {
        if (config.admins.indexOf(message.author.id) > -1) {
            command(message, args);
        } else {
            message.channel.send('permission denied');
            debug(`${message.author.username} tried to use admin command. ID: ${message.author.id}`);
        }
    };
}
for(var i = 0; i < config.modules.length; i++) {
    var chat_module = require(`./${config.modules[i]}`);
    debug(`Adding chat module ${config.modules[i]}`);
    for (var command in chat_module.commands) {
        if (! (command in commands)) {
            commands[command] = chat_module.commands[command];
        } else {
            debug(`command with name {command} already exists`);
        }
    }
    
    for (var command in chat_module.admin) {
        if (! (command in commands)) {
            commands[command] = adminWrapper(chat_module.admin[command]);
            debug(`added admin command ${command}`);
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
        args = args.join(' ').split(','); //probably inefficient, but we aren't concerned about performance for now

        for (var i = 0; i < args.length; i++) {
            args[i] = args[i].trim(); //remove leading and trailing whitespace
        }
        try {
            commands[command](message, args);
        } catch (e) {
            message.channel.send(`command \`${command}\` does not exist`);
            debug(e.toString());
        }
    }
});
client.login(config.token);
