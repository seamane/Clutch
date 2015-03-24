(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('forgotPasswordController', function($scope, $http,$cookieStore){
	  	$scope.changePasswordCodeEmailed = false;
	  	$scope.canChangePassword = false;
	  	$scope.canEnterCode = false;

	  	$scope.emailUser = function(){
	  		$http.post('/getUserEmail',{
	  			'username':$scope.username
	  		}).
	  		success(function(email){
	  			var code1 = $scope.generateCode();
	  			var code2 = $scope.generateCode();
	  			var code3 = $scope.generateCode();
	  			var code4 = $scope.generateCode();

	  			$http.post('/addCode',{
	  				'username':$scope.username,
	  				'code1':code1,
	  				'code2':code2,
	  				'code3':code3,
	  				'code4':code4
	  			}).
	  			success(function(data){
	  				console.log(JSON.stringify(email));
		  			$http.post('/sendEmail',{
			  			'to': email[0].email,
			  			'subject': 'Clutch Change Password Verification',
			  			'text': 'Your verification code is:\n\n\t' + code1 + '-' + code2 + '-' + code3 + '-' + code4 + 
			  				'\n\nThis code is needed to change the password to your Clutch account.'
			  		}).
			  		success(function(){
			  			$scope.changePasswordCodeEmailed = true;
			  			$scope.canEnterCode = true;
			  		}).
			  		error(function(){
			  			alert("We apologize. There seems to have been an error in emailing you your confirmation code.");
			  		});
	  			}).
	  			error(function(){
			  		alert("We apologize. There seems to have been an error in creating your confirmation code.");
	  			});
	  		}).
	  		error(function(){
	  			alert("Username confirmation error");
	  		});
	  	}

	  	$scope.generateCode = function(){
	  		var text = "";
	  		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

			for( var i=0; i < 4; i++ ){
			    text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
	  	}

	  	$scope.verifyCode = function(){
	  		$http.post('/verifyCode',{
	  			'username':$scope.username,
	  			'code1': $scope.code1,
	  			'code2': $scope.code2,
	  			'code3': $scope.code3,
	  			'code4': $scope.code4
	  		}).
	  		success(function(data){
	  			if(data.length > 0){
	  				$scope.canEnterCode = false;
	  				$scope.canChangePassword = true;
	  			}
	  		}).
	  		error(function(){
	  			alert("We apologize. There was an error verifying your code.");
	  		});
	  	}

	  	$scope.changePassword = function(){
	  		if($scope.password == undefined || $scope.confirmPassword == undefined || $scope.password != $scope.confirmPassword){
	  			alert("Unable to change password. Check that the text fields meet the requirements and match.");
	  		}
	  		else{
	  			$http.post('/updateUserPassword',{
	  				'username':$scope.username,
	  				'password':$scope.password
	  			}).
	  			success(function(data){
	  				window.location.href = '/';
	  			}).
	  			error(function(){
	  				alert("We apologize. There was an error changing your password.");
	  			});
	  		}
	  	}
	});
}());