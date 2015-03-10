(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('createUserController', function($scope, $http, $cookieStore){
		$scope.createUser = function(){
			if($scope.password == $scope.passwordconfirm)
			{
				if($scope.username==undefined || $scope.fname==undefined 		//this all just makes sure all the fields have values
				|| $scope.lname==undefined || $scope.password==undefined 		//
				|| $scope.email==undefined || $scope.passwordconfirm==undefined
				|| $scope.phoneNum==undefined){
					alert("One or more fields are blank. Please check to make sure that all of the provided fields are correctly filled out.");
				}
				else{
					$http.post("/validateUser",{		//send a validate user request first to make sure that user isn't already there
				   	 'username': $scope.username,
				   	 'password': $scope.password
					}).
				    success(function(data){
				    	if(JSON.stringify(data) === '[]'){		//if that username doesn't exist, make a new user
				    		$http.post('/sendEmail',
					  		{
					  			'to': $scope.email,
					  			'subject': 'Welcome to the Clutch!',
					  			'text': 'Welcome ' + $scope.fname + '!\n\nWe are happy for you to be a part '
					  			+ 'of BYU\'s film production.\n\nSincerely,\n\nThe Clutch'  
					  		}).
					  		success(function(data){
					  			if(data == "sent"){
					  				$http.post("/createUser",				
									{
										'username': $scope.username,
										'password': $scope.password,
										'fname': $scope.fname,
										'lname': $scope.lname,
										'email': $scope.email,
										'passwordconfirm': $scope.passwordconfirm,
										'phone':$scope.phoneNum
									}).
									success(function(data){
						    			window.location.href = '/loginpage';
								    }).
								    error(function(){
								    	alert("error");
								    });
					  			}
					  			else{
					  				alert('Your confirmation email failed to send.');
					  			}
					  		}).
					  		error(function(){
					  			alert("Email confirmation error");
					  		});	
				    	}
				    	else{
				    		alert("That username already exists. Please choose a different one.")
				    	}
				    }).
				    error(function(){
				    	 alert("error");
				    });
				}
			}
	   	}
	});
}());