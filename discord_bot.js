var Discord, yt, youtube_plugin, wa, wolfram_plugin;
var request = require("request"),
    plugins = require("./plugins.js"),
    fs = require("fs"),
    qs = require("querystring"),
    d20 = require("d20"),
    request = require("request"),
    htmlToText = require('html-to-text'),
    startTime = Date.now(),
    giphy_config = {
        "api_key": "dc6zaTOxFJmzC",
        "rating": "r",
        "url": "http://api.giphy.com/v1/gifs/random",
        "permission": ["NORMAL"]
    },
    Permissions,
    Config,
    aliases,
    messagebox;

try {
<<<<<<< HEAD
    Discord = require("discord.js");
} catch (e) {
    console.log(e.stack);
    console.log(process.version);
    console.log("Please run npm install and ensure it passes with no errors!");
    process.exit(0);
}

try {
    yt = require("./youtube_plugin");
    youtube_plugin = new yt();
} catch (e) {
    console.log(`couldn't load youtube plugin!\n${e.stack}`);
}

try {
    wa = require("./wolfram_plugin");
    wolfram_plugin = new wa();
} catch (e) {
    console.log(`couldn't load wolfram plugin!\n${e.stack}`);
}

var bot = new Discord.Client();

=======
	var Discord = require("discord.io");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Error executing! Are you sure you have the following dependecies?");
	process.exit();
}

try {
	var yt = require("./youtube_plugin");
	var youtube_plugin = new yt();
} catch(e){
	console.log("couldn't load youtube plugin!\n");
}

try {
	var wa = require("./wolfram_plugin");
	var wolfram_plugin = new wa();
} catch(e){
	console.log("couldn't load wolfram plugin!\n");
}

//Bot token goes to 'token' (duh).
var bot = new Discord.Client({
    token: "get one at http://discordapp.com/developers",
    autorun: true
    [shard : [0, 2]
});

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});
>>>>>>> master

//logs that the bot is logging and is ready in a amount of miliseconds
console.log(`Logging in...\nReady to begin\nin ${bot.readyTime}`);


// Load custom permissions
//its required to have permissions.json if you want the bot to
//be able to run Eval.
try {
    Permissions = JSON.parse(fs.readFileSync("./permissions.json"));
} catch (e) {}
Permissions.checkPermission = (user, permission) => {
    try {
        var allowed = false;
        try {
            if (Permissions.global.hasOwnProperty(permission)) {
                allowed = Permissions.global[permission] == true;
            }
        } catch (e) {}
        try {
            if (Permissions.users[user.id].hasOwnProperty(permission)) {
                allowed = Permissions.users[user.id][permission] == true;
            }
        } catch (e) {}
        return allowed;
    } catch (e) {}
    return false;
}

//load config data
try {
    Config = JSON.parse(fs.readFileSync("./config.json"));
} catch (e) { //no config file, use defaults
    Config.debug = false;
    Config.respondToInvalid = false;
}


//https://api.imgflip.com/popular_meme_ids
//this doesn't work currently. Fix soon?
var meme = {
    "brace": 61546,
    "mostinteresting": 61532,
    "fry": 61520,
    "onedoesnot": 61579,
    "yuno": 61527,
    "success": 61544,
    "allthethings": 61533,
    "doge": 8072285,
    "drevil": 40945639,
    "skeptical": 101711,
    "notime": 442575,
    "yodawg": 101716
};

var commands = {
    "gif": {
        usage: "<image tags>",
        description: "returns a random gif matching the tags passed",
        process: function (bot, msg, suffix) {
            var tags = suffix.split(" ");
            get_gif(tags, id => {
                if (typeof id !== "undefined") {
                    bot.sendMessage(msg.channel, `http://media.giphy.com/media/${id}/giphy.gif [Tags: ${(tags ? tags : "Random GIF")}]`);
                } else {
                    bot.sendMessage(msg.channel, `Invalid tags, try something different. [Tags: ${(tags ? tags : "Random GIF")}]`);
                }
            });
        }
    },
    "ping": {
        description: "responds pong, useful for checking if bot is alive",
        process: function (bot, msg) {
            bot.sendMessage(msg.channel, `${msg.author} pong!`);
        }
    },
    "servers": {
        description: "lists servers bot is connected to",
        process: function (bot, msg) {
            bot.sendMessage(msg.channel, bot.servers);
        }
    },
    "channels": {
        description: "lists channels bot is connected to",
        process: function (bot, msg) {
            bot.sendMessage(msg.channel, bot.channels);
        }
    },
    "myid": {
        description: "returns the user id of the sender",
        process: function (bot, msg) {
            bot.sendMessage(msg.channel, msg.author.id);
        }
    },
    "idle": {
        description: "sets bot status to idle",
        process: function (bot, msg) {
            bot.setStatusIdle();
        }
    },
    "online": {
        description: "sets bot status to online",
        process: function (bot, msg) {
            bot.setStatusOnline();
        }
    },
    //youtube is broken, still finding a workaround.
    "youtube": {
        usage: "<video tags>",
        description: "gets youtube video matching tags",
        process: function (bot, msg, suffix) {
            youtube_plugin.respond(suffix, msg.channel, bot);
        }
    },
    "say": {
        usage: "<message>",
        description: "bot says message",
        process: function (bot, msg, suffix) {
            bot.sendMessage(msg.channel, suffix);
        }
    },

    "meme": {
        usage: 'meme "top text" "bottom text"',
        process: function (bot, msg, suffix) {
            var tags = msg.content.split('"');
            var memetype = tags[0].split(" ")[1];
            //bot.sendMessage(msg.channel,tags);
            var Imgflipper = require("imgflipper");
            var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);
            imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : "", tags[3] ? tags[3] : "", function (err, image) {
                //console.log(arguments);
                bot.sendMessage(msg.channel, image);
            });
        }
    },
    "memehelp": { //TODO: this should be handled by !help
        description: "returns available memes for !meme",
        process: function (bot, msg) {
            var str = "Currently available memes:\n"
            for (var m in meme) {
                str += m + "\n"
            }
            bot.sendMessage(msg.channel, str);
        }
    },
    "log": {
        usage: "<log message>",
        description: "logs message to bot console",
        process: function (bot, msg, suffix) {
            console.log(msg.content);
        }
    },
    "wiki": {
        usage: "<search terms>",
        description: "returns the summary of the first matching search result from Wikipedia",
        process: function (bot, msg, suffix) {
            var query = suffix;
            if (!query) {
                bot.sendMessage(msg.channel, "usage: !wiki search terms");
                return;
            }
            var Wiki = require('wikijs');
            new Wiki().search(query, 1).then(data => {
                new Wiki().page(data.results[0]).then(page => {
                    page.summary().then(summary => {
                        var sumText = summary.toString().split('\n');
                        var continuation = () => {
                            var paragraph = sumText.shift();
                            if (paragraph) {
                                bot.sendMessage(msg.channel, paragraph, continuation);
                            }
                        };
                        continuation();
                    });
                });
            }, err => bot.sendMessage(msg.channel, err));
        }
    },

    "create": {
        usage: "<channel name>",
        description: "creates a new text channel with the given name.",
        process: function (bot, msg, suffix) {
            bot.createChannel(msg.channel.server, suffix, "text").then(channel => {
                bot.sendMessage(msg.channel, `created ${channel}`);
            }).catch(error => bot.sendMessage(msg.channel, `failed to create channel: ${error}`));
        }
    },
    "voice": {
        usage: "<channel name>",
        description: "creates a new voice channel with the give name.",
        process: function (bot, msg, suffix) {
            bot.createChannel(msg.channel.server, suffix, "voice").then(channel => {
                bot.sendMessage(msg.channel, `created ${channel.id}`);
                console.log(`created ${channel}`);
            }).catch(error => bot.sendMessage(msg.channel, `failed to create channel: ${error}`));
        }
    },
    "delete": {
        usage: "<channel name>",
        description: "deletes the specified channel",
        process: function (bot, msg, suffix) {
            var channel = bot.channels.get("id", suffix);
            if (suffix.startsWith('<#')) {
                channel = bot.channels.get("id", suffix.substr(2, suffix.length - 3));
            }
            if (!channel) {
                var channels = bot.channels.getAll("name", suffix);
                if (channels.length > 1) {
                    var response = "Multiple channels match, please use id:";
                    for (var i = 0; i < channels.length; i++) {
                        response += channels[i] + ": " + channels[i].id;
                    }
                    bot.sendMessage(msg.channel, response);
                    return;
                } else if (channels.length == 1) {
                    channel = channels[0];
                } else {
                    bot.sendMessage(msg.channel, `Couldn't find channel ${suffix} to delete!`);
                    return;
                }
            }
            bot.sendMessage(msg.channel.server.defaultChannel, `deleting channel ${suffix} at ${msg.author}'s request`);
            if (msg.channel.server.defaultChannel != msg.channel) {
                bot.sendMessage(msg.channel, `deleting ${channel}`);
            }
            bot.deleteChannel(channel).then(channel => {
                console.log(`deleted ${suffix} at ${msg.author}'s request`);
            }).catch(error => bot.sendMessage(msg.channel, `couldn't delete channel: ${error}`));
        }
    },
    "stock": {
        usage: "<stock to fetch>",
        process: function (bot, msg, suffix) {
            var yahooFinance = require('yahoo-finance');
            yahooFinance.snapshot({
                symbol: suffix,
                fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
            }, function (error, snapshot) {
                if (error) {
                    bot.sendMessage(msg.channel, `couldn't get stock: ${error}`);
                } else {
                    //bot.sendMessage(msg.channel,JSON.stringify(snapshot));
                    bot.sendMessage(msg.channel, `${snapshot.name}\nprice: $${snapshot.lastTradePriceOnly}`);
                }
            });
        }
    },
    "wolfram": {
        usage: "<search terms>",
        description: "gives results from wolframalpha using search terms",
        process: function (bot, msg, suffix) {
            if (!suffix) {
                bot.sendMessage(msg.channel, "Usage: !wolfram <search terms> (Ex. !wolfram integrate 4x)");
            }
            wolfram_plugin.respond(suffix, msg.channel, bot);
        }
    },
    "rss": {
        description: "lists available rss feeds",
        process: function (bot, msg, suffix) {
            /*var args = suffix.split(" ");
            var count = args.shift();
            var url = args.join(" ");
            rssfeed(bot,msg,url,count,full);*/
            bot.sendMessage(msg.channel, "Available feeds:", () => {
                for (var c in rssFeeds) {
                    bot.sendMessage(msg.channel, `${c}: ${rssFeeds[c].url}`);
                }
            });
        }
    },
    "reddit": {
        usage: "[subreddit]",
        description: "Returns the top post on reddit. Can optionally pass a subreddit to get the top psot there instead",
        process: function (bot, msg, suffix) {
            var path = "/.rss"
            if (suffix) {
                path = `/r/${suffix}${path}`;
            }
            rssfeed(bot, msg, `https://www.reddit.com${path}`, 1, false);
        }
    },
    "alias": {
        usage: "<name> <actual command>",
        description: "Creates command aliases. Useful for making simple commands on the fly",
        process: function (bot, msg, suffix) {
            var args = suffix.split(" ");
            var name = args.shift();
            if (!name) {
                bot.sendMessage(msg.channel, `>alias ${this.usage}\n${this.description}`);
            } else if (commands[name] || name === "help") {
                bot.sendMessage(msg.channel, "overwriting commands with aliases is not allowed!");
            } else {
                var command = args.shift();
                aliases[name] = [command, args.join(" ")];
                //now save the new alias
                fs.writeFile("./alias.json", JSON.stringify(aliases, null, 2), null);
                bot.sendMessage(msg.channel, `created alias ${name}`);
            }
        }
    },
    "userid": {
        usage: "[user to get id of]",
        description: "Returns the unique id of a user. This is useful for permissions.",
        process: function (bot, msg, suffix) {
            if (suffix) {
                var users = msg.channel.server.members.getAll("username", suffix);
                if (users.length == 1) {
                    bot.sendMessage(msg.channel, `The id of ${users[0]} is ${users[0].id}`)
                } else if (users.length > 1) {
                    var response = "multiple users found:";
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        response += `\nThe id of ${user} is ${user.id}`;
                    }
                    bot.sendMessage(msg.channel, response);
                } else {
                    bot.sendMessage(msg.channel, `No user ${suffix} found!`);
                }
            } else {
                bot.sendMessage(msg.channel, `The id of ${msg.author} is ${msg.author.id}`);
            }
        }
    },
    "eval": {
        usage: "<command>",
        description: 'Executes arbitrary javascript in the bot process. User must have "eval" permission',
        //cleared out the eval perm required code for now.
        process: function (bot, msg, suffix) {
            bot.sendMessage(msg.channel, eval(suffix, bot));

        }
    },
<<<<<<< HEAD
    "topic": {
        usage: "[topic]",
        description: 'Sets the topic for the channel. No topic removes the topic.',
        process: function (bot, msg, suffix) {
            bot.setChannelTopic(msg.channel, suffix);
        }
    },
    "roll": {
=======
	"alias": {
		usage: "<name> <actual command>",
		description: "Creates command aliases. Useful for making simple commands on the fly",
		process: function(bot,msg,suffix) {
			var args = suffix.split(" ");
			var name = args.shift();
			if(!name){
				bot.sendMessage(msg.channel,">alias " + this.usage + "\n" + this.description);
			} else if(commands[name] || name === "help"){
				bot.sendMessage(msg.channel,"overwriting commands with aliases is not allowed!");
			} else {
				var command = args.shift();
				aliases[name] = [command, args.join(" ")];
				//now save the new alias
				require("fs").writeFile("./alias.json",JSON.stringify(aliases,null,2), null);
				bot.sendMessage(msg.channel,"created alias " + name);
			}
		}
	},
	"userid": {
		usage: "[user to get id of]",
		description: "Returns the unique id of a user. This is useful for permissions.",
		process: function(bot,msg,suffix) {
			if(suffix){
				var users = msg.channel.server.members.getAll("username",suffix);
				if(users.length == 1){
					bot.sendMessage(msg.channel, "The id of " + users[0] + " is " + users[0].id)
				} else if(users.length > 1){
					var response = "multiple users found:";
					for(var i=0;i<users.length;i++){
						var user = users[i];
						response += "\nThe id of " + user + " is " + user.id;
					}
					bot.sendMessage(msg.channel,response);
				} else {
					bot.sendMessage(msg.channel,"No user " + suffix + " found!");
				}
			} else {
				bot.sendMessage(msg.channel, "The id of " + msg.author + " is " + msg.author.id);
			}
		}
	},
	"eval": {
		usage: "<command>",
		description: 'Executes arbitrary javascript in the bot process. User must have "eval" permission',
		//cleared out the eval perm required code for now.
		process: function(bot,msg,suffix) {
		bot.sendMessage(msg.channel, eval(suffix,bot));  
			
		}
	},
	"topic": {
		usage: "[topic]",
		description: 'Sets the topic for the channel. No topic removes the topic.',
		process: function(bot,msg,suffix) {
			bot.setChannelTopic(msg.channel,suffix);
		}
	},
	"roll": {
>>>>>>> master
        usage: "[# of sides] or [# of dice]d[# of sides]( + [# of dice]d[# of sides] + ...)",
        description: "roll one die with x sides, or multiple dice using d20 syntax. Default value is 10",
        process: function (bot, msg, suffix) {
            if (suffix.split("d").length <= 1) {
                bot.sendMessage(msg.channel, `${msg.author} rolled a ${d20.roll(suffix || "10")}`);
            } else if (suffix.split("d").length > 1) {
                var eachDie = suffix.split("+");
                var passing = 0;
                for (var i = 0; i < eachDie.length; i++) {
                    if (eachDie[i].split("d")[0] < 50) {
                        passing += 1;
                    };
                }
                if (passing == eachDie.length) {
                    bot.sendMessage(msg.channel, `${msg.author} rolled a ${d20.roll(suffix)}`);
                } else {
                    bot.sendMessage(msg.channel, `${msg.author} tried to roll too many dice at once!`);
                }
            }
        }
    },
    "msg": {
        usage: "<user> <message to leave user>",
        description: "leaves a message for a user the next time they come online",
        process: function (bot, msg, suffix) {
            var args = suffix.split(' ');
            var user = args.shift();
            var message = args.join(' ');
            if (user.startsWith('<@')) {
                user = user.substr(2, user.length - 3);
            }
            var target = msg.channel.server.members.get("id", user);
            if (!target) {
                target = msg.channel.server.members.get("username", user);
            }
            messagebox[target.id] = {
                channel: msg.channel.id,
                content: `${target}, ${msg.author} said: ${message}`
            };
            updateMessagebox();
            bot.sendMessage(msg.channel, "message saved.")
        }
    },
    "beam": {
        usage: "<stream>",
        description: "checks if the given Beam stream is online",
        process: function (bot, msg, suffix) {
            request(`https://beam.pro/api/v1/channels/${suffix}`, (err, res, body) => {
                var data = JSON.parse(body);
                if (data.user) {
                    bot.sendMessage(msg.channel, `${suffix} is online, playing\n${data.type.name}\n${data.online}\n${data.thumbnail.url}`)
                } else {
                    bot.sendMessage(msg.channel, `${suffix} is offline`)
                }
            });
        }
    },
    "twitch": {
        usage: "<stream>",
        description: "checks if the given stream is online",
        process: function (bot, msg, suffix) {
            request(`https://api.twitch.tv/kraken/streams/${suffix}`, (err, res, body) => {
                var stream = JSON.parse(body);
                if (stream.stream) {
                    bot.sendMessage(msg.channel, `${suffix} is online, playing ${stream.stream.game}\n${stream.stream.channel.status}\n${stream.stream.preview.large}`);
                } else {
                    bot.sendMessage(msg.channel, `${suffix} is offline`)
                }
            });
        }
    },
    "xkcd": {
        usage: "[comic number]",
        description: "displays a given xkcd comic number (or the latest if nothing specified",
        process: function (bot, msg, suffix) {
            var url = "http://xkcd.com/";
            if (suffix != "") url += `${suffix}/`;
            url += "info.0.json";
            request(url, (err, res, body) => {
                try {
                    var comic = JSON.parse(body);
                    bot.sendMessage(msg.channel, `${comic.title}\n${comic.img}`, () => bot.sendMessage(msg.channel, comic.alt));
                } catch (e) {
                    bot.sendMessage(msg.channel, `Couldn't fetch an XKCD for ${suffix}`);
                }
            });
        }
    },
    "watchtogether": {
        usage: "[video url (Youtube, Vimeo)",
        description: "Generate a watch2gether room with your video to watch with your little friends!",
        process: function (bot, msg, suffix) {
            var watch2getherUrl = "https://www.watch2gether.com/go#";
            bot.sendMessage(msg.channel, "watch2gether link", () => bot.sendMessage(msg.channel, `${watch2getherUrl}${suffix}`));
        }
    },
    "uptime": {
        usage: "",
        description: "returns the amount of time since the bot started",
        process: function (bot, msg, suffix) {
            var now = Date.now();
            var msec = now - startTime;
            console.log(`Uptime is ${msec} milliseconds`);
            var days = Math.floor(msec / 1000 / 60 / 60 / 24);
            msec -= days * 1000 * 60 * 60 * 24;
            var hours = Math.floor(msec / 1000 / 60 / 60);
            msec -= hours * 1000 * 60 * 60;
            var mins = Math.floor(msec / 1000 / 60);
            msec -= mins * 1000 * 60;
            var secs = Math.floor(msec / 1000);
            var timestr = "";
            if (days > 0) {
                timestr += days + " days ";
            }
            if (hours > 0) {
                timestr += hours + " hours ";
            }
            if (mins > 0) {
                timestr += mins + " minutes ";
            }
            if (secs > 0) {
                timestr += secs + " seconds ";
            }
            bot.sendMessage(msg.channel, `Uptime: ${timestr}`);
        }
    }
};
try {
    var rssFeeds = JSON.parse(fs.readFileSync("./rss.json"));

    function loadFeeds() {
        for (var cmd in rssFeeds) {
            commands[cmd] = {
                usage: "[count]",
                description: rssFeeds[cmd].description,
                url: rssFeeds[cmd].url,
                process: function (bot, msg, suffix) {
                    var count = 1;
                    if (suffix != null && suffix != "" && !isNaN(suffix)) {
                        count = suffix;
                    }
                    rssfeed(bot, msg, this.url, count, false);
                }
            };
        }
    }
} catch (e) {
    console.log(`Couldn't load rss.json. See rss.json.example if you want rss feed commands. error: ${e}`);
}

try {
    aliases = JSON.parse(fs.readFileSync("./alias.json"));
} catch (e) {
    //No aliases defined
    aliases = {};
}

try {
    messagebox = JSON.parse(fs.readFileSync("./messagebox.json"));
} catch (e) {
    //no stored messages
    messagebox = {};
}

function updateMessagebox() {
    fs.writeFile("./messagebox.json", JSON.stringify(messagebox, null, 2), null);
}

function rssfeed(bot, msg, url, count, full) {
    var FeedParser = require('feedparser');
    var feedparser = new FeedParser();
    request(url).pipe(feedparser);
    feedparser.on('error', error => bot.sendMessage(msg.channel, `failed reading feed: ${error}`));
    var shown = 0;
    feedparser.on('readable', function () {
        var stream = this;
        shown += 1
        if (shown > count) {
            return;
        }
        var item = stream.read();
        bot.sendMessage(msg.channel, item.title + " - " + item.link, function () {
            if (full === true) {
                var text = htmlToText.fromString(item.description, {
                    wordwrap: false,
                    ignoreHref: true
                });
                bot.sendMessage(msg.channel, text);
            }
        });
        stream.alreadyRead = true;
    });
}


;

bot.on("ready", () => {
    loadFeeds();
    console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
    plugins.init();
});

bot.on("disconnected", () => {
    console.log("Disconnected!");
    process.exit(1); //exit node.js with an error
});

bot.on("message", msg => {
    //check if message is a command
    if (msg.author.id !== bot.user.id) return;

    if ((msg.content[0] === '>' || msg.content.indexOf(bot.user.mention()) == 0)) {
        console.log(`treating ${msg.content} from ${msg.author} as command`);
        var cmdTxt = msg.content.split(" ")[0].substring(">".length, msg.content.length);
        var suffix = msg.content.substring(cmdTxt.length + 2); //add one for the ! and one for the space
        if (msg.content.indexOf(bot.user.mention()) == 0) {
            try {
                cmdTxt = msg.content.split(" ")[1];
                suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + 2);
            } catch (e) { //no command
                bot.sendMessage(msg.channel, "Yes?");
                return;
            }
        }
        alias = aliases[cmdTxt];
        if (alias) {
            console.log(`${cmdTxt} is an alias, constructed command is ${alias.join(" ")} ${suffix}`);
            cmdTxt = alias[0];
            suffix = `${alias[1]} ${suffix}`;
        }
        var cmd = commands[cmdTxt];
        if (cmdTxt === "help") {
            //help is special since it iterates over the other commands
<<<<<<< HEAD
            bot.sendMessage(msg.author, "Available Commands:", () => {
                var info = `>${cmd}`;
                for (var cmd in commands) {
                    var usage = commands[cmd].usage;
                    if (usage) {
                        info += ` ${usage}`;
                    }
                    info += "\n";
                }
                bot.sendMessage(msg.author, info);
            });
        } else if (cmd) {
            try {
                cmd.process(bot, msg, suffix);
            } catch (e) {
                if (Config.debug) bot.sendMessage(msg.channel, `command ${cmdTxt} failed:\n${e.stack}`);
            }
        } else {
            if (Config.respondToInvalid) bot.sendMessage(msg.channel, `Invalid command ${cmdTxt}`);
=======
                        var len = 0;
                        var counter = 0;
                        var info = "";
                        for (var cmd in commands) {
                        	len++;
                        }
			bot.sendMessage(msg.author,"Available Commands:", function(){
				for(var cmd in commands) {
					counter++;
					info += ">" + cmd;
					var usage = commands[cmd].usage;
					if(usage){
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description){
						info += "\n\t" + description + "\n\n";
					}
					
					if (counter == 75) {
						len = len - counter;
						counter = 0;
						if ((info.length > 1900) && (info.length < 2000)) {
					                bot.sendMessage(msg.author,info);
						} else {
							// Do smth
						}
					} else if ((len < 75) && (counter == len)) {
						bot.sendMessage(msg.author.info);
					}
				}
			});
        }
		else if(cmd) {
			try{
				cmd.process(bot,msg,suffix);
			} catch(e){
				if(Config.debug){
					bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
				}
			}
		} else {
			if(Config.respondToInvalid){
				bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
			}
		}
	} else {
		//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
>>>>>>> master
        }
    } else {
        //message isn't a command or is from us
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
            bot.sendMessage(msg.channel, `${msg.author}, you called?`);
        }
    }
});




function get_gif(tags, func) {
    //limit=1 will only return 1 gif
    var params = {
        api_key: giphy_config.api_key,
        rating: giphy_config.rating,
        format: "json",
        limit: 1
    };
    var query = qs.stringify(params);

    if (tags !== null) {
        query += `&tag=${tags.join('+')}`
    }

    //wouldnt see request lib if defined at the top for some reason:\
    //console.log(query)
    request(`${giphy_config.url}?${query}`, (error, response, body) => {
        //console.log(arguments)
        if (error || response.statusCode !== 200) {
            console.error(`giphy: Got error: ${body}\n${error}`);
        } else {
            try {
                var responseObj = JSON.parse(body)
                func(null, responseObj.data.id);
            } catch (err) {
                func(err);
            }
        }
    });
}
exports.addCommand = (commandName, commandObject) => {
    try {
        commands[commandName] = commandObject;
    } catch (err) {
        console.log(err);
    }
}
exports.commandCount = () => Object.keys(commands).length;


bot.loginWithToken("Bot Token. Get one at http://discordapp.com/developers");