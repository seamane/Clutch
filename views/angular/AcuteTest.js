// var app = angular.module("AcuteTest",['acute.select'])
// .controller("MainController", function($scope,$http) {
//     // Create an object for our model data (it's always wise have a "." in your model)
//     $scope.data = {
//         selectedShape: 'Circle'
//     };
//     $scope.shapes = ['Square', 'Circle', 'Triangle', 'Pentagon', 'Hexagon'];
	






// 	$scope.getAllStates = function (callback) {
// 	    callback($scope.allStates);
// 	};


// 	$scope.get = function(s){
// 		callback(s.fname);
// 	}

// 	$scope.getName = function(member){
// 		return member.fname + " " + member.lname;
// 	}


// 	$scope.stateSelected = function (state) {
// 		if(state != null){
// 	    	$scope.stateInfo = state.fname + " " + state.lname;
// 	    }
// 	    else
// 	    {
// 	    	$scope.stateInfo = "";
// 	    }
// 	}

// 	$scope.selectedMember = {"name":'',"id":""};

//     $http.post('/getUsers',{
// 		'projectid':1
// 	}).
// 	success(function(data){
// 		$scope.allStates = data;
// 		alert(JSON.stringify(data));
// 	});

// 	// Return all states when dropdown first opens
// 	$scope.getStates = function (callback) {
// 	    callback($scope.allStates);
// 	};


// 	$scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", 
// 	"brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", 
// 	"gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];








// })
// .directive('autoComplete', function($timeout) {
//     return function(scope, iElement, iAttrs) {
//             iElement.autocomplete({
//                 source: scope[iAttrs.uiItems],
//                 select: function() {
//                     $timeout(function() {
//                       iElement.trigger('input');
//                     }, 0);
//                 }
//             });
//     };
// });


// angular.module('MyModule', []).directive('autoComplete', function($timeout) {
//     return function(scope, iElement, iAttrs) {
//             iElement.autocomplete({
//                 source: scope[iAttrs.uiItems],
//                 select: function() {
//                     $timeout(function() {
//                       iElement.trigger('input');
//                     }, 0);
//                 }
//             });
//     };
// });


// function DefaultCtrl($scope) {
//     $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];
// }

var app = angular.module('app', ['autocomplete']);

// the service that retrieves some movie title from an url
app.factory('MovieRetriever', function($http, $q, $timeout){
  var MovieRetriever = new Object();

  MovieRetriever.getmovies = function(i) {
  	// alert(JSON.stringify(i));
    var moviedata = $q.defer();
    // var movies;
    var members;

    // var someMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

    // var moreMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

    var userJSON = [{'fname':'Eric','lname':'Seaman'},{'fname':'Erica','lname':'Leonardo'},{'fname':'Paul','lname':'Soderquist'},{'fname':'Mike','lname':'Framp'},{'fname':'Eric','lname':'Rommer'},{'fname':'Can','lname':'Can'}];
    
    var userNames = [];
    for(var i = 0; i < userJSON.length; ++i)
    {
    	var name = userJSON[i].fname + " " + userJSON[i].lname;
    	userNames = userNames.concat([name]);
    }

    members = userNames;
    // if(i && i.indexOf('T')!=-1)
    //   movies=moreMovies;
    // else
    //   movies=moreMovies;


    $timeout(function(){
      // moviedata.resolve(movies);
      moviedata.resolve(members);
    },1000);

    return moviedata.promise
  }

  return MovieRetriever;
});

app.controller('MyCtrl', function($scope, MovieRetriever){

  $scope.movies = MovieRetriever.getmovies("...");
  $scope.movies.then(function(data){
    $scope.movies = data;
  });

  $scope.getmovies = function(){
    return $scope.movies;
  }

  $scope.doSomething = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
    $scope.newmovies = MovieRetriever.getmovies(typedthings);
    $scope.newmovies.then(function(data){
  	// alert("data:"+JSON.stringify(data));
      $scope.movies = data;
    });
  }

  $scope.doSomethingElse = function(suggestion){
    console.log("Suggestion selected: " + suggestion);
  }

});