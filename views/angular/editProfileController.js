(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('editProfileController',function($scope,$http,$cookieStore){
		$scope.updateUser = function(){
			console.log("updateUser()");
		}
	});
}());