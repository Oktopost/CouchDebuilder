namespace('CDB', function(root)
{
	var classify	= root.Classy.classify;
	var Stick		= root.CDB.Lib.Stick;
	var Listener	= root.CDB.Lib.Listener;
	var Documents	= root.CDB.Lib.Documents;
	
	
	var Main = function() 
	{
		classify(this);
		
		this._stick = new Stick();
		
		this._documents = new Documents();
		this._listner = new Listener();
		this._listner.onReachedLimit(this._touchDB);
	};
	
	
	Main.prototype._touchDB = function(dbName)
	{
		this._documents.get(dbName, this._stick.touch.bind(this, dbName));
	};
	
	
	Main.prototype.init = function()
	{
		this._listner.listen();
	};
	
	
	this.Main = Main;
});
