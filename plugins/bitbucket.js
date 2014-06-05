module.exports = {
	meta: {type:'bitbucket'},
	init: function(ee) {
		// console.log('initializing test plugin', ee);
		ee.on('commit', function(data){
		    console.log('bitbucket plugin: relaying data.')
		    ee.emit('relay', data);
		});
	}
}