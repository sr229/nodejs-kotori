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
356                     bot.sendMessage(msg.channel, `The id of ${users[0]} is ${users[0].id}`) 
357                 } else if (users.length > 1) { 
358                     var response = "multiple users found:"; 
359                     for (var i = 0; i < users.length; i++) { 
360                         var user = users[i]; 
361                         response += `\nThe id of ${user} is ${user.id}`; 
362                     } 
363                     bot.sendMessage(msg.channel, response); 
364                 } else { 
365                     bot.sendMessage(msg.channel, `No user ${suffix} found!`); 
366                 } 
367             } else { 
368                 bot.sendMessage(msg.channel, `The id of ${msg.author} is ${msg.author.id}`); 
369             } 
370         } 
371     }, 
372     "eval": { 
373         usage: "<command>", 
374         description: 'Executes arbitrary javascript in the bot process. User must have "eval" permission', 
375         //cleared out the eval perm required code for now. 
376         process: function (bot, msg, suffix) { 
377             bot.sendMessage(msg.channel, eval(suffix, bot)); 
378 
 
379         } 
380     }, 
381     "topic": { 
382         usage: "[topic]", 
383         description: 'Sets the topic for the channel. No topic removes the topic.', 
384         process: function (bot, msg, suffix) { 
385             bot.setChannelTopic(msg.channel, suffix); 
386         } 
387     }, 
388     "roll": { 
389         usage: "[# of sides] or [# of dice]d[# of sides]( + [# of dice]d[# of sides] + ...)", 
390         description: "roll one die with x sides, or multiple dice using d20 syntax. Default value is 10", 
391         process: function (bot, msg, suffix) { 
392             if (suffix.split("d").length <= 1) { 
393                 bot.sendMessage(msg.channel, `${msg.author} rolled a ${d20.roll(suffix || "10")}`); 
394             } else if (suffix.split("d").length > 1) { 
395                 var eachDie = suffix.split("+"); 
396                 var passing = 0; 
397                 for (var i = 0; i < eachDie.length; i++) { 
398                     if (eachDie[i].split("d")[0] < 50) { 
399                         passing += 1; 
400                     }; 
401                 } 
402                 if (passing == eachDie.length) { 
403                     bot.sendMessage(msg.channel, `${msg.author} rolled a ${d20.roll(suffix)}`); 
404                 } else { 
405                     bot.sendMessage(msg.channel, `${msg.author} tried to roll too many dice at once!`); 
406                 } 
407             } 
408         } 
409     }, 
410     "msg": { 
411         usage: "<user> <message to leave user>", 
412         description: "leaves a message for a user the next time they come online", 
413         process: function (bot, msg, suffix) { 
414             var args = suffix.split(' '); 
415             var user = args.shift(); 
416             var message = args.join(' '); 
417             if (user.startsWith('<@')) { 
418                 user = user.substr(2, user.length - 3); 
419             } 
420             var target = msg.channel.server.members.get("id", user); 
421             if (!target) { 
422                 target = msg.channel.server.members.get("username", user); 
423             } 
424             messagebox[target.id] = { 
425                 channel: msg.channel.id, 
426                 content: `${target}, ${msg.author} said: ${message}` 
427             }; 
428             updateMessagebox(); 
429             bot.sendMessage(msg.channel, "message saved.") 
430         } 
431     }, 
432     "beam": { 
433         usage: "<stream>", 
434         description: "checks if the given Beam stream is online", 
435         process: function (bot, msg, suffix) { 
436             request(`https://beam.pro/api/v1/channels/${suffix}`, (err, res, body) => { 
437                 var data = JSON.parse(body); 
438                 if (data.user) { 
439                     bot.sendMessage(msg.channel, `${suffix} is online, playing\n${data.type.name}\n${data.online}\n${data.thumbnail.url}`) 
440                 } else { 
441                     bot.sendMessage(msg.channel, `${suffix} is offline`) 
442                 } 
443             }); 
444         } 
445     }, 
446     "twitch": { 
447         usage: "<stream>", 
448         description: "checks if the given stream is online", 
449         process: function (bot, msg, suffix) { 
450             request(`https://api.twitch.tv/kraken/streams/${suffix}`, (err, res, body) => { 
451                 var stream = JSON.parse(body); 
452                 if (stream.stream) { 
453                     bot.sendMessage(msg.channel, `${suffix} is online, playing ${stream.stream.game}\n${stream.stream.channel.status}\n${stream.stream.preview.large}`); 
454                 } else { 
455                     bot.sendMessage(msg.channel, `${suffix} is offline`) 
456                 } 
457             }); 
458         } 
459     }, 
460     "xkcd": { 
461         usage: "[comic number]", 
462         description: "displays a given xkcd comic number (or the latest if nothing specified", 
463         process: function (bot, msg, suffix) { 
464             var url = "http://xkcd.com/"; 
465             if (suffix != "") url += `${suffix}/`; 
466             url += "info.0.json"; 
467             request(url, (err, res, body) => { 
468                 try { 
469                     var comic = JSON.parse(body); 
470                     bot.sendMessage(msg.channel, `${comic.title}\n${comic.img}`, () => bot.sendMessage(msg.channel, comic.alt)); 
471                 } catch (e) { 
472                     bot.sendMessage(msg.channel, `Couldn't fetch an XKCD for ${suffix}`); 
473                 } 
474             }); 
475         } 
476     }, 
477     "watchtogether": { 
478         usage: "[video url (Youtube, Vimeo)", 
479         description: "Generate a watch2gether room with your video to watch with your little friends!", 
480         process: function (bot, msg, suffix) { 
481             var watch2getherUrl = "https://www.watch2gether.com/go#"; 
482             bot.sendMessage(msg.channel, "watch2gether link", () => bot.sendMessage(msg.channel, `${watch2getherUrl}${suffix}`)); 
483         } 
484     }, 
485     "uptime": { 
486         usage: "", 
487         description: "returns the amount of time since the bot started", 
488         process: function (bot, msg, suffix) { 
489             var now = Date.now(); 
490             var msec = now - startTime; 
491             console.log(`Uptime is ${msec} milliseconds`); 
492             var days = Math.floor(msec / 1000 / 60 / 60 / 24); 
493             msec -= days * 1000 * 60 * 60 * 24; 
494             var hours = Math.floor(msec / 1000 / 60 / 60); 
495             msec -= hours * 1000 * 60 * 60; 
496             var mins = Math.floor(msec / 1000 / 60); 
497             msec -= mins * 1000 * 60; 
498             var secs = Math.floor(msec / 1000); 
499             var timestr = ""; 
500             if (days > 0) { 
501                 timestr += days + " days "; 
502             } 
503             if (hours > 0) { 
504                 timestr += hours + " hours "; 
505             } 
506             if (mins > 0) { 
507                 timestr += mins + " minutes "; 
508             } 
509             if (secs > 0) { 
510                 timestr += secs + " seconds "; 
511             } 
512             bot.sendMessage(msg.channel, `Uptime: ${timestr}`); 
513         } 
514     } 
515 }; 
516 try { 
517     var rssFeeds = JSON.parse(fs.readFileSync("./rss.json")); 
518 
 
519     function loadFeeds() { 
520         for (var cmd in rssFeeds) { 
521             commands[cmd] = { 
522                 usage: "[count]", 
523                 description: rssFeeds[cmd].description, 
524                 url: rssFeeds[cmd].url, 
525                 process: function (bot, msg, suffix) { 
526                     var count = 1; 
527                     if (suffix != null && suffix != "" && !isNaN(suffix)) { 
528                         count = suffix; 
529                     } 
530                     rssfeed(bot, msg, this.url, count, false); 
531                 } 
532             }; 
533         } 
534     } 
535 } catch (e) { 
536     console.log(`Couldn't load rss.json. See rss.json.example if you want rss feed commands. error: ${e}`); 
537 } 
538 
 
539 try { 
540     aliases = JSON.parse(fs.readFileSync("./alias.json")); 
541 } catch (e) { 
542     //No aliases defined 
543     aliases = {}; 
544 } 
545 
 
546 try { 
547     messagebox = JSON.parse(fs.readFileSync("./messagebox.json")); 
548 } catch (e) { 
549     //no stored messages 
550     messagebox = {}; 
551 } 
552 
 
553 function updateMessagebox() { 
554     fs.writeFile("./messagebox.json", JSON.stringify(messagebox, null, 2), null); 
555 } 
556 
 
557 function rssfeed(bot, msg, url, count, full) { 
558     var FeedParser = require('feedparser'); 
559     var feedparser = new FeedParser(); 
560     request(url).pipe(feedparser); 
561     feedparser.on('error', error => bot.sendMessage(msg.channel, `failed reading feed: ${error}`)); 
562     var shown = 0; 
563     feedparser.on('readable', function () { 
564         var stream = this; 
565         shown += 1 
566         if (shown > count) { 
567             return; 
568         } 
569         var item = stream.read(); 
570         bot.sendMessage(msg.channel, item.title + " - " + item.link, function () { 
571             if (full === true) { 
572                 var text = htmlToText.fromString(item.description, { 
573                     wordwrap: false, 
574                     ignoreHref: true 
575                 }); 
576                 bot.sendMessage(msg.channel, text); 
577             } 
578         }); 
579         stream.alreadyRead = true; 
580     }); 
581 } 
582 
 
583 
 
584 ; 
585 
 
586 bot.on("ready", () => { 
587     loadFeeds(); 
588     console.log(`Ready to begin! Serving in ${bot.channels.length} channels`); 
589     plugins.init(); 
590 }); 
591 
 
592 bot.on("disconnected", () => { 
593     console.log("Disconnected!"); 
594     process.exit(1); //exit node.js with an error 
595 }); 
596 
 
597 bot.on("message", msg => { 
598     //check if message is a command 
599     if (msg.author.id !== bot.user.id) return; 
600 
 
601     if ((msg.content[0] === '>' || msg.content.indexOf(bot.user.mention()) == 0)) { 
602         console.log(`treating ${msg.content} from ${msg.author} as command`); 
603         var cmdTxt = msg.content.split(" ")[0].substring(">".length, msg.content.length); 
604         var suffix = msg.content.substring(cmdTxt.length + 2); //add one for the ! and one for the space 
605         if (msg.content.indexOf(bot.user.mention()) == 0) { 
606             try { 
607                 cmdTxt = msg.content.split(" ")[1]; 
608                 suffix = msg.content.substring(bot.user.mention().length + cmdTxt.length + 2); 
609             } catch (e) { //no command 
610                 bot.sendMessage(msg.channel, "Yes?"); 
611                 return; 
612             } 
613         } 
614         alias = aliases[cmdTxt]; 
615         if (alias) { 
616             console.log(`${cmdTxt} is an alias, constructed command is ${alias.join(" ")} ${suffix}`); 
617             cmdTxt = alias[0]; 
618             suffix = `${alias[1]} ${suffix}`; 
619         } 
621       	var cmd = commands[cmdTxt]; 
645         if(cmdTxt === "help"){ 
646             //help is special since it iterates over the other commands 
647                         var len = 0; 
648                         var counter = 0; 
649                         var info = ""; 
650                         for (var cmd in commands) { 
651                         	len++; 
652                         } 
653 			bot.sendMessage(msg.author,"Available Commands:", function(){ 
654 				for(var cmd in commands) { 
655 					counter++; 
656 					info += ">" + cmd; 
657 					var usage = commands[cmd].usage; 
658 					if(usage){ 
659 						info += " " + usage; 
660 					} 
661 					var description = commands[cmd].description; 
662 					if(description){ 
663 						info += "\n\t" + description + "\n\n"; 
664 					} 
665 					 
666 					if (counter == 75) { 
667 						len = len - counter; 
668 						counter = 0; 
669 						if ((info.length > 1900) && (info.length < 2000)) { 
670 					                bot.sendMessage(msg.author,info); 
671 						} else { 
672 							// Do smth 
673 						} 
674 					} else if ((len < 75) && (counter == len)) { 
675 						bot.sendMessage(msg.author.info); 
676 					} 
677 				} 
678 			}); 
679         } 
634         } else if (cmd) { 
635             try { 
636                 cmd.process(bot, msg, suffix); 
637             } catch (e) { 
638                 if (Config.debug) bot.sendMessage(msg.channel, `command ${cmdTxt} failed:\n${e.stack}`); 
639             } 
640         } else { 
641             if (Config.respondToInvalid) bot.sendMessage(msg.channel, `Invalid command ${cmdTxt}`); 
642         } 
643     } else { 
644         //message isn't a command or is from us 
645         if (msg.author != bot.user && msg.isMentioned(bot.user)) { 
646             bot.sendMessage(msg.channel, `${msg.author}, you called?`); 
647         } 
648     } 
649 }); 
650 
 
651 
 
652 
 
653 
 
654 function get_gif(tags, func) { 
655     //limit=1 will only return 1 gif 
656     var params = { 
657         api_key: giphy_config.api_key, 
658         rating: giphy_config.rating, 
659         format: "json", 
660         limit: 1 
661     }; 
662     var query = qs.stringify(params); 
663 
 
664     if (tags !== null) { 
665         query += `&tag=${tags.join('+')}` 
666     } 
667 
 
668     //wouldnt see request lib if defined at the top for some reason:\ 
669     //console.log(query) 
670     request(`${giphy_config.url}?${query}`, (error, response, body) => { 
671         //console.log(arguments) 
672         if (error || response.statusCode !== 200) { 
673             console.error(`giphy: Got error: ${body}\n${error}`); 
674         } else { 
675             try { 
676                 var responseObj = JSON.parse(body) 
677                 func(null, responseObj.data.id); 
678             } catch (err) { 
679                 func(err); 
680             } 
681         } 
682     }); 
683 } 
684 exports.addCommand = (commandName, commandObject) => { 
685     try { 
686         commands[commandName] = commandObject; 
687     } catch (err) { 
         console.log(err); 
     } 
 } 
 exports.commandCount = () => Object.keys(commands).length; 

 
 
 
 bot.loginWithToken("Bot Token. Get one at http://discordapp.com/developers"); 
