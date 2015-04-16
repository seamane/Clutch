(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('editProfileController',function($scope,$http,$cookieStore){

		$scope.currentUserInfo;

		$scope.updateUser = function(){
			alert("updateUser()");
		};

		$scope.showForm = function(form){
			switch(form){
				case 1:
					$scope.emailFieldVisible = !$scope.emailFieldVisible;
					$scope.attempted = false;
					$scope.newEmail = null;
					break;
				case 2:
					$scope.passwordFieldVisible = !$scope.passwordFieldVisible;
					$scope.attempted = false;
					$scope.newPassword = null;
					break;
				case 3:
					$scope.phoneNumberFieldVisible = !$scope.phoneNumberFieldVisible;
					$scope.attempted = false;
					$scope.newPhoneNumber = null;
					break;
			}
			
		};

		$scope.getFName = function(){
			return $cookieStore.get('userInfo').fname;
		}

		$scope.getLName = function(){
			return $cookieStore.get('userInfo').lname;
		}

		$scope.getUsername = function(){
			return $cookieStore.get('userInfo').username;
		}

		$scope.getEmail = function(){
			return $cookieStore.get('userInfo').email;
		}

		$scope.getPhone = function(){
			return $cookieStore.get('userInfo').phone;
		}

		$scope.setEmail = function(){
			if($scope.newEmail === undefined)
				alert("An invalid email address was entered. Address could not be changed.")
			else
			{
				$http.post("/setEmail",
				{
					'userid': $cookieStore.get('userInfo').id,
					'email': $scope.newEmail
				}).
				success(function(data){
					$scope.newInfo = $cookieStore.get('userInfo');
					$scope.newInfo.email = $scope.newEmail;
					$cookieStore.put('userInfo', $scope.newInfo);
					location.reload(true);
			    }).
			    error(function(){
			    	alert("error w/ setemail");
			    });
			}
		};

		$scope.setPhone = function(){
			if($scope.newPhone === undefined)
				alert("An invalid phone number was entered. Phone number could not be changed.")
			else
			{
				$http.post("/setPhone",
				{
					'userid': $cookieStore.get('userInfo').id,
					'phone': $scope.newPhone
				}).
				success(function(data){
					$scope.newInfo = $cookieStore.get('userInfo');
					$scope.newInfo.phone = $scope.newPhone;
					$cookieStore.put('userInfo', $scope.newInfo);
					location.reload(true);
			    }).
			    error(function(){
			    	alert("error w/ setphone");
			    });
			}
		};

		$scope.setPassword = function(){
			if($scope.new_password === undefined)
				alert("An invalid password was entered. Password could not be changed.")
			else if($scope.new_password!=$scope.passwordconfirm)
				alert("The password fields do not match. Password could not be changed.")
			else
			{
				$http.post("/setPassword",
				{
					'userid': $cookieStore.get('userInfo').id,
					'password': $scope.new_password
				}).
				success(function(data){
					location.reload(true);
					alert("Your password has been successfully changed!")
			    }).
			    error(function(){
			    	alert("error w/ setpassword");
			    });
			}
		};

		$scope.updatePhoneNumber = function(){}
	});
}());