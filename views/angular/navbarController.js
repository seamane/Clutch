(function(){
	'use strict';

	var app = angular.module('clutchApp');
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
								window.location.href='/home';
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
						window.location.href='/home';
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
			$scope.titleC = null; 
			$scope.titleA = null; 
			$scope.passcodeA = null; 
			$scope.passcodeC = null;
		}

	    $scope.logout = function() {
	    	$cookieStore.remove('userInfo');
	    	$cookieStore.remove('projectInfo');
	    	window.location.href = '/';
	    }

	    $scope.editProfile = function(){
	    	window.location.href = '/editProfile';
	    }
	});
}());