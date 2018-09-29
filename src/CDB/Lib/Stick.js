namespace('CDB.Lib', function(root)
{
	var classify	= root.Classy.classify;
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var foreach		= root.Plankton.foreach;
	var Config		= root.CDB.Lib.Config;
	var Request		= root.CDB.Lib.Request;
	
	
	var Stick = function()
	{
		classify(this);
		
		this._config = Config.instance();
	};
	
	
	Stick.prototype._onTouchedIt = function(db, documentId, viewId)
	{
		console.log('CDB INFO:', 'Touched ', db + '/' + documentId + '/' + viewId);
	};
	
	Stick.prototype._prepareTouch = function(db, documentId, viewId)
	{
		var request = new Request();
		request.onComplete(this._onTouchedIt.bind(this, db, documentId, viewId));
		request.get(this._config.getUrl('/' + db + '/' + documentId + '/_view/' + viewId + '?stale=update_after'));
	};
	
	
	Stick.prototype.touch = function(db, documents)
	{
		foreach(documents, this, function(document)
		{
			if (!is(document.doc) || !is(document.doc.views))
			{
				console.warn('CDB WARNING:', 'Missing views ', db, JSON.stringify(document));
				return true;
			}
			
			var viewId = obj.keys(document.doc.views)[0];
			
			this._prepareTouch(db, document.id, viewId);
		});
	};
	
	
	this.Stick = Stick;
});