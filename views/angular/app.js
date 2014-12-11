var app = angular.module('clutchApp', ['ngCookies']);
//var randomstring = require("randomstring");

// app.service('myService', function() {
// 	alert('myService');
// 	var userData = [];
// 	this.set = function(data) {
// 		alert('myService set(data):'+JSON.stringify(data));
// 		userData = data;
// 		alert('myService userData[0]:'+JSON.stringify(userData[0].username));
// 	}
// 	this.get = function() {
// 	 	return userData;
// 	}

// 	this.getUsername = function(){
// 		alert('getUsername:'+JSON.stringify(userData));
// 		return userData[0].username;
// 	}
// });

app.controller('createUserController', function($scope, $http, $cookieStore)
{
	$scope.createUser = function() 
	{
		if($scope.password == $scope.passwordconfirm)
		{
			if($scope.username==undefined || $scope.fname==undefined 		//this all just makes sure all the fields have values
			|| $scope.lname==undefined || $scope.password==undefined 		//
			|| $scope.email==undefined || $scope.passwordconfirm==undefined)//
			{
				alert("Please fill in all the fields");
			}
			else
			{
				$http.post("/validateUser",{		//send a validate user request first to make sure that user isn't already there
			   	 'username': $scope.username,
			   	 'password': $scope.password
				}).
			    success(function(data){
			    	if(JSON.stringify(data) === '[]'){		//if that user doesn't exist, make a new user
			    		$http.post("/create",				
						{
							'username': $scope.username,
							'password': $scope.password,
							'fname': $scope.fname,
							'lname': $scope.lname,
							'email': $scope.email,
							'passwordconfirm': $scope.passwordconfirm
						}).
						success(function(data){
							if(JSON.stringify(data) === '[]')
							{
							    // alert('empty');
							    $scope.failLogin = true;
							}
					    	else
					    	{
					    		window.location.href = '/loginpage';
					    	}
					    }).
					    error(function(){
					    	// alert("error");
					    });
			    	}
			    	else{
			    		alert("that user already exists")
			    	}
			    }).
			    error(function(){
			    	 alert("error");
			    });
			}
		}
		else
		{
			alert("Make sure your password is the same in both fields and that you fill out all the fields");
		}
   	}
});

app.controller('taskController', function($filter, $scope, $http, $cookieStore){
	if($cookieStore.get('userInfo') == undefined){
		window.location.href = '/';
	}

	$scope.showDropDown = false;
    $scope.projectName = $cookieStore.get('projectInfo').name;
	var orderBy = $filter('orderBy');
	$scope.shots = [];
	$scope.projectid = $cookieStore.get('projectInfo').id;
	$scope.visible = false;
	$scope.attempted = false;
	$scope.title = null;
	$scope.announcementsLimit = 5;
	$scope.postAnnTextBox = false;

	$scope.addSequence  = function(){
		if($scope.title === null){
			$scope.attempted = true;
		}
		else{
			$scope.attempted = false;
			$http.post('createSequence',{
				'name': $scope.title,
				'projectid' : $scope.projectid
			}).
			success(function(data){
				$scope.title = null;
			});
		}

	}

	$scope.showForm = function(){
		$scope.visible = !$scope.visible;
		$scope.attempted = false;
		$scope.title = null;
	}
	$scope.getProjectName = function(){
		return $cookieStore.get('projectInfo').name;
	}

	$scope.getInfo = function(){
		$http.post('/getAnnouncements',{
			'projectid': $scope.projectid
		}).
		success(function(data){
			$scope.announcements = orderBy(data,'time',true);
		});

		$http.post('/getSequences',{
			'projectid': $scope.projectid
		}).
		success(function(data){
			$scope.sequences = orderBy(data,'name',false);
			// $scope.makeBools();
		});

		$http.post('/getShots',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.shots = orderBy(data,'name',false);
		});

		$http.post('/getAnimators',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.animators = data;
		});

		$http.post('/getLighters',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.lighters = data;
		});

		$http.post('/getWranglers',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.wranglers = data;
		});

		$http.post('/getFX',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.fx = data;
		});
	}

	$scope.postAnnouncement = function(){
		$http.post('/postAnnouncement',{
			'authorid':$cookieStore.get('userInfo').id,
			'projectid':$scope.projectid,
			'message':$scope.message
		}).
		success(function(data){
			$scope.announcements = orderBy(data,'time',true);
		});
	}

	$scope.seeMore = function(){
		$scope.announcementsLimit += 5;
		if($scope.announcementsLimit > $scope.announcements.length){
			$scope.announcementsLimit = $scope.announcements.length;
		}
	}

	$scope.seeLess = function(){
		$scope.announcementsLimit -= 5;
		if($scope.announcementsLimit < 5){
			$scope.announcementsLimit = 5;
		}
	}

	// $scope.makeBools = function(){
	// 	$scope.clicks = [];
		
	// 	for(var i=0; i < $scope.sequences.length; i++){
	// 		$scope.clicks=$scope.clicks.concat([{
	// 			'name':$scope.sequences[i].name,
	// 			'bool':false
	// 		}]);
	// 	}
	// }

	$scope.getInfo();

	$scope.toggleBool = function(seq){
		// alert(JSON.stringify($scope.sequences));
		for(var i=0; i < $scope.sequences.length; i++){
			if($scope.sequences[i].name == seq.name)
			{
				$scope.sequences[i].bool = !$scope.sequences[i].bool;
				return $scope.sequences[i].bool;
			}
		}
	}

	$scope.show = function(seq){
		for(var i=0; i < $scope.sequences.length; i++){
			if($scope.sequences[i].name == seq.name)
			{
				return $scope.sequences[i].bool;
			}
		}
		return false;
	}

	$scope.getShots = function(seq){
		if($scope.show(seq)){
			$scope.seqShots = [];
			for(var i = 0; i < $scope.shots.length; ++i){
				if($scope.shots[i].sequenceid == seq.id){
					$scope.seqShots = $scope.seqShots.concat([
						$scope.shots[i]
					]);
				}
			}
			return $scope.seqShots;
		}
	}

	$scope.getAnimator = function(shotid){
		var label = '+ Assign';
		for(var i = 0; i < $scope.animators.length; ++i){
			if($scope.animators[i].shotid == shotid){
				label = $scope.animators[i].fname + ' ' + $scope.animators[i].lname;
				break;
			}
		}
		return label;
	}

	$scope.getLighter = function(shotid){
		var label = '+ Assign';
		for(var i = 0; i < $scope.lighters.length; ++i){
			if($scope.lighters[i].shotid == shotid){
				label = $scope.lighters[i].fname + ' ' + $scope.lighters[i].lname;
				break;
			}
		}
		return label;
	}

	$scope.getFX = function(shotid){
		var label = '+ Assign';
		for(var i = 0; i < $scope.fx.length; ++i){
			if($scope.fx[i].shotid == shotid){
				label = $scope.fx[i].fname + ' ' + $scope.fx[i].lname;
				break;
			}
		}
		return label;
	}

	$scope.getWrangler = function(shotid){
		var label = '+ Assign';
		for(var i = 0; i < $scope.wranglers.length; ++i){
			if($scope.wranglers[i].shotid == shotid){
				label = $scope.wranglers[i].fname + ' ' + $scope.wranglers[i].lname;
				break;
			}
		}
		return label;
	}

	$scope.getNotes = function(shot,type){
		$http.post('/getNotes',{
			'shotid':shot.id,
			'type':type
		}).
		success(function(data){
			$scope.notes = data;
		});
	}
})
.directive('showinfo', function($compile) {
    return {
	    restrict: 'AE',
	    templateUrl: 'shotInfo.html',
		compile: function() {
			$(document).foundation();
		}
    }
});

app.directive('loadnavbar', function($compile) {
    return {
	    restrict: 'AE',
	    templateUrl: 'navbar.html',
		compile: function() {
			$(document).foundation();
		}
    }
});

app.controller('navbarController', function($scope, $http, $cookieStore){
	$scope.attempted = false;
	$scope.success = false;
	$scope.fail = false;
	$scope.attemptAdd = false;
	$scope.addProjectFail = false;
	$scope.addProjectSuccess = false;

	$scope.getUsername = function(){
		return $cookieStore.get('userInfo').username;
	}

	$scope.createProject = function(valid) {
		if(valid){
			$http.post("/validateProject",{	
			   	 'name': $scope.titleC
			}).
			success(function(data){
				// if project title is unique
			    	if(JSON.stringify(data) === '[]'){
				    	$http.post("/createProject",{
					    'name': $scope.titleC,
					    'userid': $cookieStore.get('userInfo').id,
					    'passkey': $scope.passcodeC
						}).
				    	success(function(data){
				    		$scope.attempted = false;
				    		if(data.affectedRows == 0){
				    			$scope.fail = true;
							$scope.success = false;
				    		}
				    		else{
								$scope.fail = false;
								$scope.success = true;
				    		}
				    	}).
				    	error(function(){
				    		alert("error");
				    	});
				}
				// project title taken
				else {
					$scope.fail = true;
					$scope.success = false;
				}
			}).
			error(function(){
				alert("error");
			});
		}
		else {
			$scope.attempted = true;
		}
	}
	$scope.addProjectButton = function(valid) {
		if(valid){
		    	$http.post("/addProject",{
			    'name': $scope.titleA,
			    'userid': $cookieStore.get('userInfo').id,
			    'passkey': $scope.passcodeA
			}).
		    	success(function(data){
		    		$scope.attemptAdd = false;
		    		//check if project was found
		    		if(data.affectedRows == 0){
		    			$scope.addProjectFail = true;
					$scope.addProjectSuccess = false;
		    		}
		    		else{
					$scope.addProjectFail = false;
					$scope.addProjectSuccess = true;
		    		}
		    	}).
		    	error(function(){
		    		// alert("error");
		   	});
		}
		else{
			$scope.attemptAdd = true;
		}
	}

	$scope.reset = function(){
		$scope.attempted = false;
		$scope.fail = false;
		$scope.success = false;
		$scope.attemptAdd = false;
		$scope.addProjectFail = false;
		$scope.addProjectSuccess = false;
		$scope.titleC = null; $scope.titleA = null; $scope.passcodeA = null; $scope.passcodeC = null;
	}

    $scope.logout = function() {
    	$cookieStore.remove('userInfo');
    	$cookieStore.remove('projectInfo');
    	window.location.href = '/loginpage';
    	alert(JSON.stringify($cookieStore));
    }
});

app.controller('indexController', function($scope, $http,$cookieStore){
  	$scope.message = '*Invalid username/password';
  	$scope.failLogin = false;

  	$scope.loginButton = function() {
	    $http.post("/validateUser",{
		    'username': $scope.username,
		    'password': $scope.password
		}).
	    success(function(data){
	    	if(JSON.stringify(data) === '[]'){
	    		$scope.failLogin = true;
	    	}
	    	else{
	    		$cookieStore.put('userInfo',data[0]);
	    		$scope.failLogin = false;
	    		window.location.href = '/home';
	    	}
	    }).
	    error(function(){
	    	
	    });
   	}

   	$scope.signUp =function() 
   	{
   		//alert("IN");
   		window.location.href = '/createUser';
   	}
});

app.controller('homeController',function($scope,$http,$cookieStore){
	if($cookieStore.get('userInfo') == undefined){
		window.location.href = '/';
	}

	$scope.getName = function(){
		return $cookieStore.get('userInfo').fname;
	}

	$scope.getUsername = function(){
		return $cookieStore.get('userInfo').username;
	}

	$scope.getProjects = function(){
		$http.post('/getProjects',{
			'userid': $cookieStore.get('userInfo').id
		}).
		success(function(data){
			//alert(JSON.stringify(data));
			$scope.userProjects = data;
		});
	}

	$scope.getProjects();

	$scope.createProject = function(){

	}

	$scope.buttonClicked = function(project){
		//alert(JSON.stringify(project));
		$cookieStore.put('projectInfo',project);
		window.location.href = '/project';
	}
});
