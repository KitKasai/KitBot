const mongoose = require('mongoose');
const debug = require('debug')('tft_event.js');

const util = require('./util.js');

mongoose.connect('mongodb://localhost/tft_event', {useNewUrlParser:true});
const Schema = mongoose.Schema;

var userSchema = new Schema({
    discordId: String,
    leagueUsername: String,
    challenges: [{id: String, complete: Boolean}],
    score: Number
});

var User = mongoose.model('User', userSchema);

module.exports.commands = {
    register(message, args) {
        //register user for tft competition
        //args: leagueUsername
        //if user is already registered, do not let them register again
        if (args.length != 1) {
            util.wrongArgs(message, ['leagueUsername']);
            return;
        }
        var username = args[0]; //sanitize input?
        isUserRegistered(message.author.id).then(registered => {
            if (registered) {
                message.channel.send('Already registered! If you would like to change your registered username, please contact an event mod');
            } else {
                var user = new User({
                    discordId: message.author.id,
                    leagueUsername: username,
                    challenges: [],
                    score: 0
                });
                user.save();
                message.channel.send(`Registered as ${username}`);
            }
        });
    },
};

module.exports.admin = {
    unregister(message, args) {
        util.getUserFromTag(args[0]).then((user) => {
            User.deleteOne({discordId: user.id}).then(() => {
                message.channel.send(`User ${user.username} unregistered from competition`);
            });
        });
    },

    approve(message, args) {
        //approve a user's submission for a challenge
        //args: challengeId, leagueUsername
    },

    deny(message, args) {
        //deny a user's submission for a challenge
        //args: challengeId, leagueUsername, reason
    },

    rename(message, args) {
        //change the registered username for a user
        //args: @user, newName
        if (args.length != 2) {
            util.wrongArgs(message,['@user', 'newLeagueUsername']);
            return;
        }
        util.getUserFromTag(args[0]).then((user) => {
            User.updateOne({discordId: user.id}, {leagueUsername: args[1]}).then(() => message.channel.send(`${args[0]} renamed to ${args[1]}`));
        });
    }
};
function getLeagueUsername(discordId, callback) {
    //callback is called with username, null if the user is not registered
    return User.findOne({'discordId': discordId}).then((user) => {
        return new Promise((resolve, reject) => {resolve(user.leagueUsername)})
    });
}

function isUserRegistered(discordId) {
    //returns a promise containing a boolean of whether or not the user is registered 
    return User.findOne({'discordId': discordId}).then((user) => {
        debug(`isUserRegistered: ${user}`);
        return new Promise((resolve, reject) => {resolve(user!==null)})
    }).catch((reason) => debug(reason));
}
