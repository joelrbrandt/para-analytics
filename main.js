(function () {
    "use strict";

    var Promise = require("bluebird"),
        config = require("./config"),
        redis = require("redis"),
        writeFile = Promise.promisify(require("fs").writeFile);

    var redisClient = null;

    var processData = function (data) {
        var keys = Object.keys(data),
            intermediate = {},
            output = {};

        keys.forEach(function (k) {
            var a = k.split(":"),
                session = a[0],
                event = a[1],
                dataKey = a[2];

            if (!intermediate.hasOwnProperty(session)) {
                intermediate[session] = {};
                output[session] = [];
            }

            if (!intermediate[session].hasOwnProperty(event)) {
                intermediate[session][event] = {};
            }

            if (dataKey === "data") {
                try {
                    intermediate[session][event][dataKey] = JSON.parse(data[k]);
                } catch (e) {
                    intermediate[session][event][dataKey] = {error: "unable to parse data"};
                }
            } else {
                intermediate[session][event][dataKey] = data[k];
            }
        });

        var sessions = Object.keys(intermediate);

        sessions.forEach(function (s) {
            var events = Object.keys(intermediate[s]);
            events.forEach(function (e) {
                output[s].push(intermediate[s][e]);
            });
        });

        var comparator = function (a, b) {
            return a.time - b.time;
        };

        sessions.forEach(function (s) {
            output[s].sort(comparator);
        });

        return output;
    };

    var dumpOutput = function () {
        return (
            redisClient.keysAsync("*")
            .then(function (keys) {
                return Promise.all(keys.map(function (key) {
                    return (
                        redisClient.hgetallAsync(key)
                        .then(processData)
                        .then(function (processedData) {
                            return {user: key, sessions: processedData};
                        })
                    );
                }));
            })
            .then(function (data) {
                var resolve = require("path").resolve,
                    filename = resolve(__dirname, "output.json");

                return writeFile(filename, JSON.stringify(data, null, "  "));
            })
        );
    };

    var options = {
        "enable_offline_queue" : false,
        "retry_max_delay" : 10000 // 10 seconds
    };

    if (config.redisServer && config.redisServer.host && config.redisServer.port) {
        redisClient = redis.createClient(config.redisServer.port, config.redisServer.host, options);
    } else if (config.redisServer && config.redisServer.socket) {
        redisClient = redis.createClient(config.redisServer.socket, options);
    }

    redisClient = Promise.promisifyAll(redisClient);

    redisClient.once("ready", function () {
        dumpOutput()
        .then(function () {
            redisClient.quit();
        });
    });


}());
