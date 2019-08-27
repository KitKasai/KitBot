debug = require('debug')('chat.js');
util = require('./util.js');

module.exports.commands = {
    ping(message) {
        if (Math.random() < 0.99) {
            message.channel.send('pong');
        } else {
            message.channel.send('ping');
        }
    },

    echo(message, args) {
        debug(`echo called with args ${args}`);
        message.channel.send(args);
    }
}

module.exports.admin = {
    adminecho(message, args) {
        debug(`admin echo called with args ${args}`);
        message.channel.send(`admin: ${args}`);
    },

    addadmin(message, args) {
        if (args.length != 1) {
            util.wrongArgs(message, 'user');
        } else {
            util.getUserFromTag(args[0]).then((user) => {
                if (config.admins.indexOf(user.id) === -1) {
                    config.admins.push(user.id);
                    debug(`admins: ${config.admins}`);
                }
            }).catch((reason) => debug(reason));
        }
    }
}
