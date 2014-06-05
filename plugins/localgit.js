var exec = require('child_process').exec;
var CFG = require('config');

var localRepo;
var remoteRepo;
var branch;
var remoteAlias;

module.exports = {
	meta: {type:'localgit'},
	init: function(ee) {
		//find all routes with target destnation:local, type:git and register with them
		//todo: register with all of them, currently only the last route is registered 
		for(var i=0; i<CFG.routes.length; i++){
			var route = CFG.routes[i];
			if((route.target.destination == 'local') && (route.target.type == 'git')) {
				console.log('localgit plugin registered with route #' + (i+1), ', local repo:', route.target.repo);
				localRepo = route.target.repo;
				remoteRepo = route.source.repo;
				branch = route.source.branch; 
			}
		}
		getGitRemotes(function(err, remotes){
			for(var alias in remotes) {
				var remote = remotes[alias];
				if((remote.name == remoteRepo) && (remote.ops.indexOf('fetch') >=0)) {
					remoteAlias = alias;
					break;
				}
			}
			if(!remoteAlias) console.log('WARN: there are ', Object.keys(remotes).length, 'remote'+((Object.keys(remotes).length>1)?'s':''), Object.keys(remotes), 'added to the local git repository but none point to', remoteRepo+'.');
			else {
				getGitBranches(function(err, branches){
					var validBranch = false;
					for(var i=0; i<branches.length; i++) {
						var entry = branches[i];
						if((entry.alias == remoteAlias) && (entry.branch == branch)) {
							validBranch = true
							break;
						}
					}
					if(!validBranch) console.log('WARN:', remoteAlias, 'remote does not have a branch', branch+'.');
				})				
			}
		});
		// register event handlers
		ee.on('relay', function(data){
			try {
				if(remoteAlias) {
console.log('localgit: changing dir to ', localRepo)
					process.chdir(localRepo)
					exec('git reset --hard HEAD', function (error, stdout, stderr) {
						if (stdout) console.log(stdout);
						if (stderr) console.log(stderr);
						if (error) console.log('Error: ' + error);
console.log('pulling from ' + remoteAlias);
						exec('git pull ' + remoteAlias + ' ' + branch, function (error, stdout, stderr) {
							if (stdout) console.log(stdout);
							if (stderr) console.log(stderr);
							if (error) console.log('Error: ' + error);
						});
					});

				} else{
					console.log('No remote alias!')
				}
			} catch(e) {
console.log(e)
			}
		});
	},
	getRepo: function() {
		return this.repo;
	}
}

function getGitRemotes(cb) {
	var ret = {}
	var err = null;
	process.chdir(localRepo)
	exec('git remote -v', function (error, stdout, stderr) {
		var lines = stdout.split('\n')
		for(var i=0; i<lines.length; i++) {
			var line = lines[i];
			if(line) {
				var alias = line.split('\t')[0]
				var remoteUrl = line.split('\t')[1].split(' ')[0];
				var remoteName = remoteUrl.substring(remoteUrl.lastIndexOf('/')+1)
				// if(remoteName.indexOf('.')>0) remoteName = remoteName.substring(0, remoteName.indexOf('.'));
				var remoteOp = line.split('\t')[1].split(' ')[1].replace(/[\(\)]/g, '');
				var remote = {name:remoteName, url:remoteUrl, ops:[remoteOp]};
				if(ret[alias]) {
					ops = ret[alias].ops
					if(ops.indexOf(remoteOp) < 0) {
						ops.push(remoteOp)
					}
				} else{
					ret[alias] = remote;					
				}
			}
		}
		if (stderr) err = new Error(stderr);
		if (error) err = new Error(error);
		cb(err, ret);
	});
}

function getGitBranches(cb) {
	var ret = []
	var err = null;
	process.chdir(localRepo)
	exec('git branch -r', function (error, stdout, stderr) {
		var lines = stdout.split('\n')
		for(var i=0; i<lines.length; i++) {
			var line = lines[i];
			if(line) {
				var alias = line.split('/')[0].trim();
				var branch = line.split('/')[1].trim();
				ret.push({alias:alias, branch:branch});
			}
		}
		if (stderr) err = new Error(stderr);
		if (error) err = new Error(error);
		cb(err, ret);
	});
}
