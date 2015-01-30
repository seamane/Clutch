var express = require('express');
var database = require('./routes/database');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var index = require('./routes/index');
var email = require('./routes/email');

var app = express();

app.set('views',path.join(__dirname, 'views'));


//view engine setup
app.set('port',process.env.PORT || 80);
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
app.get('/chicken.jpg',function(req,res){res.sendFile(__dirname+'/views/images/chicken.jpg');});
app.get('/chickens.png',function(req,res){res.sendFile(__dirname+'/views/images/chickens.png');});
app.get('/favicon.ico',function(req,res){res.sendFile(__dirname+'/views/images/favicon.ico');});

app.post('/validateUser',database.validateUser);
app.post('/createUser',database.createUser);
app.post('/validateUser', database.validateUser);
app.post('/validateProject', database.validateProject);
app.post('/createProject', database.createProject);
app.post('/addProject', database.addProject);
app.post('/getShots',database.getShots);
app.post('/getAnimators',database.getAnimators);
app.post('/createSequence', database.createSequence);
app.post('/getProjects',database.getProjects);
app.post('/getAnnouncements',database.getAnnouncements);
app.post('/getSequences',database.getSequences);
app.post('/getPrevis',database.getPrevis);
app.post('/getFX',database.getFX);
app.post('/getCompositing',database.getCompositing);
app.post('/getLighters',database.getLighters);
app.post('/getWranglers',database.getWranglers);
app.post('/getRigging',database.getRigging);
app.post('/getModeling',database.getModeling);
app.post('/getShading',database.getShading);
app.post('/getNotes',database.getNotes);
app.post('/postAnnouncement',database.postAnnouncement);
app.post('/sendEmail',email.sendEmail);
app.post('/getAssets',database.getAssets);
app.post('/createShot',database.createShot);
app.post('/createAsset',database.createAsset);
app.post('/getUsers',database.getUsers);

// app.get('/tasks',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});
app.get('/loginpage',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js');});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js');});
app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});
app.get('/loginpage',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.get('/project',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
app.get('/navbar.html',function(req,res){res.sendFile(__dirname + '/views/navbar.html');});
app.get('/shotInfo.html',function(req,res){res.sendFile(__dirname + '/views/shotInfo.html');});
app.get('/createUser',function(req,res){res.sendFile(__dirname+'/views/createUser.html');});
app.get('/directory',function(req,res){res.sendFile(__dirname+'/views/directory.html');});

//testing stuff
app.get('/test',function(req,res){res.sendFile(__dirname+'/views/test.html');});
app.get('/angular/AcuteTest.js',function(req,res){res.sendFile(__dirname+'/views/angular/AcuteTest.js');});
app.get('/css/acute.select.css',function(req,res){res.sendFile(__dirname+'/css/acute.select.css');});
app.get('/angular/acute.select.js',function(req,res){res.sendFile(__dirname+'/views/angular/acute.select.js');});
app.get('/acute.select/acute.select.htm',function(req,res){res.sendFile(__dirname+'/views/acute.select.htm');});
app.get('/css/images/dropdown.gif',function(req,res){res.sendFile(__dirname+'/views/images/dropdown.gif');});


