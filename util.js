
var fs = require('fs');
module.exports = {
    readJSON(filename) {
	    var raw = fs.readFileSync(filename);
	    return JSON.parse(raw);
    },

    //sends a message to the channel listing correct args
    wrongArgs(message, args) {
        message.channel.send(`Incorrect arguments. Expected \`{args.join()}\``);
    },

    //return promise with user object from @username
    getUserFromTag(tag) {
        var id = tag.substring(2, tag.length -1);
        return client.fetchUser(id);
    }
}
