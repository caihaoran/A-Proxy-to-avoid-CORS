var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	next();
});
app.get('/*', function (req, res) {

	var data = req.query;
	data = require('querystring').stringify(data);

    var body = "";
    var option = {
        method: 'GET',
        host: '192.168.20.70',
        port: 9003,
        path: '/ems/'+req.params[0]+'?'+data
    };
	console.log('ems/'+req.params[0]+'?'+data);
    var request = http.request(option, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            res.set('Content-Type', 'application/json');
            res.send(body);
        });
    });
    request.end();
});
app.post('/*', function (req, res) {
	//console.log(req.params[0])
    var data = req.query;
	data = require('querystring').stringify(data);
    var body = "";
    var option = {
        method: 'POST',
        host: '192.168.20.70',
        port: 9003,
        path: '/ems/'+req.params[0],
		headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }
    };

    var request = http.request(option, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            res.set('Content-Type', 'application/json');
            res.send(body);
        });
    });
	request.write(post_data + "\n");
    request.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('http listening at http://%s:%s', host, port);
});

/*
var web_socket_server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: web_socket_server});
var port = 3000;


var sessions = [];


wss.on('connection', function connection(ws) {
    var location = url.parse(ws.upgradeReq.url, true);
    var id = "user_" + parseInt(Math.random() * 1e6).toString();
    var session = {
        "id": id
    };
    sessions.push(session);
	var json = {
	};
	if (ws.readyState == 1) {
		ws.send(JSON.stringify(json));
	}

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });



    setInterval(function () {
        if (ws.readyState == 1) {
            ws.send(JSON.stringify(json));
        }
    }, 30000);

});
web_socket_server.listen(port, function () {
    var host = web_socket_server.address().address;
    var port = web_socket_server.address().port;
    console.log('websocket listening at http://%s:%s', host, port);
});*/
