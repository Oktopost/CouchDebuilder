namespace('CDB.Lib', function(root)
{
	var Event		= root.Duct.Event;
	var is			= root.Plankton.is;
	var Request		= root.CDB.Lib.Request;
	var Config		= root.CDB.Lib.Config;
	var classify	= root.Classy.classify;
	
	
	
	var Listener = function() 
	{
		classify(this);
		
		this._config = Config.instance();
		
		this._maxChangesPerDB = this._config.getMaxUpdatesPerDB();
		
		this._onReachedLimitEvent = new Event('Listener.OnReachedLimit');
		
		this._endPoint = '/_db_updates?feed=continuous';
		
		this._dbs = {};
	};
	
	
	Listener.prototype._triggerOnReachedLimit = function(dbName)
	{
		this._onReachedLimitEvent.trigger(dbName);
		this._dbs[dbName] = 0;
	};
	
	
	Listener.prototype._onGotChunk = function(data)
	{
		var row = JSON.parse(data.toString());
		var dbName = row.db_name;
		
		if (!is(this._dbs[dbName]))
			this._dbs[dbName] = 0;
		
		this._dbs[dbName]++;
		
		if (this._dbs[dbName] >= this._maxChangesPerDB)
			this._triggerOnReachedLimit(dbName)
	};
	
	Listener.prototype._onComplete = function()
	{
		this.listen();
	};
	
	Listener.prototype._onError = function(error)
	{
		console.error(error);
	};
	
	
	
	Listener.prototype.listen = function()
	{
		var request = new Request();
		
		request.onComplete(this._onComplete);
		request.onError(this._onError);
		request.onGotChunk(this._onGotChunk);
		
		request.get(this._config.getUrl(this._endPoint));
	};
	
	
	Listener.prototype.onReachedLimit = function (item)
	{
		return this._onReachedLimitEvent.listener(item);
	};
	
	
	this.Listener = Listener;
});