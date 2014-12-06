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
app.get('/angular/angular.min.js.map',function(req,res){res.sendFile(__dirname+'/views/angular/angular.min.js.map');})
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js');});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js');});
app.get('/navbar.html',function(req,res){res.sendFile(__dirname+'/views/navbar.html');});
app.get('/chicken.jpg',function(req,res){res.sendFile(__dirname+'/views/chicken.jpg');});
app.get('/chickens.png',function(req,res){res.sendFile(__dirname+'/views/chickens.png');});



app.post('/validateUser',database.validateUser);
app.post('/create',database.create);
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js');});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js');});

app.post('/validateUser', database.validateUser);
app.post('/validateProject', database.validateProject);
app.post('/createProject', database.createProject);
app.post('/addProject', database.addProject);

// app.get('/tasks',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
//app.post('/newUser',database.newUser);
app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});
app.get('/loginpage',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.post('/getProjects',database.getProjects);
app.post('/getAnnouncements',database.getAnnouncements);
app.post('/getSequences',database.getSequences);
app.get('/project',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
app.get('/navbar.html',function(req,res){res.sendFile(__dirname + '/views/navbar.html');});
app.get('/shotInfo.html',function(req,res){res.sendFile(__dirname + '/views/shotInfo.html');});
app.get('/createUser',function(req,res){res.sendFile(__dirname+'/views/createUser.html');});


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
