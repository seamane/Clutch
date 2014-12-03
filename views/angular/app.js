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

app.controller('createUserController', function($scope, $http, $cookieStore){

});

app.controller('taskController', function($scope, $http, $cookieStore){
	$scope.showDropDown = false;
	$scope.projectid = $cookieStore.get('projectInfo').id

	$http.post('/getAnnouncements',{
		'projectid': $scope.projectid
	}).
	success(function(data){
		alert(JSON.stringify(data));
		$scope.announcements = data;
	});

	$http.post('/getSequences',{
		'projectid': $scope.projectid
	}).
	success(function(data){
		alert(JSON.stringify(data));
		$scope.getSequences = data;
	});
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

app.controller('createUserController', function($scope, $http, $cookieStore){

});

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
	    console.log('login button');

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
		// alert(JSON.stringify(project));
		$cookieStore.put('projectInfo',project);
		window.location.href = '/project';
	}
});
