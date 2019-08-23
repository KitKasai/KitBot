const mongoose = require('mongoose');
const debug = require('debug')('tft_event.js');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    discordId: String,
    leagueUsername: String,
    challenges: [{id: String, complete: Boolean}],
    score: Number
});

var User = mongoose.model('User', userSchema);

module.exports = {
    register(message, args) {
        //register user for tft competition
        //args: leagueUsername
        //if user is already registered, do not let them register again
    },

    approve(message, args) {
        //approve a user's submission for a challenge
        //args: challengeId, leagueUsername
    },

    deny(message, args) {
        //deny a user's submission for a challenge
        //args: challengeId, leagueUsername, reason
    }
}

function getLeagueUsername(discordId, callback) {
    //callback is called with username, null if the user is not registered
    User.findOne({'discordId': discordId}, (err, user) => {
        if (err) {
            debug(err);
        }
        if (user) {
            callback(user.leagueUsername);
        } else {
            callback(null);
        }
    }
}

function isUserRegistered(discordId, callback) {
    //calls the callback function with true if user is registered, false if not registered
    User.findOne({'discordId': discordId}, (err, user) => {
        if (err) {
            debug(err);
            //some error handling here?
        }
        callback(user !== null);
    });
}
