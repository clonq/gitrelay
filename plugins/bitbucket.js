module.exports = {
	meta: {type:'bitbucket'},
	init: function(ee) {
		ee.on('commit', function(data){
		    console.log('bitbucket plugin: relaying data.')
		    ee.emit('relay', data);
		});
	}
}