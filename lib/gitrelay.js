var CFG = require('config');

var gith = require('gith').create(CFG.server.port);
gith({
  // repo: CFG.source.repo
}).on( 'all', function( payload ) {
  console.log('Post-receive happened!');
  console.log(payload);
});
console.log('GitRelay started on port', CFG.server.port);
console.log('Relaying changes from', CFG.source.repo, CFG.source.type?CFG.source.type:'', 'repository, to', CFG.target.type?CFG.target.type:'', CFG.target.dir);
