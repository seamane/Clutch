var express = require('express');
var database = require('./routes/database');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var index = require('./routes/index');

var app = express();

app.set('views',path.join(__dirname, 'views'));

//view engine setup
app.set('port',process.env.PORT || 3000);
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

//"Middleware" setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));


var server = app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + server.address().port);
});

database.initDatabase();

//index requests
app.get('/',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.get('/css/foundation.css',function(req,res){res.sendFile(__dirname + '/css/foundation.css');});
app.get('/css/app.css',function(req,res){res.sendFile(__dirname + '/css/app.css');});
app.get('/js/vendor/modernizr.js',function(req,res){res.sendFile(__dirname + '/js/vendor/modernizr.js');});
app.get('/js/vendor/jquery.js',function(req,res){res.sendFile(__dirname + '/js/vendor/jquery.js');});
app.get('/js/foundation.min.js',function(req,res){res.sendFile(__dirname + '/js/foundation.min.js');});
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js')});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js')});

app.post('/validateUser',database.validateUser);

// app.get('/createUser',function(req,res){res.sendFile(__dirname + '/views/createUser.html');});
// app.get('/tasks',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
//app.post('/newUser',database.newUser);
app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});


//catch 404 and forward error handler
// app.use(function(req,res,next){
// 	var err = new Error("Not Found");
// 	err.status = 404;
// 	next(err);
// });

// //production error handler
// app.use(function(err,req,res){
// 	res.status(err.status||500);
// 	res.render('error',{
// 		message: err.message,
// 		error: {}
// 	});
// });