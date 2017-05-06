const fs = require('fs');
const https = require('https');
const urlParse = require('url').URL;
const pathsda = require('path');
/**
 * @TODO add custom version
 */
var VersionManager = {

    /**
     * @TODO Now work only on POSIX
     */
    createDefaultDir: function DefaultDir() {
        fs.mkdirSync("/Applications/NodeMine/");
    }
    ,
    /**
     * @TODO Don't work because 1.10.json store associate files
     * @param name
     */
    initVersion: function init(name) {
        var file = fs.createWriteStream("/Applications/NodeMine/versions/1.10/1.10.json");
        var request = https.get("https://launchermeta.mojang.com/mc/assets/1.10/72241db3c0bdc39e39b202182ff0000da5271a1d/1.10.json", function (response) {
            response.pipe(file);
        });
    },
    /**
     * load files from server
     * @param name
     * @TODO add Custom server
     */
    loadFiles: function load(name) {
        var path = "/Applications/NodeMine/versions/1.11.2/";
        var commandLauncher="java -Djava.library.path="+path+"natives -cp '";
        var version = JSON.parse(fs.readFileSync(path + "1.11.2.json"));
        var libs = version.libraries;
        var links = [];
        for (var key in libs) {
            if (libs[key].downloads.artifact != undefined) {
                links[links.length] = {
                    url: libs[key].downloads.artifact.url,
                    name: libs[key].name
                };
                //console.log(key);
            }
        }
        links.forEach(function (fileName) {
            const pathToFiles = new URL(fileName.url);
                var path = "";
                var arrayDir = pathsda.dirname(pathToFiles.pathname).split(pathsda.sep);
                for (var key in arrayDir) {
                    if (arrayDir[key] != "") {
                        path = path + arrayDir[key] + "/";
                        console.log(path);
                        if (!fs.existsSync("/Applications/NodeMine/libraries/" + path)){
                            fs.mkdirSync("/Applications/NodeMine/libraries/" + path);
                        }
                    }
                }
            var ttta = "/Applications/NodeMine/libraries" + pathToFiles.pathname;
                var file = fs.createWriteStream(ttta);
                https.get(fileName.url, function (response) {
                    response.pipe(file);
                });
            commandLauncher+=ttta+"';";
                //console.log("Download: " + pathToFiles + " complete ")

        });

        var file = fs.createWriteStream("/Applications/NodeMine/versions/1.11.2/1.11.2.jar");
        https.get(version.downloads.client.url, function (response) {
            response.pipe(file);
        });
        console.log(commandLauncher);

    }

};



module.exports = VersionManager;