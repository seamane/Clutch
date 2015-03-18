(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('forgotPasswordController', function($scope, $http,$cookieStore){
	  	$scope.changePasswordCodeEmailed = false;
	  	$scope.canChangePassword = false;

	  	$scope.emailUser = function(){
	  		$http.get('/getUserEmail',{
	  			'username':$scope.username
	  		}).
	  		success(function(email){
	  			var code1 = generateCode();
	  			var code2 = generateCode();
	  			var code3 = generateCode();
	  			var code4 = generateCode();

	  			$http.post('/addCode',{
	  				'username':$scope.username,
	  				'code1':code1,
	  				'code2':code2,
	  				'code3':code3,
	  				'code4':code4
	  			}).
	  			success(function(data){
		  			$http.post('/sendEmail',{
			  			'to': email[0],
			  			'subject': 'Clutch Change Password Verification',
			  			'text': 'Your verification code is:\n\n\t' + code1 + '-' + code2 + '-' + code3 + '-' + code4 + 
			  				'\n\nThis code is needed to change the password to your Clutch account.'
			  		}).
			  		success(function(){
			  			$scope.changePasswordCodeEmailed = true;
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
	});
}());