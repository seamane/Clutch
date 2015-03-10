(function(){
	'use strict';
	var app = angular.module('clutchApp',['ngCookies','autocomplete']);

	app.directive('loadnavbar', function($compile) {
	    return {
		    restrict: 'AE',
		    templateUrl: 'navbar.html',
			compile: function() {
				$(document).foundation();
			}
	    }
	});
	
	app.factory('AssignMember', function($http, $q, $timeout, $cookieStore){
	  	var AssignMember = new Object();

		AssignMember.getmembers = function(i) {
		    var moviedata = $q.defer();
		    var members;
		    var userJSON = [];
			$http.post('/getUsers',{
				'projectid':$cookieStore.get('projectInfo').id
			}).
			success(function(data){
				userJSON = userJSON.concat(data);
			    var userNames = [];

			    for(var i = 0; i < userJSON.length; ++i)
			    {
			    	var name = userJSON[i].fname + " " + userJSON[i].lname;
			    	userNames = userNames.concat([name]);
			    }
			    members = userNames;

			    $timeout(function(){
			      // moviedata.resolve(movies);
			      moviedata.resolve(members);
			    },1000);
			});
		    return moviedata.promise
		}
		return AssignMember;
	});
})();