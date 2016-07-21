exports.commands = [
    "pullanddeploy"
]
exports.pullanddeploy: {-description: "bot will perform a git pull master and restart with the new code",
    -process: function(bot, msg, suffix) {
        -bot.sendMessage(msg.channel, "fetching updates...", function(error, sentMsg) {
            -console.log("updating..."); -
            var spawn = require('child_process').spawn; -
            var log = function(err, stdout, stderr) {
                -
                if (stdout) {
                    console.log(stdout);
                } -
                if (stderr) {
                    console.log(stderr);
                } -
            }; -
            var fetch = spawn('git', ['fetch']); -
            fetch.stdout.on('data', function(data) {
                -console.log(data.toString()); -
            }); -
            fetch.on("close", function(code) {
                -
                var reset = spawn('git', ['reset', '--hard', 'origin/master']); -
                reset.stdout.on('data', function(data) {
                    -console.log(data.toString()); -
                }); -
                reset.on("close", function(code) {
                    -
                    var npm = spawn('npm', ['install']); -
                    npm.stdout.on('data', function(data) {
                        -console.log(data.toString()); -
                    }); -
                    npm.on("close", function(code) {
                        -console.log("goodbye"); -
                        bot.sendMessage(msg.channel, "brb!", function() {
                            -bot.logout(function() {
                                -process.exit(); -
                            }); -
                        }); -
                    }); -
                }); -
            });
        });
    }
},
