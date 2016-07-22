exports.commands = [
    "talk"
]

var cleverbot = require("cleverbot-node");
talkbot = new cleverbot;
cleverbot.prepare(function() {});

exports.talk = {
        usage: "<message>",
        description: "Talk directly to the bot",
        process: function(bot, msg, suffix) {
            var conv = suffix.split(" ");
            talkbot.write(conv, function(response) {
                    bot.sendMessage(msg.channel, `$ {msg.author},`, response.message);
                    if (msg.author != bot.user && msg.isMentioned(bot.user, suffix)) {
                        var conv = suffix.split(" ");
                        talkbot.write(conv, function(respose) {
                                bot.sendMessage(msg.channel, `$ {msg.author},`, response.message);
                            }
                        }
                    })
            }
        }
