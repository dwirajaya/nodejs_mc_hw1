/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var problems = require('./problems');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res){
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function(){
  console.log('The HTTP server is running on port '+config.httpPort);
});

// All the server logic for both the http and https server
var unifiedServer = function(req, res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data, function(statusCode, payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ", statusCode, payloadString);

      });

  });
};

// Define all the handlers
var handlers = {};

// hello handler
handlers.hello = function(data, callback) {
    // Randomly select an index
    var index = Math.floor(Math.random() * problems.length);

    // Make sure that a problem exists in the selected index. Otherwise return an empty object
    var selectedProblem = typeof(problems[index]) == 'object' ? problems[index] : {};

    // Return the selected problem
    callback(200, {
        'message': 'Hello! Here\'s a problem for you to solve.',
        'problem': selectedProblem
    });
};

// Not found handler
handlers.notFound = function(data, callback){
  callback(404);
};

// Define the request router
var router = {
  'hello' : handlers.hello
};
