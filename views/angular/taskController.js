(function(){
	// 'use strict';

	var app = angular.module('clutchApp');
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
	    	NOTES: 2,
	    	ASSETNOTES: 3
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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
							$scope.recipient = $scope.popupMember.email;
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

		$scope.insertQuotesAndApostrophes = function(oldString){
			var withQuotes = oldString.replace(/[?][%][*][&]/g,"\'");
			var withApostrophes = withQuotes.replace(/[{][*][#][@]/g,"\"");
			return withApostrophes;
		}

		$scope.replaceQuotesAndApostrophes = function(oldString){
			var noQuotes = oldString.replace(/'/g,"?%*&");
			var noApostrophes = noQuotes.replace(/"/g,"{*#@");
			return noApostrophes;
		}

		$scope.normalizeNotes = function(){
			for(var i = 0; i < $scope.notes.length; ++i){
				$scope.notes[i].note = $scope.insertQuotesAndApostrophes($scope.notes[i].note);
			}
		}

		$scope.normalizeAnnouncements = function(){
			for(var i = 0; i < $scope.announcements.length; ++i){
				$scope.announcements[i].message = $scope.insertQuotesAndApostrophes($scope.announcements[i].message);
			}
		}

		$scope.addNote = function(){
			if ($scope.noteField != "" && $scope.noteField != undefined){
				var noteToSend = $scope.replaceQuotesAndApostrophes($scope.noteField);
				$http.post('createNote',{
					'note': noteToSend,
					'shotid' : $scope.currentShotId,
					'type' : $scope.department,
					'userid' : $cookieStore.get("userInfo").id
				}).
				success(function(data){
					//TODO Send email
					$scope.emailBody = $scope.noteField;
					$scope.emailSubject = "CLUTCH | "; //TODO make a better subject line and who the email is from
					$scope.sendMessage();
			  		//TODO append new note rather than query db again
					$http.post('/getNotes',{
					'shotid':$scope.currentShotId,
					'type':$scope.department
					}).
					success(function(data){
						$scope.notes = orderBy(data,'time',true);
						$scope.normalizeNotes();
					});
					$scope.noteField = undefined;
				});
			}
		}

		$scope.deleteNote = function(noteId){
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
						$scope.normalizeNotes();
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
				$scope.normalizeAnnouncements();
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
			var messageToSend = $scope.replaceQuotesAndApostrophes($scope.message);
			$http.post('/postAnnouncement',{
				'authorid':$cookieStore.get('userInfo').id,
				'projectid':$scope.projectid,
				'message':messageToSend
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
				$scope.normalizeNotes();
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
			$scope.currentShotId = currentShot.id;

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
						console.log(currentShot);
						//get all email addresses
						$http.post('/getUsersByShot',
						{
							'shotId':currentShot.id
						}).
						success(function(data){
							$scope.recipient = [];
							for(var i = 0; i < data.length; i++){
								$scope.recipient.push(data[i].email);
							}
						});
						break;
					case 3:
						$("#genericNoteBox").fadeIn(0500);
						console.log(currentShot);
						//get all email addresses
						$http.post('/getUsersByAsset',
						{
							'assId':currentShot.id
						}).
						success(function(data){
							$scope.recipient = [];
							for(var i = 0; i < data.length; i++){
								$scope.recipient.push(data[i].email);
							}
						});
						break;
					default:
				}
				$scope.popup = true;
			}
			$scope.recipient = recipientEmail;
		}

		$scope.disablePopup = function(){
			if($scope.popup){
				$(".popup").fadeOut(0500);
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
}());