// HTTP Server
const httpPort = 1234;
const pubsubHost = "localhost";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  console.log(req.url);
  console.log(req.body);
  next();
});
routes(app);

var httpServer = app.listen(httpPort, function () {
  console.log("HTTP Server running on port " + httpPort);
});

// MQTT Server
var mosca = require('mosca');
const mqttPort = 8443;
var settings = {
    port: mqttPort,
  };

var mqttServer = new mosca.Server(settings);
var request = require('request');
mqttServer.on('clientConnected', function(client) {
	console.log('client connected', client.id);
});

mqttServer.on('published', function(packet, client) {
    if (client) {
        var projectID = client.id.split("/")[1];
        request.post("http://" + pubsubHost + ":8085/v1/projects/" + projectID + "/topics/events:publish",
            { json:
                    {
                        "messages": [
                            {
                                "data": Buffer.from(packet.payload).toString("base64")
                            }
                        ]
                    }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            });
    }
  });


mqttServer.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('MQTT server is up and running on port ' + mqttPort);
}

console.log("** Core IOT Emulator Started! **");
