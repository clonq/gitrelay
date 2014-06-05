module.exports = {
	parse: function(payload) {
		var isBitbucket = (payload.canon_url && /bitbucket/.test(payload.canon_url)) ? true : false;
		var isGithub = (payload.repository.full_name) ? true : false;
		var repo = 'unknown';
		if(isBitbucket) repo = payload.repository.name;
		else if(isGithub) repo = payload.repository.full_name;
		if(payload.commits) {
			this.eventEmiter.emit('commit', {repository:repo,  commits:payload.commits});
		}
	},
	setEventEmiter: function(eventEmiter){
		this.eventEmiter = eventEmiter;
	}
}