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

		    $timeout(function(){
		      // moviedata.resolve(movies);
		      moviedata.resolve(members);
		    },1000);
		});
	    return moviedata.promise
	}
	return AssignMember;
});

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

app.controller('taskController', function($filter, $scope, $http, $cookieStore, AssignMember){
	if($cookieStore.get('userInfo') == undefined){
		window.location.href = '/';
	}

	$scope.dropdownSeq = undefined;
	$scope.showDropDown = false;
    $scope.projectName = $cookieStore.get('projectInfo').name;
	var orderBy = $filter('orderBy');
	$scope.shots = [];
	$scope.sequences = [];
	$scope.projectid = $cookieStore.get('projectInfo').id;
	$scope.addVisible = false;
	$scope.deleteVisible = false;
	$scope.attempted = false;
	$scope.title = null;

	// Shot stuff
	$scope.shotVisible = false;
	$scope.shotAttempted = false;
	$scope.shotTitle = null;
	$scope.shotDesc = null;
	$scope.currentShot = null;
	$scope.shotDelete = false;

	$scope.announcementsLimit = 5;
	$scope.postAnnTextBox = false;
	$scope.announcements = [];
	$scope.animator = 'animator';
	$scope.lighter = 'lighter';
	$scope.fx = 'fx';
	$scope.wrangler = 'wrangler';

	$scope.popup = false;
	$scope.recipient = "";
	$scope.popupMember = undefined;
	$scope.edit = false;

	$scope.assignMembers = AssignMember.getmembers("...");
  	$scope.assignMembers.then(function(data){
    	$scope.assignMembers = data;
    });

    $scope.popupEnum = {
    	MESSAGE: 0,
    	ASSIGN: 1,
    	NOTES: 2
    }

    // Popup stuff
    $scope.currentShotId = undefined;
    $scope.currentAssetId = undefined;
    $scope.department = undefined;

    $scope.updateSuggestions = function(typedthings){
	    // console.log("Do something like reload data with this: " + typedthings );
	    $scope.newAssignMembers = AssignMember.getmembers(typedthings);
	    $scope.newAssignMembers.then(function(data){
	      	$scope.assignMembers = data;
	    });
	}

	// $scope.doSomethingElse = function(suggestion){
	//     console.log("Suggestion selected: " + suggestion);
	// }

	$scope.assignMember = function(assignedMember){
		if(assignedMember == undefined){
			return;
		}
		var fname = assignedMember.split(" ")[0];
		var lname = assignedMember.split(" ")[1];
		switch($scope.department){
		 	case "previs":
		 		$http.post('/addPrevis',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getPrevis',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.previs = data;
		 				$scope.setPopupMember($scope.getPrevis($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "animator":
		 		$http.post('/addAnimator',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getAnimators',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.animators = data;
		 				$scope.setPopupMember($scope.getAnimator($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "compositing":
		 		$http.post('/addCompositing',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getCompositing',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.compositing = data;
		 				$scope.setPopupMember($scope.getCompositing($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "fx":
		 		$http.post('/addFX',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getFX',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.fx = data;
		 				$scope.setPopupMember($scope.getFX($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "wrangler":
		 		$http.post('/addWrangler',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getWranglers',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.wranglers = data;
		 				$scope.setPopupMember($scope.getWrangler($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "lighter":
		 		$http.post('/addLighter',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getLighters',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.lighters = data;
		 				$scope.setPopupMember($scope.getLighter($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "modeler":
		 		$http.post('/addModeler',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getModeling',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.modeling = data;
		 				$scope.setPopupMember($scope.getModeling($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "shader":
		 		$http.post('/addShader',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getShading',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.shading = data;
		 				$scope.setPopupMember($scope.getShading($scope.currentShotId));
					});
		 		});
		 		break;
		 	case "rigger":
		 		$http.post('/addRigger',{
		 			"fname":fname,
		 			"lname":lname,
		 			"id":$scope.currentShotId
		 		}).
		 		success(function(data){
		 			$http.post('/getRigging',{
		 				'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.rigging = data;
		 				$scope.setPopupMember($scope.getRigging($scope.currentShotId));
					});
		 		});
		 		break;
		 	default:
		 		console.log("ERROR: assignMember function. Should never get here.");
		 		break;
		}
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
				$http.post('/getSequences',{
					'projectid': $scope.projectid
				}).
				success(function(data){
					$scope.sequences = orderBy(data,'name',false);
				});
				$scope.title = null;
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
				});
			});
		}
	}

	$scope.addAsset  = function(type,assetTitle){
		if(assetTitle == undefined || assetTitle == ''){
			$scope.attempted = true;
		}
		else{
			$scope.attempted = false;
			$http.post('/createAsset',{
				'name': assetTitle,
				'projectid' : $scope.projectid,
				'type' : type
			}).
			success(function(data){
				$http.post('/getAssets',{
					'projectid':$scope.projectid
				}).
				success(function(data){
					$scope.charAssets = orderBy(data[0],'name',false);
					$scope.charPropAssets = orderBy(data[1],'name',false);
					$scope.envAssets = orderBy(data[2],'name',false);
					$scope.envPropAssets = orderBy(data[3],'name',false);
				});
			});
		}
	}

	$scope.deleteAsset = function(ass){
		if(confirm("Are you sure you want to delete asset "+ass+"?")){
			$http.post('/deleteAsset',{
				'name':ass
			}).
			success(function(data){
				$http.post('/getAssets',{
					'projectid':$scope.projectid
				}).
				success(function(data){
					$scope.charAssets = orderBy(data[0],'name',false);
					$scope.charPropAssets = orderBy(data[1],'name',false);
					$scope.envAssets = orderBy(data[2],'name',false);
					$scope.envPropAssets = orderBy(data[3],'name',false);
				});
			});
		}
	}

	$scope.addNote = function(){
		if ($scope.noteField != "" && $scope.noteField != undefined){
			// console.log($scope.currentShotId);
			$http.post('createNote',{
				'note': $scope.noteField,
				'shotid' : $scope.currentShotId,
				'type' : $scope.department,
				'userid' : $cookieStore.get("userInfo").id
			}).
			success(function(data){
				//TODO Send email
				$scope.emailBody = $scope.noteField;
				$scope.emailSubject = "CLUTCH | "; //TODO make a better subject line and who the email is from
				$scope.sendMessage();
				//console.log($scope.noteField+"\r"+"-"+cookieStore.get('userInfo').fname+" "+$cookieStore.get('userInfo').lname);
		  		//TODO append new note rather than query db again
				$http.post('/getNotes',{
				'shotid':$scope.currentShotId,
				'type':$scope.department
				}).
				success(function(data){
					$scope.notes = orderBy(data,'time',true);
				});
				$scope.noteField = undefined;
				//$scope.disablePopup();
			});
		}
	}

	$scope.deleteNote = function(noteId){
		//console.log(noteId);
		if(noteId != undefined){
			$http.post('/deleteNote',{
				'id': noteId
			}).
			success(function(data){
				$http.post('/getNotes',{
					'shotid':$scope.currentShotId,
					'type':$scope.department
				}).
				success(function(data){
					$scope.notes = orderBy(data,'time',true);
				});
			});
		}
	}

	$scope.showForm = function(form){
		switch(form){
			case 1:
				$scope.addVisibleChar = !$scope.addVisibleChar;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 2:
				$scope.deleteVisibleChar = !$scope.deleteVisibleChar;
				break;
			case 3:
				$scope.addVisibleCharProp = !$scope.addVisibleCharProp;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 4:
				$scope.deleteVisibleCharProp = !$scope.deleteVisibleCharProp;
				break;
			case 5:
				$scope.addVisibleEnv = !$scope.addVisibleEnv;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 6:
				$scope.deleteVisibleEnv = !$scope.deleteVisibleEnv;
				break;
			case 7:
				$scope.addVisibleEnvProp = !$scope.addVisibleEnvProp;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 8:
				$scope.deleteVisibleEnvProp = !$scope.deleteVisibleEnvProp;
				break;
			case 9://add Sequence Button
				$scope.addVisible = !$scope.addVisible;
				$scope.attempted = false;
				$scope.title = null;
				$scope.assetTitle = null;
				break;
			case 10://delete Sequence Button
				$scope.deleteVisible = !$scope.deleteVisible;
				break;
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
			// console.log("getSequences:"+JSON.stringify(data));
			$scope.sequences = orderBy(data,'name',false);
		});

		$http.post('/getShots',{
			'projectid':$scope.projectid
		}).
		success(function(data){
			$scope.shots = orderBy(data,'name',false);
		});

		$http.post('/getAssets',{
			'projectid':$scope.projectid,
		}).
		success(function(data){
			$scope.charAssets = orderBy(data[0],'name',false);
			$scope.charPropAssets = orderBy(data[1],'name',false);
			$scope.envAssets = orderBy(data[2],'name',false);
			$scope.envPropAssets = orderBy(data[3],'name',false);
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
		});
	}

	$scope.postAnnouncement = function(){
		$http.post('/postAnnouncement',{
			'authorid':$cookieStore.get('userInfo').id,
			'projectid':$scope.projectid,
			'message':$scope.message
		}).
		success(function(data){
			$scope.announcements = orderBy(data,'time',true);	
			$scope.seeMore();
			$scope.recipient = $scope.getMemberEmails();
  			$scope.emailSubject = "New Announcement From Clutch";
  			$scope.emailBody = $scope.message;
			$scope.sendMessage();
			$scope.message = "";
		});
	}

	$scope.getMemberEmails = function(){
		var emailAddresses = [];
		for(var i = 0; i < $scope.members.length; ++i){
			emailAddresses = emailAddresses.concat([$scope.members[i].email]);
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

	$scope.toggleSeq = function(index){
		$scope.sequences[index].bool = !$scope.sequences[index].bool;
	}

	$scope.toggleAsset = function(index,type){
		switch(type){
			case 0://CHAR
				$scope.charAssets[index].bool = !$scope.charAssets[index].bool;
				break;
			case 1://CHAR_PROP
				$scope.charPropAssets[index].bool = !$scope.charPropAssets[index].bool;
				break;
			case 2://ENV
				$scope.envAssets[index].bool = !$scope.envAssets[index].bool;
				break;
			case 3://ENV_PROP
				$scope.envPropAssets[index].bool = !$scope.envPropAssets[index].bool;
				break;
		}
	}

	$scope.showSeq = function(index){
		if($scope.sequences != undefined && index != undefined){
			return $scope.sequences[index].bool;
		}
		return false;
	}

	$scope.showAssets = function(type,index){
		if(index == undefined || $scope.charAssets == undefined
			|| $scope.charPropAssets == undefined || $scope.envAssets == undefined
			|| $scope.envPropAssets == undefined){
			return false;
		}
		switch(type){
			case 0:
				return $scope.charAssets[index].bool;
				break;
			case 1:
				return $scope.charPropAssets[index].bool;
				break;
			case 2:
				return $scope.envAssets[index].bool;
				break;
			case 3:
				return $scope.envPropAssets[index].bool;
				break;
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
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.previs != undefined){
			for(var i = 0; i < $scope.previs.length; ++i){
				if($scope.previs[i].shotid == shotid){
					label = $scope.previs[i];//.fname + ' ' + $scope.previs[i].lname[0] + '.';
					break;
				}
			}
		}
		return label;
	}

	$scope.getAnimator = function(shotid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.animators != undefined){
			for(var i = 0; i < $scope.animators.length; ++i){
				if($scope.animators[i].shotid == shotid){
					label = $scope.animators[i];//.fname + ' ' + $scope.animators[i].lname[0] + '.';
					break;
				}
			}
		}
		return label;
	}

	$scope.getLighter = function(shotid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.lighters != undefined){
			for(var i = 0; i < $scope.lighters.length; ++i){
				if($scope.lighters[i].shotid == shotid){
					label = $scope.lighters[i];//.fname + ' ' + $scope.lighters[i].lname;
					break;
				}
			}
		}
		// alert("shotid:"+shotid+"\n"+JSON.stringify(label));
		return label;
	}

	$scope.getFX = function(shotid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.fx != undefined){
			for(var i = 0; i < $scope.fx.length; ++i){
				if($scope.fx[i].shotid == shotid){
					label = $scope.fx[i];//.fname + ' ' + $scope.fx[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getCompositing = function(shotid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.compositing != undefined){
			for(var i = 0; i < $scope.compositing.length; ++i){
				if($scope.compositing[i].shotid == shotid){
					label = $scope.compositing[i];//.fname + ' ' + $scope.compositing[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getWrangler = function(shotid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.wranglers != undefined){
			for(var i = 0; i < $scope.wranglers.length; ++i){
				if($scope.wranglers[i].shotid == shotid){
					label = $scope.wranglers[i];//.fname + ' ' + $scope.wranglers[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getRigging = function(assid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.rigging != undefined){
			for(var i = 0; i < $scope.rigging.length; ++i){
				if($scope.rigging[i].assetid == assid){
					label = $scope.rigging[i];//.fname + ' ' + $scope.rigging[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getModeling = function(assid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.modeling != undefined){
			for(var i = 0; i < $scope.modeling.length; ++i){
				if($scope.modeling[i].assetid == assid){
					label = $scope.modeling[i];//.fname + ' ' + $scope.modeling[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getShading = function(assid){
		var label = {"fname":"+ Assign","lname":" ","email":""};
		if($scope.shading != undefined){
			for(var i = 0; i < $scope.shading.length; ++i){
				if($scope.shading[i].assetid == assid){
					label = $scope.shading[i];//.fname + ' ' + $scope.shading[i].lname;
					break;
				}
			}
		}
		return label;
	}

	$scope.getNotes = function(shot,type){
		$scope.notes = [];
		$http.post('/getNotes',{
			'shotid':shot.id,
			'type':type
		}).
		success(function(data){
			$scope.notes = orderBy(data,'time',true);
			if($scope.notes.length < 4){
				$scope.notesLimit = $scope.notes.length;
			}
			else
				$scope.notesLimit = 4;
		});
	}

	$scope.getPopUpInfo = function(shot,type){

	}

	$scope.showShotForm = function(){
		$scope.shotVisible = !$scope.shotVisible;
		$scope.shotAttempted = false;
	}

	$scope.showShotDeleteForm = function(){
		$scope.shotDelete = !$scope.shotDelete;
	}

	$scope.addShot = function(seq,desc,title){
		// console.log(JSON.stringify(seq));
		if(title == undefined || desc == undefined){
			$scope.shotAttempted = true;
		}
		else{
			$scope.shotAttempted = false;
			$http.post("/createShot",{
				'name':title,
				'desc':desc,
				'sequenceid':seq.id,
				'frames':0
			}).
			success(function(data){
				$scope.shotTitle = undefined;
				$scope.shotDesc = undefined;
				$scope.shots = orderBy($scope.shots.concat([{
				'name':title,
				'desc':desc,
				'sequenceid':seq.id,
				'frames':0}]),
				'name',false);
			});
		}
	}

	$scope.deleteShot = function(seq,shotName){
		if(shotName != undefined){
			if(confirm("Are you sure you want to delete shot "+shotName+"?")){
				$http.post("/deleteShot",{
					'shotName':shotName
				}).
				success(function(){
					$scope.shotName = undefined;
					$http.post('/getShots',{
						'projectid':$scope.projectid
					}).
					success(function(data){
						$scope.shots = orderBy(data,'name',false);
					});
				});
			}
		}
	}

	$scope.getShotById = function(shotId)
	{
		for(var i=0; i < $scope.shots.length; ++i){
			if($scope.shots[i].id == shotId){
				$scope.currentShot=$scope.shots[i];
			}
		}
	}

	$scope.setFrameCt = function(frames)
	{
		if(frames === null || frames === undefined){
			$scope.framesAttempted = true;
			return frames;
		}
		else{
			$scope.framesAttempted = false
			$http.post("/setFrames",{
				'frames':frames,
				'shotid':$scope.currentShot.id
			}).
			success(function(data){
				$scope.currentShot.frames = frames;
			});
			return null;
		}
	}

	$scope.setNewStatus = function(status)
	{
		$http.post("/setStatus",{
			'status':status,
			'shotid':$scope.currentShot.id
		}).
		success(function(data){
			$scope.currentShot.status = status;
		});
	}

	$scope.enablePopup = function(recipientEmail, popupType, currentShot, department){
		// console.log("HERE");
		$scope.currentShotId = currentShot;
		$scope.department = department;
		if(!$scope.popup){
			$("#shadow").fadeIn(0500);
			switch(popupType){
				case 0: 
					$("#emailBox").fadeIn(0500);
					break;
				case 1:
					$("#noteBox").fadeIn(0500);
					break;
				case 2:
					$("#genericNoteBox").fadeIn(0500);
					break;
				default:
			}
			$scope.popup = true;
		}
		$scope.recipient = recipientEmail;
		// console.log($scope.recipient);
	}

	$scope.disablePopup = function(){
		if($scope.popup){
			$("#shadow").fadeOut(0500);
			$("#shadowBox").fadeOut(0500);
			$("#noteBox").fadeOut(0500);
			$("#genericNoteBox").fadeOut(0500);
			$scope.popup = false;
			$scope.popupMember = undefined;
		}
	}

	$scope.setPopupMember = function(member){
		// console.log("setPopupMember: "+JSON.stringify(member));
		$scope.popupMember = member;
	}

	$scope.showAutoComplete = function(){
		// console.log("showAutoComlete: "+JSON.stringify($scope.popupMember));
		if($scope.popupMember == undefined){
			return true;
		}
		return $scope.popupMember.fname == "+ Assign" || $scope.edit;
	}

	$scope.setEdit = function(bool){
		$scope.edit = bool
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
  			'text': $scope.emailBody+"\r"+"-"+$cookieStore.get("userInfo").fname+" "+$cookieStore.get("userInfo").lname
  		}).
  		success(function(data){
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
	    		// alert("cookie:"+JSON.stringify(data[0]));
	    		$cookieStore.put('userInfo',data[0]);
	    		$scope.failLogin = false;
	    		window.location.href = '/home';
	    	}
	    }).
	    error(function(){
	    	
	    });
   	}

   	$scope.signUp =function(){
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

	$scope.buttonClicked = function(project){
		$cookieStore.put('projectInfo',project);
		window.location.href = '/project';
	}
});
