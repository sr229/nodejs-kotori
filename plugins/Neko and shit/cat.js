exports.commands = [
        "cat",
        "meow",
        "nyaa",
    ]
    //'tis a bloddy cat generator you cuck.
exports.cat = {
        usage: "",
        description: "gets a picture of a cat. Seriously, get a real one.",
        process: function(bot, msg)
        require("request")("http://random.cat/meow/", function(error, response, body) {

                if (!error && response.statusCode == 200) {

                    var meow = JSON.parse(body);

                    bot.sendMessage(msg.channel, parsed.file);
                } catch (e) {
                    bot.sendMessage(msg.channel, "oh no! :sob:");
                }

            }
        },
        exports.meow {
            usage: "",
            description: "gets a picture of a cat.Seriously, get a real one.",
            process: function(bot, msg)
            require("request")("http://random.cat/meow", function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var meow = JSON.parse(body);
                        bot.sendMessage(msg.channel, parsed.file + "n-nya?...nyaaaa~!");
                    } catch (e) {
                        bot.sendMessage(msg.channel, "oh no! :sob:");
                    }
                }
            },
            exports.nyaa {
                usage: "",
                description: "gets a picture of a cat.Seriously, get a real one.",
                process: function(bot, msg) {
                        require("request")("http://random.cat/meow", function(error, response, body) {
                                if (!error && response.statuscode == 200) {
                                    var meow = JSON.parse(body);
                                    bot.sendMessage(msg.channel, parsed.file + "n-nani!...");
                                }

                            } catch (e) {
                                bot.sendMessage(msg.channel, "oh no! :sob:");
                            }
                        }
