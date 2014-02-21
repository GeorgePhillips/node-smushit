var fs = require("fs"),
    url = require("url"),
	http = require("http");

exports.SMUSH_SERVICE = 'http://www.smushit.com/ysmush.it/ws.php';
	
var	buildRequestBody = function(params){
		var boundary = '------multipartformboundary' + new Date().getTime();
		var dashdash = '--';
		var crlf     = '\r\n';
	 
		// Build RFC2388.
		var builder = '';

		builder += dashdash;
		builder += boundary;
		builder += crlf;
	 
		builder += 'Content-Disposition: form-data; name="files"';
		builder += '; filename="' + encodeURIComponent(params.filename.replace(/.+[\/\\]/, '')) + '"';
		builder += crlf;
	 
		builder += 'Content-Type: application/octet-stream';
		builder += crlf;
		builder += crlf;
	 
		// Add file contents
		if (params.buffer) {
			builder += params.buffer.Body.toString("binary");
		} else {
			builder += fs.readFileSync(params.filename, "binary");
		}
		builder += crlf;
	 
		// Add extra parameters
		for(var paramName in params.extraParams){
			if(params.extraParams.hasOwnProperty(paramName)){
				builder += dashdash;
				builder += boundary;
				builder += crlf;
		 
				builder += 'Content-Disposition: form-data; name="'+ paramName +'"';
				builder += crlf;
				builder += crlf;

				// Encode for sending
				builder += encodeURIComponent(params.extraParams[paramName]);
				builder += crlf;
			}
		}
		
		// Close RFC2388
		builder += dashdash;
		builder += boundary;
		builder += dashdash;
		builder += crlf;

		return {
			contentType: 'multipart/form-data; boundary=' + boundary,
			body: builder
		};
}

var smushit = function(params){
	var seriveEndpoint = params.customService || exports.SMUSH_SERVICE,
		serviceParsed = url.parse(seriveEndpoint),
		options = {
			host: serviceParsed.hostname,
			port: serviceParsed.port,
			path: serviceParsed.pathname
		},
		httpRequest,
		onRequestCompleted = function(response) {
			var body = '';
			response.on('data', function(chunk) {
				body += chunk;
			});
			response.on('end', function() {
				params.done && params.done(body);
			});
		};

	if (params.filename.match(/https?:\/\//)) {
		options.method = "GET";
		options.path += "?img=" + encodeURIComponent(params.filename);
		httpRequest = http.get(options, onRequestCompleted);
	} else {
		var data = buildRequestBody(params);
		options.method = "POST";
		options.headers =  {
			'Content-Type': data.contentType,
			'Content-Length': data.body.length
	    };
		httpRequest = http.request(options, onRequestCompleted);
		httpRequest.write(data.body, "binary");
		httpRequest.end();
	}
	
	if (params.fail) {
		httpRequest.on('error', params.fail);
	}
};

exports.smushit = smushit;