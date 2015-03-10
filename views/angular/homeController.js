(function(){
	'use strict';

	var app = angular.module('clutchApp');
	app.controller('homeController',function($scope,$http,$cookieStore){
		if($cookieStore.get('userInfo') == undefined){
			window.location.href = '/';
		}

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

		$scope.buttonClicked = function(project){
			$cookieStore.put('projectInfo',project);
			window.location.href = '/project';
		}
	});
}());