namespace('CDB.Lib', function(root)
{
	var fs 			= root.fs;
	var nconf		= root.nconf;
	var is			= root.Plankton.is;
	var classify	= root.Classy.classify;
	var Singleton	= root.Classy.Singleton;
	
	
	
	var Config = function() 
	{
		classify(this);
		
		var path = 'config.json';
		
		if (!is(fs.existsSync(path)))
			throw new Error('config.json does not exists');
		
		nconf.use('file', {file: path});
	};
	
	
	Config.prototype._getHost = function()
	{
		return nconf.get('host');
	};
	
	Config.prototype._getPort = function()
	{
		return nconf.get('port');
	};
	
	
	Config.prototype.getUrl = function(suffix)
	{
		var result = this._getHost() + ':' + this._getPort();
		
		if (is(suffix))
			return result.concat(suffix);
		
		return result;
	};
	
	Config.prototype.getMaxUpdatesPerDB = function()
	{
		return nconf.get('maxUpdatesPerDB');
	};
	
	Config.prototype.getDocumentsCacheTTLInSeconds = function()
	{
		return nconf.get('documentsCacheTTLInSeconds');
	};
	
	
	this.Config = Singleton(Config);
});