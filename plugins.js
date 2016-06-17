var fs = require('fs'),
    path = require('path');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

var plugin_folders, plugin_directory, exec_dir;
try { //try loading plugins from a non standalone install first
    plugin_directory = "./plugins/";
    plugin_folders = getDirectories(plugin_directory);
} catch (e) { //load paths for an Electrify install
    exec_dir = path.dirname(process.execPath) + "/resources/default_app/"; //need this to change node prefix for npm installs
    plugin_directory = path.dirname(process.execPath) + "/resources/default_app/plugins/";
    plugin_folders = getDirectories(plugin_directory);
}

exports.init = () => preload_plugins();

function createNpmDependenciesArray(packageFilePath) {
    var p = require(packageFilePath);
    if (!p.dependencies) return [];
    var deps = [];
    for (var mod in p.dependencies) {
        deps.push(mod + "@" + p.dependencies[mod]);
    }

    return deps;
}

function preload_plugins() {
    var deps = [],
        npm = require("npm"),
        pluginlength = plugin_folders.length; // because of for loop perfomance
    for (var i = 0; i < pluginlength; i++) {
        try {
            require(plugin_directory + plugin_folders[i]);
        } catch (e) {
            deps = deps.concat(createNpmDependenciesArray(plugin_directory + plugin_folders[i] + "/package.json"));
        }
    }
    if (deps.length > 0) {
        npm.load({
            loaded: false
        }, err => {
            // catch errors
            if (plugin_directory !== "./plugins/") { //install plugin modules for Electrify builds
                npm.prefix = exec_dir;
                console.log(npm.prefix);
            }
            npm.commands.install(deps, (er, data) => {
                if (er) console.log(er);
                console.log("Plugin preload complete");
                load_plugins()
            });

            if (err) console.log(`preload_plugins: ${err}`);
        });
    } else load_plugins()
}

function load_plugins() {
    var dbot = require("./discord_bot.js"),
        commandCount = 0,
        pluginlength = plugin_folders.length;
    for (var i = 0; i < pluginlength; i++) {
        var plugin;
        try {
            plugin = require(plugin_directory + plugin_folders[i])
        } catch (err) {
            console.log("Improper setup of the '" + plugin_folders[i] + "' plugin. : " + err);
        }
        if (plugin) {
            if ("commands" in plugin) {
                for (var j = 0; j < plugin.commands.length; j++) {
                    if (plugin.commands[j] in plugin) {
                        dbot.addCommand(plugin.commands[j], plugin[plugin.commands[j]])
                        commandCount++;
                    }
                }
            }
        }
    }
    console.log(`Loaded ${dbot.commandCount()} chat commands type >help in Discord for a commands list.`)
}