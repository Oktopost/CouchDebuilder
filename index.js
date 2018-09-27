var root = require('oktopost-namespace').virtual(__dirname);
module.exports = root.CDB;


var autoload = [
	'fs', 
	'nconf', 
	'http', 'https'
];

root.Plankton.foreach(autoload, function(name)
{
	root[name] = require(name);
});


(new root.CDB.Main()).init();