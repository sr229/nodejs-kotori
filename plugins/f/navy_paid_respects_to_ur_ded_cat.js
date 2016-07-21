exports.command = [
    "f",
],
//the most useless command. Made by someone who forgot to sleep for 48 hours.
exports.f {
    usage: "",
    description: "pay respects.",
    process: function(bot, msg, suffix) {
        bot.SendMessage(msg.channel, `${msg.author} ,` + "has paid respects.");
    }
}
