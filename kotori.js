//tells the client that it needs the discord.js package installed
var Discord = require("discord.js");
//makes it easier to program
var bot = new Discord.Client();

//add your bot accounts token bellow
bot.loginWithToken("bot token. get one from http://discordapp.com/developers");

//logs that the bot is logging and is ready in a amount of miliseconds
console.log("Logging in...");
console.log("Ready to begin");
console.log("in " + bot.readyTime)

//for welcoming people to the server
bot.on('serverNewMember', (server, user) => {
    bot.sendMessage(server.channels.get('name', 'general'), "Welcome to the server" + user);
    console.log("New Member Joined the server: " + user.username + " " + user);
});
//tells the console that bot is running and how many places its being hosted
bot.on("ready", function () {
    console.log("Running... Serving in " + bot.channels.length + " channels");
});
//--------------------------------------------------------------------------------------------------
//tells the bot that the message function is message
bot.on("message", function (message) {
    //just makes it a little easier to make basic input commands
    var input = message.content;

    {
        //if someone says !logout then the bot disconects
        if (input === "!logout")
            bot.logout();
    }
    //a ping pong test to check if the bots online
    if (input === "!ping") {
        bot.sendMessage(message, "Pong")
        console.log("ping/pong by " + message.author.username)
    }
    //a help command to ask the bot for help with commands
    if (input === "!help") {
        bot.reply(message, "Check out http://meta-bot.weebly.com/docs.html")
        console.log("help by " + message.author.username)
    }
    //a fun command for sending a image of a polygon animal mole
    if (input === "!giantmole") {
        bot.sendFile(message, "http://i.imgur.com/dm7SzvY.png");
        console.log("giantmole by " + message.author.username)
    }
    {
        //a say command (experimental?)
        if (input === "!say")
        sendMessage.content();
        console.log("say message by "  +  message.author.username)
    }
    {
        //a experimental command for Catricius because why not.
        if (input === "!catricius")
        bot.reply(message, "Dan Dan is not fully implemented yet, silly!");
        console.log(message.author.username + " tried running Dan Dan.")
    }
{
    
}

});
