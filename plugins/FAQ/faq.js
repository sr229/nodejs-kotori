exports.commands = [
    "faq",
    "faq.addentry",
    "faq.delentry",
]
// code by martmists
//implemented and additional code by onii-chan Capuccino.

var sqlite3 = require('sqlite3').verbose();
var faq = new sqlite3.Database('faq.db');
exports.faq.addentry = {
    usage: "<q> <a>",
    description: "add a FAQ entry",
    process: function addEntry(q, a) {
        index = faq.run("SELECT * FROM faq").length
        faq.run("INSERT INTO faq VALUES (" + index + "," + q + "," + a + ")")
        bot.SendMessage(msg.author + "entry added! Congrats, you're Loctav level 2!");
    }
}
exports.faq.delentry = {
    usage: "<index>",
    description: "delete a FAQ entry",
    process: function removeEntry(index) {
        faq.run("DELETE FROM faq WHERE index=" + index)
        bot.SendMessage(msg.author + ", FAQ entry deleted.Happy?");
    }
}

exports.faq = {
    usage: "<index>",
    description: "when in doubt.",
    // not sure how mart implemented this
    //but I have to make sure bot prints the file.
    process: function getEntry(query) {
      result = faq.run("SELECT q,a FROM faq WHERE q LIKE '%" + query + "%'")
        console.log("Q: " + result[0].q)
        console.log("A: " + result[0].a)
    bot.sendMessage(msg.channel , result[0].a );
    }
}