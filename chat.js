module.exports = {
    ping(message) {
        if (Math.random() < 0.99) {
            message.channel.send('pong');
        } else {
            message.channel.send('ping');
        }
    }
}
