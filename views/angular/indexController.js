(function(){
	'use strict';

	var app = angular.module('clutchApp');
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
		    		$scope.username = '';
		    		$scope.password = '';
		    	}
		    	else{
		    		// alert("cookie:"+JSON.stringify(data[0]));
		    		$cookieStore.put('userInfo',data[0]);
		    		$scope.failLogin = false;
		    		window.location.href = '/home';
		    	}
		    }).
		    error(function(){
		    	
		    });
	   	}

	   	$scope.signUp =function(){
	   		window.location.href = '/createUser';
	   	}

	    $scope.keypress = function(event){
	    	if(event.which == 13){
	    		$scope.loginButton();
	    	}
	    }
	});
}());