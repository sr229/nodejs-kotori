exports.commands = [
    "faq.json",
    "faq.experm.addentr",
    "faq.experm.delentr",

];
//experimental FAQ made using JSON database.
try {
    faq = require("./faq.json");
} catch (e) {
    //no such file
    faq = {};
}
exports.faq.experm.addentr {
        usage: "<keyword>",
        "<entry>",
        description: "adds a FAQ entry (experimental, can crash the bot anytime.).",
        process: function(bot, msg, suffix)
        var entry = suffix.split(' ');
        var entry = msg.content.split('');
        var index = msg.content.split('');
        var index = args.shift();
        updateFAQ() {
            require("fs").writefile("./message.json", JSON.stringify(index, description, ) null);
            else {
                    bot.sendMessage(msg.channel, "failed adding entry.");
            }
        }
    },
    exports.faq.json {
        process: function(bot, msg, suffix)
        faq = JSON.parse(fs.readFileSync("./faq.json"));
        bot.sendMessage(msg.channel, entry);
        else {
                bot.sendMessage(msg.channel, "no entry found!");
            }
        },
