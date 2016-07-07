
exports.commands = [
    "cat",
    "meow",
    "nyaa",
]
//'tis a bloddy cat generator you cuck.
var request = require("request");
exports.cat = {
    usage : "<desu>",
    description : "gets a picture of a cat. Seriously, get a real one.",
    process: 
    request("http://random.cat/meow/", function(error, response, body){

	    if(!error && response.statusCode == 200){

		var meow = JSON.parse(body);

		bot.sendMessage(msg.channel, meow);

        }
    }
