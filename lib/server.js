var EventEmitter = require("events").EventEmitter;
var CFG = require('config')
var parser = require('./parser');

var eventEmiter = new EventEmitter();
parser.setEventEmiter(eventEmiter);

var manager = require('./manager')(eventEmiter);

module.exports = {
    start: function(){
        var data = "";
        require('http').createServer(function(request, response) {
            var body = "";
            function respond(status, content) {
                response.writeHead(status, { "Content-Type": "text/plain" });
                if(content) response.end(content);
                else response.end();
            }
            if(request.method === "POST") {
                request.on("data", function(chunk) {
                    body += chunk.toString();
                });
            }
            else if(request.method === "GET") {
                respond(200, 'GET not supported.\n');
            }
            request.on("end", function() {
                try {
                    var payload = validatePayload(body);
                    parser.parse(payload);
                    respond(200);
                } catch(e) {
                    respond(200, e.message);
                }
            });     
        }).listen(CFG.server.port);
        console.log('GitRelay server started on port', CFG.server.port + '.');
    }
}

function validatePayload(raw) {
	try {
		if(/^payload=/.test(raw)) {
			return JSON.parse(unescape(raw.slice(8)).replace(/\+/g,' '));
		} else{
			throw new Error('no payload.\n')
		}
	} catch(e) {
		throw new Error('unrecognized payload signature.\n')
	}
}
