var express=require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser=require('body-parser');
// var privateKey  = fs.readFileSync('./jpass.key', 'utf8');
// var certificate = fs.readFileSync('./jpass.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var path = require('path');
var engines = require('consolidate');
var app=express();
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// app.set('views','./views/');
// app.set('view engine','ejs');

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
require('./config/routes')(app);


httpServer.listen(3000);
// httpsServer.listen(443);
// app.listen(port);
