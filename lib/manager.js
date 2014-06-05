var fs = require('fs');
var CFG = require('config');

var pluginsDir = './plugins';
var plugins = [];

module.exports = function(eventEmiter) {
	this.eventEmiter = eventEmiter;
    console.log('Loading plugins from', pluginsDir);
    loadPlugins(pluginsDir, function(err){
		console.log(CFG.routes.length + ' route'+((CFG.routes.length > 1)?'s':'') + ' found');
		var validRoutes = 0;
		for(var i=0; i<CFG.routes.length; i++){
			var route = CFG.routes[i];
			validRoutes += analyzeRoute(route, i);
		}
		if(validRoutes == 0) console.log('WARN: No active routes! Still listening but not doing much.')
    });
}

function loadPlugins(path, cb) {
	eventEmiter = this.eventEmiter;
    fs.lstat(path, function(err, stat) {
        if (stat.isDirectory()) {
            fs.readdir(path, function(err, files) {
                var f, l = files.length;
                for (var i = 0; i < l; i++) {
		            var name = files[i].substring(0, files[i].indexOf('.js'));
		            if(name){
           	            var plugin = require('../plugins/' + name);
           	            plugin.init(eventEmiter);
			            plugins.push(plugin);
		            }
                }
   		        cb(err);
            });
	    }
	});
}

function analyzeRoute(route, index){
	var ret = 1;
	try {
		var definition = validateRoute(route, index);
		validateRequiredPlugins(route, index);
		console.log('active route #' + (index+1) + ':', definition);
	} catch(e) {
		ret = 0;
		console.log('Route #' + (index+1) + ':', e.message)
	}
	return ret;
}

function validateRoute(route){
	if(!route.source) {
		throw new Error('route source is required.')
	} else {
		if(!route.source.repo) {
			throw new Error('route source repo is required.Valid value: remote repo name.')
		}
	}
	if(!route.target) {
		throw new Error('route target is required.')
	} else {
		if(!route.target.destination) {
			throw new Error('route target destination is required. Valid values: local.')
		}
		if(!route.target.type) {
			throw new Error('route target type is required. Valid values: git.')
		}
		if(!route.target.repo) {
			throw new Error('route target repo is required. Valid value: local repo path.')
		}
	}
	var ret = 'file commits to the ' + route.source.repo + ' repo are now pulled to the ' + route.target.destination + ' ' + route.target.type + ' repo at ' + route.target.repo + '.';
	return ret;
}

function validateRequiredPlugins(route){
	ret = false;
	if(route.source.type) {
		ret = false;
		for(var i=0; i<plugins.length; i++) {
			var plugin = plugins[i];
			if(plugin.meta.type == route.source.type) {
				ret = true;
				break;
			}
		}
		if(!ret) throw new Error('no plugins available to handle ' + route.source.type +' sources.');
	}
	if(route.target.type) {
		ret = false;
		for(var i=0; i<plugins.length; i++) {
			var plugin = plugins[i];

			if(plugin.meta.type == (route.target.destination + route.target.type)) {
				ret = true;
				break;
			}
		}
		if(!ret) throw new Error('no plugins available to handle ' + route.target.destination + ' ' + route.target.type +' targets.');
	}
}	
