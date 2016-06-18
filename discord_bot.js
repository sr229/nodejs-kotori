var Discord, yt, youtube_plugin, wa, wolfram_plugin; 
2 var request = require("request"), 
3     plugins = require("./plugins.js"), 
4     fs = require("fs"), 
5     qs = require("querystring"), 
6     d20 = require("d20"), 
7     request = require("request"), 
8     htmlToText = require('html-to-text'), 
9     startTime = Date.now(), 
10     giphy_config = { 
11         "api_key": "dc6zaTOxFJmzC", 
12         "rating": "r", 
13         "url": "http://api.giphy.com/v1/gifs/random", 
14         "permission": ["NORMAL"] 
15     }, 
16     Permissions, 
17     Config, 
18     aliases, 
19     messagebox; 
20 
 
21 try { 
22     Discord = require("discord.io"); 
23 } catch (e) { 
24     console.log(e.stack); 
25     console.log(process.version); 
26     console.log("Please run npm install and ensure it passes with no errors!"); 
27     process.exit(0); 
28 } 
29 
 
30 try { 
31     yt = require("./youtube_plugin"); 
32     youtube_plugin = new yt(); 
33 } catch (e) { 
34     console.log(`couldn't load youtube plugin!\n${e.stack}`); 
35 } 
36 
 
37 try { 
38     wa = require("./wolfram_plugin"); 
39     wolfram_plugin = new wa(); 
40 } catch (e) { 
41     console.log(`couldn't load wolfram plugin!\n${e.stack}`); 
42 } 
43 
 
44 var bot = new Discord.Client(); 
45 
 
46 
 
47 //logs that the bot is logging and is ready in a amount of miliseconds 
48 console.log(`Logging in...\nReady to begin\nin ${bot.readyTime}`); 
49 
 
50 
 
51 // Load custom permissions 
52 //its required to have permissions.json if you want the bot to 
53 //be able to run Eval. 
54 try { 
55     Permissions = JSON.parse(fs.readFileSync("./permissions.json")); 
56 } catch (e) {} 
57 Permissions.checkPermission = (user, permission) => { 
58     try { 
59         var allowed = false; 
60         try { 
61             if (Permissions.global.hasOwnProperty(permission)) { 
62                 allowed = Permissions.global[permission] == true; 
63             } 
64         } catch (e) {} 
65         try { 
66             if (Permissions.users[user.id].hasOwnProperty(permission)) { 
67                 allowed = Permissions.users[user.id][permission] == true; 
68             } 
69         } catch (e) {} 
70         return allowed; 
71     } catch (e) {} 
72     return false; 
73 } 
74 
 
75 //load config data 
76 try { 
77     Config = JSON.parse(fs.readFileSync("./config.json")); 
78 } catch (e) { //no config file, use defaults 
79     Config.debug = false; 
80     Config.respondToInvalid = false; 
81 } 
82 
 
83 
 
84 //https://api.imgflip.com/popular_meme_ids 
85 //this doesn't work currently. Fix soon? 
86 var meme = { 
87     "brace": 61546, 
88     "mostinteresting": 61532, 
89     "fry": 61520, 
90     "onedoesnot": 61579, 
91     "yuno": 61527, 
92     "success": 61544, 
93     "allthethings": 61533, 
94     "doge": 8072285, 
95     "drevil": 40945639, 
96     "skeptical": 101711, 
97     "notime": 442575, 
98     "yodawg": 101716 
99 }; 
100 
 
101 var commands = { 
102     "gif": { 
103         usage: "<image tags>", 
104         description: "returns a random gif matching the tags passed", 
105         process: function (bot, msg, suffix) { 
106             var tags = suffix.split(" "); 
107             get_gif(tags, id => { 
108                 if (typeof id !== "undefined") { 
109                     bot.sendMessage(msg.channel, `http://media.giphy.com/media/${id}/giphy.gif [Tags: ${(tags ? tags : "Random GIF")}]`); 
110                 } else { 
111                     bot.sendMessage(msg.channel, `Invalid tags, try something different. [Tags: ${(tags ? tags : "Random GIF")}]`); 
112                 } 
113             }); 
114         } 
115     }, 
116     "ping": { 
117         description: "responds pong, useful for checking if bot is alive", 
118         process: function (bot, msg) { 
119             bot.sendMessage(msg.channel, `${msg.author} pong!`); 
120         } 
121     }, 
122     "servers": { 
123         description: "lists servers bot is connected to", 
124         process: function (bot, msg) { 
125             bot.sendMessage(msg.channel, bot.servers); 
126         } 
127     }, 
128     "channels": { 
129         description: "lists channels bot is connected to", 
130         process: function (bot, msg) { 
131             bot.sendMessage(msg.channel, bot.channels); 
132         } 
133     }, 
134     "myid": { 
135         description: "returns the user id of the sender", 
136         process: function (bot, msg) { 
137             bot.sendMessage(msg.channel, msg.author.id); 
138         } 
139     }, 
140     "idle": { 
141         description: "sets bot status to idle", 
142         process: function (bot, msg) { 
143             bot.setStatusIdle(); 
144         } 
145     }, 
146     "online": { 
147         description: "sets bot status to online", 
148         process: function (bot, msg) { 
149             bot.setStatusOnline(); 
150         } 
151     }, 
152     //youtube is broken, still finding a workaround. 
153     "youtube": { 
154         usage: "<video tags>", 
155         description: "gets youtube video matching tags", 
156         process: function (bot, msg, suffix) { 
157             youtube_plugin.respond(suffix, msg.channel, bot); 
158         } 
159     }, 
160     "say": { 
161         usage: "<message>", 
162         description: "bot says message", 
163         process: function (bot, msg, suffix) { 
164             bot.sendMessage(msg.channel, suffix); 
165         } 
166     }, 
167 
 
168     "meme": { 
169         usage: 'meme "top text" "bottom text"', 
170         process: function (bot, msg, suffix) { 
171             var tags = msg.content.split('"'); 
172             var memetype = tags[0].split(" ")[1]; 
173             //bot.sendMessage(msg.channel,tags); 
174             var Imgflipper = require("imgflipper"); 
175             var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password); 
176             imgflipper.generateMeme(meme[memetype], tags[1] ? tags[1] : "", tags[3] ? tags[3] : "", function (err, image) { 
177                 //console.log(arguments); 
178                 bot.sendMessage(msg.channel, image); 
179             }); 
180         } 
181     }, 
182     "memehelp": { //TODO: this should be handled by !help 
183         description: "returns available memes for !meme", 
184         process: function (bot, msg) { 
185             var str = "Currently available memes:\n" 
186             for (var m in meme) { 
187                 str += m + "\n" 
188             } 
189             bot.sendMessage(msg.channel, str); 
190         } 
191     }, 
192     "log": { 
193         usage: "<log message>", 
194         description: "logs message to bot console", 
195         process: function (bot, msg, suffix) { 
196             console.log(msg.content); 
197         } 
198     }, 
199     "wiki": { 
200         usage: "<search terms>", 
201         description: "returns the summary of the first matching search result from Wikipedia", 
202         process: function (bot, msg, suffix) { 
203             var query = suffix; 
204             if (!query) { 
205                 bot.sendMessage(msg.channel, "usage: !wiki search terms"); 
206                 return; 
207             } 
208             var Wiki = require('wikijs'); 
209             new Wiki().search(query, 1).then(data => { 
210                 new Wiki().page(data.results[0]).then(page => { 
211                     page.summary().then(summary => { 
212                         var sumText = summary.toString().split('\n'); 
213                         var continuation = () => { 
214                             var paragraph = sumText.shift(); 
215                             if (paragraph) { 
216                                 bot.sendMessage(msg.channel, paragraph, continuation); 
217                             } 
218                         }; 
219                         continuation(); 
220                     }); 
221                 }); 
222             }, err => bot.sendMessage(msg.channel, err)); 
223         } 
224     }, 
225 
 
226     "create": { 
227         usage: "<channel name>", 
228         description: "creates a new text channel with the given name.", 
229         process: function (bot, msg, suffix) { 
230             bot.createChannel(msg.channel.server, suffix, "text").then(channel => { 
231                 bot.sendMessage(msg.channel, `created ${channel}`); 
232             }).catch(error => bot.sendMessage(msg.channel, `failed to create channel: ${error}`)); 
233         } 
234     }, 
235     "voice": { 
236         usage: "<channel name>", 
237         description: "creates a new voice channel with the give name.", 
238         process: function (bot, msg, suffix) { 
239             bot.createChannel(msg.channel.server, suffix, "voice").then(channel => { 
240                 bot.sendMessage(msg.channel, `created ${channel.id}`); 
241                 console.log(`created ${channel}`); 
242             }).catch(error => bot.sendMessage(msg.channel, `failed to create channel: ${error}`)); 
243         } 
244     }, 
245     "delete": { 
246         usage: "<channel name>", 
247         description: "deletes the specified channel", 
248         process: function (bot, msg, suffix) { 
249             var channel = bot.channels.get("id", suffix); 
250             if (suffix.startsWith('<#')) { 
251                 channel = bot.channels.get("id", suffix.substr(2, suffix.length - 3)); 
252             } 
253             if (!channel) { 
254                 var channels = bot.channels.getAll("name", suffix); 
255                 if (channels.length > 1) { 
256                     var response = "Multiple channels match, please use id:"; 
257                     for (var i = 0; i < channels.length; i++) { 
258                         response += channels[i] + ": " + channels[i].id; 
259                     } 
260                     bot.sendMessage(msg.channel, response); 
261                     return; 
262                 } else if (channels.length == 1) { 
263                     channel = channels[0]; 
264                 } else { 
265                     bot.sendMessage(msg.channel, `Couldn't find channel ${suffix} to delete!`); 
266                     return; 
267                 } 
268             } 
269             bot.sendMessage(msg.channel.server.defaultChannel, `deleting channel ${suffix} at ${msg.author}'s request`); 
270             if (msg.channel.server.defaultChannel != msg.channel) { 
271                 bot.sendMessage(msg.channel, `deleting ${channel}`); 
272             } 
273             bot.deleteChannel(channel).then(channel => { 
274                 console.log(`deleted ${suffix} at ${msg.author}'s request`); 
275             }).catch(error => bot.sendMessage(msg.channel, `couldn't delete channel: ${error}`)); 
276         } 
277     }, 
278     "stock": { 
279         usage: "<stock to fetch>", 
280         process: function (bot, msg, suffix) { 
281             var yahooFinance = require('yahoo-finance'); 
282             yahooFinance.snapshot({ 
283                 symbol: suffix, 
284                 fields: ['s', 'n', 'd1', 'l1', 'y', 'r'], 
285             }, function (error, snapshot) { 
286                 if (error) { 
287                     bot.sendMessage(msg.channel, `couldn't get stock: ${error}`); 
288                 } else { 
289                     //bot.sendMessage(msg.channel,JSON.stringify(snapshot)); 
290                     bot.sendMessage(msg.channel, `${snapshot.name}\nprice: $${snapshot.lastTradePriceOnly}`); 
291                 } 
292             }); 
293         } 
294     }, 
295     "wolfram": { 
296         usage: "<search terms>", 
297         description: "gives results from wolframalpha using search terms", 
298         process: function (bot, msg, suffix) { 
299             if (!suffix) { 
300                 bot.sendMessage(msg.channel, "Usage: !wolfram <search terms> (Ex. !wolfram integrate 4x)"); 
301             } 
302             wolfram_plugin.respond(suffix, msg.channel, bot); 
303         } 
304     }, 
305     "rss": { 
306         description: "lists available rss feeds", 
307         process: function (bot, msg, suffix) { 
308             /*var args = suffix.split(" "); 
309             var count = args.shift(); 
310             var url = args.join(" "); 
311             rssfeed(bot,msg,url,count,full);*/ 
312             bot.sendMessage(msg.channel, "Available feeds:", () => { 
313                 for (var c in rssFeeds) { 
314                     bot.sendMessage(msg.channel, `${c}: ${rssFeeds[c].url}`); 
315                 } 
316             }); 
317         } 
318     }, 
319     "reddit": { 
320         usage: "[subreddit]", 
321         description: "Returns the top post on reddit. Can optionally pass a subreddit to get the top psot there instead", 
322         process: function (bot, msg, suffix) { 
323             var path = "/.rss" 
324             if (suffix) { 
325                 path = `/r/${suffix}${path}`; 
326             } 
327             rssfeed(bot, msg, `https://www.reddit.com${path}`, 1, false); 
328         } 
329     }, 
330     "alias": { 
331         usage: "<name> <actual command>", 
332         description: "Creates command aliases. Useful for making simple commands on the fly", 
333         process: function (bot, msg, suffix) { 
334             var args = suffix.split(" "); 
335             var name = args.shift(); 
336             if (!name) { 
337                 bot.sendMessage(msg.channel, `>alias ${this.usage}\n${this.description}`); 
338             } else if (commands[name] || name === "help") { 
339                 bot.sendMessage(msg.channel, "overwriting commands with aliases is not allowed!"); 
340             } else { 
341                 var command = args.shift(); 
342                 aliases[name] = [command, args.join(" ")]; 
343                 //now save the new alias 
344                 fs.writeFile("./alias.json", JSON.stringify(aliases, null, 2), null); 
345                 bot.sendMessage(msg.channel, `created alias ${name}`); 
346             } 
347         } 
348     }, 
349     "userid": { 
350         usage: "[user to get id of]", 
351         description: "Returns the unique id of a user. This is useful for permissions.", 
352         process: function (bot, msg, suffix) { 
353             if (suffix) { 
354                 var users = msg.channel.server.members.getAll("username", suffix); 
355                 if (users.length == 1) { 
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
620         var cmd = commands[cmdTxt]; 
621         if (cmdTxt === "help") { 
622             //help is special since it iterates over the other commands 
623             bot.sendMessage(msg.author, "Available Commands:", () => { 
624                 var info = `>${cmd}`; 
625                 for (var cmd in commands) { 
626                     var usage = commands[cmd].usage; 
627                     if (usage) { 
628                         info += ` ${usage}`; 
629                     } 
630                     info += "\n"; 
631                 } 
632                 bot.sendMessage(msg.author, info); 
633             }); 
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
688         console.log(err); 
689     } 
690 } 
691 exports.commandCount = () => Object.keys(commands).length; 
692 
 
693 
 
694 bot.loginWithToken("Bot Token. Get one at http://discordapp.com/developers"); 
