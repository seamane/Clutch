var app = angular.module('clutchApp', ['ngCookies','autocomplete']);


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
		    //alert("userNames:"+JSON.stringify(userNames));

		    $timeout(function(){
		      // moviedata.resolve(movies);
		      moviedata.resolve(members);
		    },1000);
		});
	    return moviedata.promise
	}
	return AssignMember;
});

app.controller('createUserController', function($scope, $http, $cookieStore)
{
	$scope.createUser = function() 
	{
		if($scope.password == $scope.passwordconfirm)
		{
			if($scope.username==undefined || $scope.fname==undefined 		//this all just makes sure all the fields have values
			|| $scope.lname==undefined || $scope.password==undefined 		//
			|| $scope.email==undefined || $scope.passwordconfirm==undefined
			|| $scope.phoneNum==undefined)
			{
				alert("One or more fields are blank. Please check to make sure that all of the provided fields are correctly filled out.");
			}
			else
			{
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

app.controller('taskController', function($filter, $scope, $http, $cookieStore, AssignMember){
	if($cookieStore.get('userInfo') == undefined){
		window.location.href = '/';
	}

	$scope.dropdownSeq = undefined;
	$scope.showDropDown = false;
    $scope.projectName = $cookieStore.get('projectInfo').name;
	var orderBy = $filter('orderBy');
	$scope.shots = [];
	$scope.projectid = $cookieStore.get('projectInfo').id;
	$scope.addVisible = false;
	$scope.deleteVisible = false;
	$scope.attempted = false;
	$scope.title = null;

	// Shot stuff
	$scope.shotVisible = false;
	$scope.shotAttempted = false;

	$scope.shotDelete = false;
	// $scope.shotTitle = null;
	// $scope.shotDesc = null;

	// $scope.announcementsLimit = 5;
	$scope.postAnnTextBox = false;
	$scope.announcements = [];
	$scope.animator = 'animator';
	$scope.lighter = 'lighter';
	$scope.fx = 'fx';
	$scope.wrangler = 'wrangler';

	$scope.popup = false;
	$scope.recipient = "";

	$scope.assignMembers = AssignMember.getmembers("...");
  	$scope.assignMembers.then(function(data){
    	$scope.assignMembers = data;
    });

    $scope.updateSuggestions = function(typedthings){
	    console.log("Do something like reload data with this: " + typedthings );
	    $scope.newAssignMembers = AssignMember.getmembers(typedthings);
	    $scope.newAssignMembers.then(function(data){
	      	$scope.assignMembers = data;
	    });
	}

	$scope.doSomethingElse = function(suggestion){
	    console.log("Suggestion selected: " + suggestion);
	}

	$scope.addSequence  = function(){
		if($scope.title === null){
			$scope.attempted = true;
		}
		else{
			$scope.attempted = false;
			$http.post('createSequence',{
				'name': $scope.title,
				'projectid' : $scope.projectid
			}).
			success(function(data){
				$scope.title = null;
			});
			$http.post('/getSequences',{
				'projectid': $scope.projectid
			}).
			success(function(data){
				$scope.sequences = orderBy(data,'name',false);
			});
		}
	}

	$scope.deleteSequence = function(){
		if(confirm("Are you sure you want to delete sequence "+$scope.sequenceName+"?")){
			$http.post('/deleteSequence',{
				'name': $scope.sequenceName
			}).
			success(function(data){
				$http.post('/getSequences',{
					'projectid': $scope.projectid
				}).
				success(function(data){
					$scope.sequences = orderBy(data,'name',false);
				})
			});
		}
	}

	$scope.addAsset  = function(){
		if($scope.assetTitle === null){
			$scope.attempted = true;
		}
		else{
			//alert("createAsset");
			$scope.attempted = false;
			$http.post('createAsset',{
				'name': $scope.assetTitle,
				'projectid' : $scope.projectid
			}).
			success(function(data){
				$scope.assetTitle = null;
			});
			$http.post('/getAssets',{
				'projectid': $scope.projectid
			}).
			success(function(data){
				$scope.assets = orderBy(data,'name',false);
			});
		}
	}

	$scope.deleteAsset = function(){
		if(confirm("Are you sure you want to delete asset "+$scope.assetName+"?")){
			$http.post('/deleteAsset',{
				'name':$scope.assetName
			}).
			success(function(data){
				$http.post('/getAssets',{
					'projectid':$scope.projectid
				}).
				success(function(data){
					$scope.assets = orderBy(data,'name',false);
				});
			});
		}
	}

	$scope.showForm = function(form){
		switch(form){
			case 1:
				$scope.addVisible = !$scope.addVisible;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 2:
				$scope.deleteVisible = !$scope.deleteVisible;
		}
		
	}
	$scope.getProjectName = function(){
		return $cookieStore.get('projectInfo').name;
	}

	$scope.getInfo = function(){
		$http.post('/getAnnouncements',{
			'projectid': $scope.projectid
		}).
		success(function(data){
			$scope.announcements = orderBy(data,'time',true);
			if($scope.announcements.length < 5){
				$scope.announcementsLimit = $scope.announcements.length;
			}
			else{
				$scope.announcementsLimit = 5;
			}
		});

		$http.post('/getSequences',{
			'projectid': $scope.projectid
		}).
		success(function(data){
			$scope.sequences = orderBy(data,'name',false);
			// $scope.makeBools();
		});

		$http.post('/getShots',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.shots = orderBy(data,'name',false);
		});

		$http.post('/getAssets',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.assets = orderBy(data,'name',false);
		});

		$http.post('/getPrevis',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.previs = data;
		});

		$http.post('/getAnimators',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.animators = data;
		});

		$http.post('/getLighters',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.lighters = data;
		});

		$http.post('/getWranglers',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.wranglers = data;
		});

		$http.post('/getFX',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.fx = data;
		});

		$http.post('/getCompositing',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.compositing = data;
		});

		$http.post('/getRigging',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.rigging = data;
		});

		$http.post('/getModeling',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.modeling = data;
		});

		$http.post('/getShading',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.shading = data;
		});

		$http.post('/getUsers',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.members = data;
			// alert(JSON.stringify($scope.members));
		});
	}

	$scope.postAnnouncement = function(){
		$http.post('/postAnnouncement',{
			'authorid':$cookieStore.get('userInfo').id,
			'projectid':$scope.projectid,
			'message':$scope.message
		}).
		success(function(data){
			// alert('postAnnouncement success');
			$scope.announcements = orderBy(data,'time',true);
			$scope.recipient = $scope.getMemberEmails();
			// alert(JSON.stringify($scope.recipient));
  			$scope.emailSubject = "New Announcement From Clutch";
  			$scope.emailBody = $scope.message;
			$scope.sendMessage();
			$scope.message = "";
		});
	}

	$scope.getMemberEmails = function(){
		// alert("getMemberEmails");
		var emailAddresses = [];
		for(var i = 0; i < $scope.members.length; ++i)
		{
			emailAddresses = emailAddresses.concat([$scope.members[i].email]);
			// alert("i:"+i+" "+JSON.stringify(emailAddresses));
		}

		return emailAddresses;
	}

	$scope.seeMore = function(){
		$scope.announcementsLimit += 5;
		if($scope.announcementsLimit > $scope.announcements.length){
			$scope.announcementsLimit = $scope.announcements.length;
		}
	}

	$scope.seeLess = function(){
		$scope.announcementsLimit -= 5;
		if($scope.announcementsLimit < 5){
			$scope.announcementsLimit = 5;
		}
	}

	$scope.getInfo();

	$scope.toggleSeq = function(seq){
		for(var i=0; i < $scope.sequences.length; i++){
			if($scope.sequences[i].name == seq.name)
			{
				$scope.sequences[i].bool = !$scope.sequences[i].bool;
				return $scope.sequences[i].bool;
			}
		}
	}

	$scope.toggleAsset = function(ass){
		for(var i=0; i < $scope.assets.length; i++){
			if($scope.assets[i].name == ass.name)
			{
				$scope.assets[i].bool = !$scope.assets[i].bool;
				return $scope.assets[i].bool;
			}
		}
	}

	$scope.showSeq = function(seq){
		for(var i=0; i < $scope.sequences.length; i++){
			if($scope.sequences[i].name == seq.name)
			{
				return $scope.sequences[i].bool;
			}
		}
		return false;
	}

	$scope.showAssets = function(ass){
		for(var i=0; i < $scope.assets.length; i++){
			if($scope.assets[i].name == ass.name)
			{
				return $scope.assets[i].bool;
			}
		}
		return false;
	}

	$scope.getShots = function(seq){
			$scope.seqShots = [];
			for(var i = 0; i < $scope.shots.length; ++i){
				if($scope.shots[i].sequenceid == seq.id){
					$scope.seqShots = $scope.seqShots.concat([
						$scope.shots[i]
					]);
				}
			}
			return $scope.seqShots;
	}

	$scope.getPrevis = function(shotid){
		var label = '+ Assign';
		if($scope.previs != undefined){
			for(var i = 0; i < $scope.previs.length; ++i){
				if($scope.previs[i].shotid == shotid){
					label = $scope.previs[i].fname + ' ' + $scope.previs[i].lname[0] + '.';
					break;
				}
			}
		}
		return label;
	}

	$scope.getAnimator = function(shotid){
		var label = '+ Assign';
		if($scope.animators != undefined){
			for(var i = 0; i < $scope.animators.length; ++i){
				if($scope.animators[i].shotid == shotid){
					label = $scope.animators[i].fname + ' ' + $scope.animators[i].lname[0] + '.';
					break;
				}
			}
		}
		return label;
	}

	$scope.getLighter = function(shotid){
		var label = '+ Assign';
		if($scope.lighters != undefined){
			for(var i = 0; i < $scope.lighters.length; ++i){
				if($scope.lighters[i].shotid == shotid){
					label = $scope.lighters[i].fname + ' ' + $scope.lighters[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getFX = function(shotid){
		var label = '+ Assign';
		if($scope.fx != undefined){
			for(var i = 0; i < $scope.fx.length; ++i){
				if($scope.fx[i].shotid == shotid){
					label = $scope.fx[i].fname + ' ' + $scope.fx[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getCompositing = function(shotid){
		var label = '+ Assign';
		if($scope.compositing != undefined){
			for(var i = 0; i < $scope.compositing.length; ++i){
				if($scope.compositing[i].shotid == shotid){
					label = $scope.compositing[i].fname + ' ' + $scope.compositing[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getWrangler = function(shotid){
		var label = '+ Assign';
		if($scope.wranglers != undefined){
			for(var i = 0; i < $scope.wranglers.length; ++i){
				if($scope.wranglers[i].shotid == shotid){
					label = $scope.wranglers[i].fname + ' ' + $scope.wranglers[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getRigging = function(assid){
		var label = '+ Assign';
		if($scope.rigging != undefined){
			for(var i = 0; i < $scope.rigging.length; ++i){
				if($scope.rigging[i].assid == assid){
					label = $scope.rigging[i].fname + ' ' + $scope.rigging[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getModeling = function(assid){
		var label = '+ Assign';
		if($scope.modeling != undefined){
			for(var i = 0; i < $scope.modeling.length; ++i){
				if($scope.modeling[i].assid == assid){
					label = $scope.modeling[i].fname + ' ' + $scope.modeling[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getShading = function(assid){
		var label = '+ Assign';
		if($scope.shading != undefined){
			for(var i = 0; i < $scope.shading.length; ++i){
				if($scope.shading[i].assid == assid){
					label = $scope.shading[i].fname + ' ' + $scope.shading[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getNotes = function(shot,type){
		//alert("type:"+type);
		$http.post('/getNotes',{
			'shotid':shot.id,
			'type':type
		}).
		success(function(data){
			$scope.notes = orderBy(data,'time',true);
		});
	}

	$scope.getPopUpInfo = function(shot,type){

	}

	$scope.showShotForm = function(){
		$scope.shotVisible = !$scope.shotVisible;
		$scope.shotAttempted = false;
		// $scope.shotTitle = undefined;
		// $scope.shotDesc = undefined;
	}

	$scope.showShotDeleteForm = function(){
		$scope.shotDelete = !$scope.shotDelete;
	}

	$scope.addShot = function(seq,desc,title){
		if(title == undefined || desc == undefined){
			$scope.shotAttempted = true;
		}
		else{
			$scope.shotAttempted = false;
			$http.post("/createShot",{
				'name':title,
				'desc':desc,
				'sequenceid':seq.id
			}).
			success(function(data){
				$scope.shotTitle = undefined;
				$scope.shotDesc = undefined;
				$http.post('/getShots',{
					'projectid':$scope.projectid
				}).
				success(function(data){
					$scope.shots = orderBy(data,'name',false);
				});
			});
		}
	}

	$scope.deleteShot = function(seq,shotName){
		if(confirm("Are you sure you want to delete shot "+shotName+"?")){
			console.log("ABOUT TO SEND REQUEST");
			$http.post("/deleteShot",{
				'shotName':shotName
			}).
			success(function(){
				$scope.shotName = undefined;
				console.log("SUCCESS");
				$http.post('/getShots',{
					'projectid':$scope.projectid
				}).
				success(function(data){
					$scope.shots = orderBy(data,'name',false);
				});
			});
		}
	}

	$scope.enablePopup = function(recipientEmail){
		if(!$scope.popup){
			$("#shadow").fadeIn(0500);
			$("#shadowBox").fadeIn(0500);
			$scope.popup = true;
		}
		$scope.recipient = recipientEmail;
	}

	$scope.disablePopup = function(){
		if($scope.popup){
			$("#shadow").fadeOut(0500);
			$("#shadowBox").fadeOut(0500);
			$scope.popup = false;
		}
	}

	$scope.sendMessage = function(){
		if($scope.recipient == undefined || $scope.recipient == ""){
			alert("This user does not have a registered email");
			return;
		}
		if($scope.emailBody == undefined){
			alert("You must enter a message");
			return;
		}
		$http.post('/sendEmail',
  		{
  			'to': $scope.recipient,
  			'subject': $scope.emailSubject,
  			'text': $scope.emailBody  
  		}).
  		success(function(data){
  			//alert("Your message was successfully sent");
  			$scope.emailSubject = null;
  			$scope.emailBody = null;
  		}).
  		error(function(){
  			alert("An error occurred and your message was not successfully delivered.");
  		});
  		$scope.disablePopup();
	}
})
.directive('showinfo', function($compile) {
    return {
	    restrict: 'AE',
	    templateUrl: 'shotInfo.html',
		compile: function() {
			$(document).foundation();
		}
    }
});

app.directive('loadnavbar', function($compile) {
    return {
	    restrict: 'AE',
	    templateUrl: 'navbar.html',
		compile: function() {
			$(document).foundation();
		}
    }
});

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
});

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
	    		$cookieStore.put('userInfo',data[0]);
	    		$scope.failLogin = false;
	    		window.location.href = '/home';
	    	}
	    }).
	    error(function(){
	    	
	    });
   	}

   	$scope.signUp =function() 
   	{
   		//alert("IN");
   		window.location.href = '/createUser';
   	}

    $scope.keypress = function(event){
    	if(event.which == 13){
    		$scope.loginButton();
    	}
    }
});

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

	$scope.createProject = function(){

	}

	$scope.buttonClicked = function(project){
		//alert(JSON.stringify(project));
		$cookieStore.put('projectInfo',project);
		window.location.href = '/project';
	}
});