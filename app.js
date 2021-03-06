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
app.set('port',process.env.PORT || 8000);
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
app.get('/js/less/dist/less.min.js',function(req,res){res.sendFile(__dirname + '/js/less/dist/less.min.js');})
app.get('/css/app.css',function(req,res){res.sendFile(__dirname + '/css/app.css');});
app.get('/js/vendor/modernizr.js',function(req,res){res.sendFile(__dirname + '/js/vendor/modernizr.js');});
app.get('/js/vendor/jquery.js',function(req,res){res.sendFile(__dirname + '/js/vendor/jquery.js');});
app.get('/js/foundation.min.js',function(req,res){res.sendFile(__dirname + '/js/foundation.min.js');});
app.get('/angular/angular.min.js.map',function(req,res){res.sendFile(__dirname+'/views/angular/angular.min.js.map');})
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js');});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js');});
app.get('/angular/forgotPasswordController.js',function(req,res){res.sendFile(__dirname+'/views/angular/forgotPasswordController.js');});
app.get('/angular/editProfileController.js',function(req,res){res.sendFile(__dirname+'/views/angular/editProfileController.js');});
app.get('/angular/indexController.js',function(req,res){res.sendFile(__dirname+'/views/angular/indexController.js');});
app.get('/angular/homeController.js',function(req,res){res.sendFile(__dirname+'/views/angular/homeController.js');});
app.get('/angular/navbarController.js',function(req,res){res.sendFile(__dirname+'/views/angular/navbarController.js');});
app.get('/angular/createUserController.js',function(req,res){res.sendFile(__dirname+'/views/angular/createUserController.js');});
app.get('/angular/taskController.js',function(req,res){res.sendFile(__dirname+'/views/angular/taskController.js');});
app.get('/navbar.html',function(req,res){res.sendFile(__dirname+'/views/navbar.html');});
app.get('/editProfile.html',function(req,res){res.sendFile(__dirname+'/views/editProfile.html');});
app.get('/forgotPassword',function(req,res){res.sendFile(__dirname+'/views/forgotPassword.html');});
app.get('/chicken.jpg',function(req,res){res.sendFile(__dirname+'/views/images/chicken.jpg');});
app.get('/chickens.png',function(req,res){res.sendFile(__dirname+'/views/images/chickens.png');});
app.get('/favicon.ico',function(req,res){res.sendFile(__dirname+'/views/images/favicon.ico');});
app.get('/byuAnimationLogo.jpg',function(req,res){res.sendFile(__dirname+'/views/images/byuAnimationLogo.jpg');});
app.get('/baby.jpg',function(req,res){res.sendFile(__dirname+'/views/images/baby.jpg');});

app.post('/validateUser',database.validateUser);
app.post('/createUser',database.createUser);
app.post('/validateUser', database.validateUser);
app.post('/setEmail', database.setEmail);
app.post('/setPassword', database.setPassword);
app.post('/setPhone', database.setPhone);
app.post('/validateProject', database.validateProject);
app.post('/createProject', database.createProject);
app.post('/addProject', database.addProject);
app.post('/getShots',database.getShots);
app.post('/getAnimators',database.getAnimators);
app.post('/createSequence', database.createSequence);
app.post('/deleteSequence', database.deleteSequence);
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
app.post('/getConcept',database.getConcept);
app.post('/getShading',database.getShading);
app.post('/getNotes',database.getNotes);
app.post('/postAnnouncement',database.postAnnouncement);
app.post('/sendEmail',email.sendEmail);
app.post('/getAssets',database.getAssets);
app.post('/createShot',database.createShot);
app.post('/deleteShot',database.deleteShot);
app.post('/setFrames',database.setFrames);
app.post('/setShotDescription',database.setShotDescription);
app.post('/setStatus',database.setStatus);
app.post('/createAsset',database.createAsset);
app.post('/deleteAsset',database.deleteAsset);
app.post('/createNote',database.createNote);
app.post('/deleteNote',database.deleteNote);
app.post('/getUsers',database.getUsers);
app.post('/addPrevis',database.addPrevis);
app.post('/addAnimator',database.addAnimator);
app.post('/addLighter',database.addLighter);
app.post('/addModeler',database.addModeler);
app.post('/addConcept',database.addConcept);
app.post('/addFX',database.addFX);
app.post('/addCompositing',database.addCompositing);
app.post('/addWrangler',database.addWrangler);
app.post('/addRigger',database.addRigger);
app.post('/addShader',database.addShader);
app.post('/getUsersByShot',database.getUsersByShot);
app.post('/getUsersByAsset',database.getUsersByAsset);
app.post('/verifyCode',database.verifyCode);
app.post('/addCode',database.addCode);
app.post('/getUserEmail',database.getUserEmail);
app.post('/updateUserPassword',database.updateUserPassword);

app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});
app.get('/loginpage',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.get('/angular/app.js',function(req,res){res.sendFile(__dirname+'/views/angular/app.js');});
app.get('/angular/angular.js',function(req,res){res.sendFile(__dirname+'/views/angular/angular.js');});
app.get('/home',function(req,res){res.sendFile(__dirname + '/views/project.html');});
app.get('/loginpage',function(req,res){res.sendFile(__dirname + '/views/index.html');});
app.get('/project',function(req,res){res.sendFile(__dirname + '/views/tasks.html');});
app.get('/shotInfo.html',function(req,res){res.sendFile(__dirname + '/views/shotInfo.html');});
app.get('/createUser',function(req,res){res.sendFile(__dirname+'/views/createUser.html');});
app.get('/trash.png',function(req,res){res.sendFile(__dirname+'/views/images/trash.png');});
app.get('/editProfile',function(req,res){res.sendFile(__dirname+'/views/editProfile.html');});

//testing stuff
app.get('/test',function(req,res){res.sendFile(__dirname+'/views/test.html');});
app.get('/angular/AcuteTest.js',function(req,res){res.sendFile(__dirname+'/views/angular/AcuteTest.js');});
app.get('/css/acute.select.css',function(req,res){res.sendFile(__dirname+'/css/acute.select.css');});
app.get('/angular/acute.select.js',function(req,res){res.sendFile(__dirname+'/views/angular/acute.select.js');});
app.get('/acute.select/acute.select.htm',function(req,res){res.sendFile(__dirname+'/views/acute.select.htm');});
app.get('/css/images/dropdown.gif',function(req,res){res.sendFile(__dirname+'/views/images/dropdown.gif');});
app.get('/angular/autocomplete.js',function(req,res){res.sendFile(__dirname+'/views/angular/autocomplete.js');});
app.get('/css/autocomplete.css',function(req,res){res.sendFile(__dirname+'/css/autocomplete.css');});


