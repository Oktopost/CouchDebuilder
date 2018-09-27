namespace('CDB.Lib', function(root)
{
	var http		= root.http;
	var https		= root.https;
	var Event		= root.Duct.Event;
	var classify	= root.Classy.classify;
	
	
	var Request = function() 
	{
		classify(this);
		
		this._onErrorEvent = new Event('Request.OnError');
		this._onSuccessEvent = new Event('Request.OnSuccess');
		this._onCompleteEvent = new Event('Request.OnComplete');
		this._onGotChunkEvent = new Event('Request.OnGotChunk');
	};
	
	
	Request.prototype._processResponse = function(response)
	{
		var onSuccess = this._onSuccessEvent;
		
		response.on('error', this._onErrorEvent.trigger);
		response.on('end', this._onCompleteEvent.trigger);
		response.on('data', this._onGotChunkEvent.trigger);
		
		var result= '';
		
		response.on('data', function(chunk)
		{
			result += chunk;
		});
		
		response.on('end', function()
		{
			onSuccess.trigger(result);
		});
	};
	
	
	Request.prototype.get = function(url)
	{
		var getter;
		
		if (url.indexOf('http:') !== -1)
		{
			getter = http;
		}
		else
		{
			getter = https;
		}
		
		getter.get(url, this._processResponse).on('error', this._onErrorEvent.trigger);
	};
	
	
	
	Request.prototype.onError = function(item)
	{
		return this._onErrorEvent.listener(item);
	};
	
	Request.prototype.onComplete = function (item)
	{
		return this._onCompleteEvent.listener(item);
	};
	
	Request.prototype.onSuccess = function(item)
	{
		return this._onSuccessEvent.listener(item);
	};
	
	Request.prototype.onGotChunk = function(item)
	{
		return this._onGotChunkEvent.listener(item);
	};
	
	
	this.Request = Request;
});