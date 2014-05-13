var port = process.env.PORT || 9000;
var connect = require('connect');
connect.createServer(connect.static(__dirname)).listen(port);