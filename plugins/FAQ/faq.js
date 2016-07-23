exports.commands = [
        "faq",
        "faq_addentry",
        "faq_delentry",
    ],
    // code by martmists
    //implemented and additional code by onii-chan Capuccino.
    var sqlite3, faq;
sqlite3 = require('sqlite3').verbose();
faq = new sqlite3.Database('faq.db');
exports.faq_addentry = {
        usage: "<q> <a>",
        description: "add a FAQ entry.Roles with Administrator only!",
        process: function(bot, msg, suffix) {
            var entry = suffix.split(' ');
            var entry = msg.content.split('');
            var index = msg.content.split('');
            var index = args.shift();
            addEntry(index, entry) {
                index = faq.run("SELECT * FROM faq").length
                faq.run("INSERT INTO faq VALUES (" + index + "," + entry "," + ")")
                bot.SendMessage(msg.author + "entry added! Congrats, you're Loctav level 2");
                if (!msg.channel.permissionsOf(msg.author).hasPermission("Administrator")) {
                    bot.sendMessage(msg.channel, "You don't have permission to do that baka!");
                    return;
                } else {

                    console.log(`failed adding entry! ignoring\n${e.stack}`);
                    bot.SendMessage(msg.channel, msg.author + "failed adding entry! :sob:");

                }
            }
        },
        exports.faq_delentry = {
            usage: "<index>",
            description: "delete a FAQ entry.Roles with Administrator only!",
            process: function(bot, msg, suffix) {
                var index = args.shift();
                removeEntry(index) {
                    faq.run("DELETE FROM faq WHERE index=" + index)
                    bot.SendMessage(msg.author + ", FAQ entry deleted.Happy?")
                    if (!msg.channel.permissionsOf(msg.author).hasPermission("Administrator")) {
                        bot.sendMessage(msg.channel, "You don't have permission to do that baka!");
                        return;
                    } else {
                        console.log(`failed deleting entry! ignoring\n{$e.stack}`);
                        bot.SendMessage(msg.channel, "failed to delete entry! Try again!");
                    }
                }
            },

            exports.faq = {
                usage: "<entry>",
                description: "grabs a helpful tip!",
                // not sure how mart implemented this
                //but I have to make sure bot prints the file.
                process: function(bot, msg, suffix) {
                    getEntry(query) {
                        result = faq.run("SELECT index,entry FROM faq WHERE index LIKE '%" + query + "%'")
                        console.log("INDEX_NAME: " + result[0].index)
                        console.log("ENTRY: " + result[0].entry)
                        bot.sendMessage(msg.channel, result[0].entry);
                    } else {

                        console.log(`entry not found.\n{$e.stack}`);
                        bot.SendMessage(msg.channel, "entry not found!");
                    }
                }
            },
