namespace('CDB.Lib', function(root)
{
	var is			= root.Plankton.is;
	var Config		= root.CDB.Lib.Config;
	var Request		= root.CDB.Lib.Request;
	var classify	= root.Classy.classify;
	
	
	var Documents = function()
	{
		classify(this);
		
		this._config = Config.instance();
		this._cacheTTLInSeconds = this._config.getDocumentsCacheTTLInSeconds();
		
		this._perDB = {};
		this._docsEndpoint = '/_all_docs?startkey="_design/"&endkey="_design0"&include_docs=true';
	};
	
	Documents.prototype._onGetDocs = function(callback, db, response)
	{
		var json = JSON.parse(response);
		
		if (!is(json.rows))
		{
			console.error(db, response);
			return;
		}
		
		this._perDB[db] = {
			timestamp: +new Date(),
			data: json.rows
		}; 
		
		callback(this._perDB[db].data);
	};
	
	Documents.prototype._getFromDB = function(db, callback)
	{
		var endPoint = '/' + db + this._docsEndpoint;
		var request = new Request();
		request.onSuccess(this._onGetDocs.bind(this, callback, db));
		request.get(this._config.getUrl(endPoint));
	};
	
	
	Documents.prototype.get = function(db, callback)
	{
		if (is(this._perDB[db]))
		{
			var result = this._perDB[db];
			
			if (result.timestamp < (+new Date) - this._cacheTTLInSeconds * 1000)
			{
				this._getFromDB(db, callback);
			}
			else
			{
				callback(result.data);
			}
		}
		else
		{
			this._getFromDB(db, callback);
		}
	};
	
	
	this.Documents = Documents;
});