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

app.controller('indexController', function($scope, $http,$cookieStore){//, myService) {
  	$scope.message = '*Invalid username and/or password';

  	$scope.loginButton = function() {
	    alert($scope.username + " " + $scope.password);
	    
	    $http.post("/validateUser",{
		    'username': $scope.username,
		    'password': $scope.password
		}).
	    success(function(data){
	    	if(JSON.stringify(data) === '[]'){
	    		alert('empty');
	    	}
	    	else{
	    		window.location.href = '/home';
	    		$cookieStore.put('userInfo',data[0]);
	    		//myService.set(data);
	    		// $scope.userid = data[0].id;
	    	}
	    }).
	    error(function(){
	    	alert("error");
	    });
   	}
});

app.controller('homeController',function($scope, $http,$cookieStore){//, myService){
	$scope.getName = function(){
		return $cookieStore.get('userInfo').fname;
	}

	$scope.getProjects = function(){
		$http.post('/getProjects',{
			
		}).
		success(function(data){

		});
	}
});