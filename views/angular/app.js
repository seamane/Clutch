var app = angular.module('clutchApp', ['ngCookies']);

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
	//alert($scope.username + " " + $scope.lname);
	$scope.createUser = function() 
	{
		alert("create user");
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

app.controller('taskController', function($scope, $http, $cookieStore){
	$scope.show = false;
	$scope.showDropDown = false;
	// $scope.projectid = $cookieStore.get('projectInfo').id;
	alert('taskController');

	// $scope.getAnnAndSeq = function(){
	// 	$http.post('/getAnnouncements',{
	// 	'projectid': $scope.projectid
	// 	}).
	// 	success(function(data){
	// 		alert(JSON.stringify(data));
	// 		$scope.announcements = data;
	// 	});

	// 	$http.post('/getSequences',{
	// 		'projectid': $scope.projectid
	// 	}).
	// 	success(function(data){
	// 		alert(JSON.stringify(data));
	// 		$scope.getSequences = data;
	// 	});
	// }

	// $scope.getAnnAndSeq();
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

//app.controller('createUserController', function($scope, $http, $cookieStore){

//});

app.controller('taskController', function($scope, $http, $cookieStore){
	$scope.show = false;
})

app.controller('navbarController', function($scope, $http, $cookieStore){

	  $scope.createProjectButton = function() {
	    alert("HI");
	    $http.post("/createProject",{
		    'name': $scope.titleC,
		    'userid': $cookieStore.get('userInfo').id,
		    'passkey': $scope.passcodeC
		}).
	    success(function(data){
	    	alert(JSON.stringify(data));
	    	// if(JSON.stringify(data) === '[]'){
	    		
	    	// }
	    	// else{

	    	// }
	    }).
	    error(function(){
	    	// alert("error");
	    });
	}
	  $scope.addProjectButton = function() {
	    $http.post("/addProject",{
		    'name': $scope.titleA,
		    'userid': $cookieStore.get('userInfo').id,
		    'passkey': $scope.passcodeA
		}).
	    success(function(data){
	    	alert(JSON.stringify(data));
	    }).
	    error(function(){
	    	// alert("error");
	    });
	}
});

app.controller('indexController', function($scope, $http,$cookieStore){
  	$scope.message = '*Invalid username and/or password';
  	$scope.failLogin = false;

  	$scope.loginButton = function() {
//<<<<<<< HEAD
	    alert($scope.username + " " + $scope.password);
//=======
	    console.log('login button');
//>>>>>>> origin/master

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
			$scope.userProjects = data;
		});
	}

	$scope.getProjects();

	$scope.createProject = function(){

	}

	$scope.buttonClicked = function(project){
		alert(JSON.stringify(project));
		$cookieStore.put('projectInfo',project);
		window.location.href = '/project';
	}
});
