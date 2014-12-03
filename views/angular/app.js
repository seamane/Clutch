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
	$scope.show = false;
})

.directive('showinfo', function($compile) {
    return {
    restrict: 'AE',
       templateUrl: 'shotInfo.html',
	compile: function() {
	  $(document).foundation();
	}
    }
})

.directive('loadnavbar', function($compile) {
    return {
    restrict: 'AE',
       templateUrl: 'navbar.html',
	compile: function() {
	  $(document).foundation();
	}
    }
});
app.controller('indexController', function($scope, $http,$cookieStore){
  	$scope.message = '*Invalid username and/or password';
  	$scope.failLogin = false;

  	$scope.loginButton = function() {
	    //alert($scope.username + " " + $scope.password);

	    $http.post("/validateUser",{
		    'username': $scope.username,
		    'password': $scope.password
		}).
	    success(function(data){
	    	if(JSON.stringify(data) === '[]'){
	    		// alert('empty');
	    		$scope.failLogin = true;
	    	}
	    	else{
	    		window.location.href = '/home';
	    		$cookieStore.put('userInfo',data[0]);
	    		$scope.failLogin = false;
	    		//myService.set(data);
	    		// $scope.userid = data[0].id;
	    	}
	    }).
	    error(function(){
	    	// alert("error");
	    });
   	}
});

app.controller('homeController',function($scope,$http,$cookieStore){
	// [{'name':'project1'},{'name':'project2'}];

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
	// $scope.userProjects = $scope.getProjects();

	$scope.createProject = function(){

	}

	$scope.buttonClicked = function(project){
		console.log(JSON.stringify(project));
		// $http.post('/projectButton',{
		// 	'projectid': project.id
		// }).
		// success(function(data){
		// 	$cookieStore.push('projectInfo':project);
		// 	window.location.href = '/home';
		// });
	}
});