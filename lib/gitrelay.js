var http = require("http");	
var CFG = require('config');

// var gith = require('gith').create(CFG.server.port);
// gith({
//   // repo: CFG.source.repo
// }).on( 'all', function( payload ) {
//   console.log('Post-receive happened!');
//   console.log(payload);
// });

function startServer(){
	var data = "";
	http.createServer(function(request, response) {
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
			respond(200, 'GET not supported\n');
		}
		request.on("end", function() {
			try {
console.log('validate')
				validatePayload(body);
console.log('process')
console.log(body)	
				processPayload(JSON.parse(body));
console.log('done')
				respond(200);
			} catch(e) {
				respond(200, e.message);
			}
		});		
	}).listen(CFG.server.port);
}

function validatePayload(raw) {
	try {
		JSON.parse(raw);
		console.log('valid payload')
	} catch(e) {
		throw new Error('unrecognized payload signature\n')
	}
}

function processPayload(payload) {
console.log('..')	
	console.log(payload)
}


//  chdir($this->_directory);
// $this->log('Changing working directory... ');
 
// // Discard any changes to tracked files since our last deploy
// exec('git reset --hard HEAD', $output);
// $this->log('Reseting repository... '.implode(' ', $output));
 
// // Update the local repository
// exec('git pull '.$this->_remote.' '.$this->_branch, $output);
// $this->log('Pulling in changes... '.implode(' ', $output));
 
// // Secure the .git directory
// exec('chmod -R og-rx .git');
// $this->log('Securing .git directory... ');
 
// if (is_callable($this->post_deploy))
// {
// call_user_func($this->post_deploy, $this->_data);
// }
 
// $this->log('Deployment successful.');

function start() {
	info();
	startServer();
}

function info() {
	console.log('GitRelay started on port', CFG.server.port);
	console.log('Relaying changes from', CFG.source.repo, CFG.source.type?CFG.source.type:'', 'repository, to', CFG.target.type?CFG.target.type:'', CFG.target.dir);
}

start();


/*

Bitbucket

{
    "canon_url": "https://bitbucket.org",
    "commits": [
        {
            "author": "marcus",
            "branch": "master",
            "files": [
                {
                    "file": "somefile.py",
                    "type": "modified"
                }
            ],
            "message": "Added some more things to somefile.py\n",
            "node": "620ade18607a",
            "parents": [
                "702c70160afc"
            ],
            "raw_author": "Marcus Bertrand <marcus@somedomain.com>",
            "raw_node": "620ade18607ac42d872b568bb92acaa9a28620e9",
            "revision": null,
            "size": -1,
            "timestamp": "2012-05-30 05:58:56",
            "utctimestamp": "2012-05-30 03:58:56+00:00"
        }
    ],
    "repository": {
        "absolute_url": "/marcus/project-x/",
        "fork": false,
        "is_private": true,
        "name": "Project X",
        "owner": "marcus",
        "scm": "git",
        "slug": "project-x",
        "website": "https://atlassian.com/"
    },
    "user": "marcus"
}
*/


/*

GITHUB


POST /payload HTTP/1.1

Host: localhost:4567
X-Github-Delivery: 72d3162e-cc78-11e3-81ab-4c9367dc0958
User-Agent: GitHub Hookshot 044aadd
Content-Type: application/json
Content-Length: 6615
X-Github-Event: issue

{
  "action": "opened",
  "issue": {
    "url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
    "number": 1347,
    ...
  },
  "repository" : {
    "id": 1296269,
    "full_name": "octocat/Hello-World",
    "owner": {
      "login": "octocat",
      "id": 1,
      ...
    },
    ...
  },
  "sender": {
    "login": "octocat",
    "id": 1,
    ...
  }
}
*/