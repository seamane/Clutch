var mysql = require('mysql');
var randomstring = require("randomstring");
var sha1 = require('sha1');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'default',
	multipleStatements: true
});

exports.initDatabase = function(req,res)
{
	connection.query('CREATE DATABASE IF NOT EXISTS clutch', function(err){
		if(err){
			console.log("ERROR: " + err.message);
			throw err;
		}
		connection.query('USE clutch', function(err){
			if(err){
				console.log("ERROR: " + err.message);
				throw err;
			}
			createTables();
		});
	});
}

createTables = function()
{
	connection.query(
		'CREATE TABLE IF NOT EXISTS projects('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'name VARCHAR(50),'
		+ 'authorid INT,'
		+ 'passkey VARCHAR(50)'
		+ ');',function(err){
		if(err){
			console.log('query1 error: ' + err);
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS users('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'fname VARCHAR(50),'
		+ 'lname VARCHAR(50),'
		+ 'username VARCHAR(50),'
		+ 'phone VARCHAR(15),'
		+ 'salt VARCHAR(50),'
		+ 'hashe VARCHAR(50),'
		+ 'email VARCHAR(50)'
		+ ');',function(err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS shots('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'frames INT,'
		+ 'description VARCHAR(500),'
		+ 'name VARCHAR(20),'
		+ 'status VARCHAR(20),'
		+ 'sequenceid INT'//,'
		//+ 'projectid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS announcements('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'authorid INT,'
		+ 'projectid INT,'
		+ 'message VARCHAR(500),'
		+ 'time DATETIME'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS sequences('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'name VARCHAR(20),'
		+ 'projectid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS assets('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'name VARCHAR(20),'
		+ 'type VARCHAR(20),'//CHAR,CHAR_PROP,ENV,ENV_PROP
		+ 'projectid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS notes('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'note VARCHAR(500),'
		+ 'shotid INT,'
		+ 'type VARCHAR(20),'
		+ 'userid INT,'
		+ 'time DATETIME'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS members('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'projectid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS lighters('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS renderwranglers('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS vfx('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS compositing('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS previs('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS animators('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'shotid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS rigging('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'assetid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS modeling('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'assetid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS shading('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'assetid INT,'
		+ 'userid INT'
		+ ');',function (err){
		if(err){
			throw err;
		}
	});

	console.log("all tables created");
}

exports.validateUser = function(req,res){

	connection.query(
		'select * from users '
		+ 'where username=\'' + req.body.username + '\';',
		function (err,rows,fields){
			if(err){
				console.log('error validatUser query');
				throw err;
			}
			if(JSON.stringify(rows) != '[]'){
				var salt = rows[0].salt;
				var h = rows[0].hashe;
				var compare = sha1(req.body.password + salt);
				if(compare != h)
				{
					res.end('[]');
				}
				res.end(JSON.stringify([{
	    			"id":rows[0].id,
	    			"fname":rows[0].fname,
	    			"lname":rows[0].lname,
	    			"username":rows[0].username,
	    			"phone":rows[0].phone,
	    			"email":rows[0].email
	    		}]));
			}
			res.end(JSON.stringify(rows));
		}
	);
}
exports.validateProject = function(req,res){
	connection.query(
		'select * from projects '
		+ 'where name=\'' + req.body.name + '\';',
		function (err,rows,fields){
			if(err){
				console.log('error validateProject query');
				throw err;
			}
			res.end(JSON.stringify(rows));
		}
	);
}

exports.createUser = function(req, res){
	var salt=randomstring.generate(4);
	var newstring = req.body.password + salt;
	var hash = sha1(newstring);

	connection.query
	(
		'INSERT INTO users (fname, lname, username, salt, hashe, email, phone)' +
		'VALUES (\''+req.body.fname+'\', \''+req.body.lname+'\', \''+req.body.username+'\', \''+salt+'\', \''+hash+'\', \''+req.body.email+'\',\''+req.body.phone+'\');',
		function (err,rows,fields){
			if(err){
				console.log('error createuser query');
				throw err;
			}
			res.end('created');
		}
	);
}

exports.createSequence = function(req, res){
	connection.query
	(
		'INSERT INTO sequences (name, projectid)' +
		'VALUES (\''+req.body.name+'\', \''+req.body.projectid+'\');',
		function (err,rows,fields){
			if(err){
				console.log('error addSequence query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.deleteSequence = function(req, res){
	connection.query(
		'select id FROM sequences WHERE name ="' + req.body.name + '";'
		+ 'delete from sequences where name="'+ req.body.name + '";',
		function (err,seqid){
			if(err){
				console.log('error deleteSequence query');
				throw err;
			}
			connection.query(
				'select id from shots where sequenceid='+seqid+';'
				+ 'delete from shots where sequenceid='+seqid+';',
				function(err,shotid){
					if(err){
						console.log('error deleteSequence query');
						throw err;
					}
					connection.query(
						'DELETE FROM animators WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM previs WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM lighters WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM vfx WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM notes WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM renderwranglers WHERE shotid=' + shotid[0].id + ';'
						+ 'DELETE FROM compositing WHERE shotid=' + shotid[0].id + ';',
						function(err){
							if(err){
								console.log('error deleteShot query 2');
								throw err;
							}
							res.end("success");
						}
					);
				}
			);
			res.end("success");
		}
	);
}

exports.createProject = function(req,res){

	connection.query(
		'INSERT INTO projects (name, authorid, passkey)'
		+ ' VALUES (\'' + req.body.name + '\', ' + req.body.userid + ', \'' + req.body.passkey + '\');',
		function(err,rows,fields){
			if(err){
				console.log('error createProject query');
				throw err;
			}
			else{
				//Second query to add author to member table
				connection.query(
					'INSERT INTO members (projectid, userid) SELECT id, \'' 
					+ req.body.userid + '\' FROM projects WHERE name=\'' + req.body.name + '\';',
					function(err,rows,fields){
						if(err){
							throw err;
						}
					}
				)
			}
			res.end(JSON.stringify(rows));
		}
	);

}

exports.getProjects = function(req,res){
	connection.query(
		'select projects.id,projects.name '
		+ 'from projects inner join members '
		+ 'on members.userid=' + req.body.userid + ' and members.projectid=projects.id;',
		function(err,rows){
			if(err){
				console.log('error getProjects query');
				throw err;
			}
			res.end(JSON.stringify(rows));
		}
	);
}

exports.addProject = function(req,res){
	connection.query(
		'INSERT INTO members (projectid, userid)'
		+ ' SELECT id, \'' + req.body.userid + '\' FROM projects WHERE name=\'' 
		+ req.body.name + '\' AND passkey=\'' + req.body.passkey + '\';',

		function(err,rows,fields){
			if(err){
				console.log('error addProject query');
				throw err;
			}
			res.end(JSON.stringify(rows));
		}
	);
}

exports.getAnnouncements = function (req,res) {
	connection.query(
		'select * from announcements '
		+ 'where projectid=' + req.body.projectid + ';',
		function(err,announcements){
			if(err){
				console.log('error getAnnouncements query');
				throw err;
			}
			res.end(JSON.stringify(announcements));
		}
	);
}

exports.getSequences = function (req,res) {
	connection.query(
		'select * from sequences '
		+ 'where projectid=' + req.body.projectid + ';',
		function(err,sequences){
			if(err){
				console.log('error getSequences query');
				throw err;
			}
	 		res.end(JSON.stringify(sequences));
		}
	);
}

exports.getShots = function(req,res){
	connection.query(
		'select shots.* from shots inner join sequences '
		+ 'on sequences.projectid='+req.body.projectid+' and shots.sequenceid=sequences.id;',
		function(err,shots){
			if(err){
				console.log('error getShots query');
				throw err;
			}
			res.end(JSON.stringify(shots));
		}
	);
}

exports.getAssets = function(req,res){
	connection.query(
		'select * from assets '
		+ 'where assets.projectid='+req.body.projectid+' and assets.type = \'CHAR\';' 
		+ 'select * from assets '
		+ 'where assets.projectid='+req.body.projectid+' and assets.type = \'CHAR_PROP\';'
		+ 'select * from assets '
		+ 'where assets.projectid='+req.body.projectid+' and assets.type = \'ENV\';'
		+ 'select * from assets '
		+ 'where assets.projectid='+req.body.projectid+' and assets.type = \'ENV_PROP\';',
		function(err,assets){
			if(err){
				console.log('error getAssets query');
				throw err;
			}
			res.end(JSON.stringify(assets));
		}
	);
}

exports.getPrevis = function(req,res){
	connection.query(
		'select previs.shotid,users.fname,users.lname,users.id,users.email from users inner join previs inner join shots inner join sequences '
		+ 'on previs.shotid=shots.id and users.id=previs.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,animators){
			if(err){
				console.log('error getAnimator query:'+JSON.stringify(animators));
				throw err;
			}
			res.end(JSON.stringify(animators));
		}
	);
}

exports.getAnimators = function(req,res){
	connection.query(
		'select animators.shotid,users.fname,users.lname,users.id,users.email from users inner join animators inner join shots inner join sequences '
		+ 'on animators.shotid=shots.id and users.id=animators.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,animators){
			if(err){
				console.log('error getAnimator query:'+JSON.stringify(animators));
				throw err;
			}
			res.end(JSON.stringify(animators));
		}
	);
}

exports.getLighters = function(req,res){
	connection.query(
		'select lighters.shotid,users.fname,users.lname,users.id,users.email from users inner join lighters inner join shots inner join sequences '
		+ 'on lighters.shotid=shots.id and users.id=lighters.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,lighters){
			if(err){
				console.log('error getLighters query:'+JSON.stringify(lighters));
				throw err;
			}
			res.end(JSON.stringify(lighters));
		}
	);
}

exports.getWranglers = function(req,res){
	connection.query(
		'select renderwranglers.shotid,users.fname,users.lname,users.id,users.email from users inner join renderwranglers inner join shots inner join sequences '
		+ 'on renderwranglers.shotid=shots.id and users.id=renderwranglers.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,renderwranglers){
			if(err){
				console.log('error getWranglers query:'+JSON.stringify(renderwranglers));
				throw err;
			}
			res.end(JSON.stringify(renderwranglers));
		}
	);
}

exports.getFX = function(req,res){
	connection.query(
		'select vfx.shotid,users.fname,users.lname,users.id,users.email from users inner join vfx inner join shots inner join sequences '
		+ 'on vfx.shotid=shots.id and users.id=vfx.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,vfx){
			if(err){
				console.log('error getFX query:'+JSON.stringify(vfx));
				throw err;
			}
			res.end(JSON.stringify(vfx));
		}
	);
}

exports.getCompositing = function(req,res){
	connection.query(
		'select compositing.shotid,users.fname,users.lname,users.id,users.email from users inner join compositing inner join shots inner join sequences '
		+ 'on compositing.shotid=shots.id and users.id=compositing.userid and shots.sequenceid=sequences.id and sequences.projectid='+ req.body.projectid +';',
		function(err,compositing){
			if(err){
				console.log('error getCompositing query:'+JSON.stringify(compositing));
				throw err;
			}
			res.end(JSON.stringify(compositing));
		}
	);
}

exports.getRigging = function(req,res){
	connection.query(
		'select rigging.assetid,users.fname,users.lname,users.id,users.email from users inner join rigging inner join assets '
		+ 'on rigging.assetid=assets.id and users.id=rigging.userid and assets.projectid='+ req.body.projectid +';',
		function(err,rigging){
			if(err){
				console.log('error getRigging query:'+JSON.stringify(rigging));
				throw err;
			}
			res.end(JSON.stringify(rigging));
		}
	);
}

exports.getModeling = function(req,res){
	connection.query(
		'select modeling.assetid,users.fname,users.lname,users.id,users.email from users inner join modeling inner join assets '
		+ 'on modeling.assetid=assets.id and users.id=modeling.userid and assets.projectid='+ req.body.projectid +';',
		function(err,modeling){
			if(err){
				console.log('error getModeling query:'+JSON.stringify(modeling));
				throw err;
			}
			res.end(JSON.stringify(modeling));
		}
	);
}

exports.getShading = function(req,res){
	connection.query(
		'select shading.assetid,users.fname,users.lname,users.id,users.email from users inner join shading inner join assets '
		+ 'on shading.assetid=assets.id and users.id=shading.userid and assets.projectid='+ req.body.projectid +';',
		function(err,shading){
			if(err){
				console.log('error getShading query:'+JSON.stringify(shading));
				throw err;
			}
			res.end(JSON.stringify(shading));
		}
	);
}

exports.getNotes = function(req,res){
	connection.query(
		'select users.fname,users.lname,notes.note,notes.id,notes.time from notes inner join users '
		+ 'on notes.userid=users.id and notes.type=\'' + req.body.type +'\' and shotid=' + req.body.shotid + ';',
		function(err,notes){
			if(err){
				console.log('error getNotes query');
				throw err;
			}
			res.end(JSON.stringify(notes));
		}
	);
}

exports.postAnnouncement = function(req,res){
	connection.query(
		'INSERT INTO announcements(authorid,projectid,message,time) '
		+ 'VALUES(' + req.body.authorid + ',' + req.body.projectid + ',\'' + req.body.message + '\',NOW());',
		function(err){
			if(err){
				console.log('error postAnnouncement query');
				throw err;
			}
			connection.query(
				'select * from announcements '
				+ 'where projectid=' + req.body.projectid + ';',
				function(err,announcements){
					if(err){
						console.log('error getAnnouncements query');
						throw err;
					}
					res.end(JSON.stringify(announcements));
				}
			);
		}
	);
}

exports.createShot = function(req,res){
	connection.query(
		'INSERT INTO shots(name,description,sequenceid,frames) '
		+ 'VALUES(\'' + req.body.name + '\',\'' 
					  + req.body.desc + '\',\'' 
					  + req.body.sequenceid + '\',\''
					  + req.body.frames + '\');',
		function(err,rows,fields){
			if(err){
				console.log('error createShot query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.deleteShot = function(req,res){
	connection.query(
		'select id from shots where name="'+req.body.shotName+'";'
		+ 'DELETE FROM shots WHERE id=' + shotid[0].id + ';',
		function(err,shotid){
			if(err){
				console.log('error deleteShot query 1');
				throw err;
			}
			connection.query(
				'DELETE FROM animators WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM previs WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM lighters WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM vfx WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM notes WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM renderwranglers WHERE shotid=' + shotid[0].id + ';'
				+ 'DELETE FROM compositing WHERE shotid=' + shotid[0].id + ';',
				function(err){
					if(err){
						console.log('error deleteShot query 2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.setFrames = function(req,res){
	connection.query
	(
		'UPDATE shots SET frames='+req.body.frames+' WHERE id='+req.body.shotid+';',
		function(err,rows,fields){
			if(err){
				console.log('error setFrames query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.setStatus = function(req,res){
	connection.query
	(
		'UPDATE shots SET status='+'\''+req.body.status+'\''+' WHERE id='+req.body.shotid+';',
		function(err,rows,fields){
			if(err){
				console.log('error setStatus query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.createAsset = function(req,res){
	connection.query
	(
		'INSERT INTO assets (name, projectid,type)' +
		'VALUES (\''+req.body.name+'\', \''+req.body.projectid+'\',\''+req.body.type+'\');',
		function (err){
			if(err){
				console.log('error addSequence query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.deleteAsset = function(req,res){
	connection.query(
		'DELETE FROM assets WHERE name="'+req.body.name+'";',
		function(err){
			if(err){
				console.log('error deleteAsset query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.createNote = function(req,res){
	connection.query(
		'INSERT INTO notes (note, shotid, type, userid,time)' +
		'VALUES (\''+req.body.note+'\', \''+req.body.shotid+'\', \''+req.body.type+'\', \''+req.body.userid+'\',NOW());',
		function (err,rows,fields){
			if(err){
				console.log('error createNote query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.deleteNote = function(req,res){
	connection.query(
		'DELETE FROM notes WHERE id='+req.body.id+';',
		function(err){
			if(err){
				console.log('err deleteNote query');
				throw err;
			}
			res.end("success");
		}
	);
}

exports.getUsers = function(req,res){
	connection.query
	(
		'SELECT users.id,fname, lname, email, phone FROM users INNER JOIN members ON users.id = members.userid WHERE projectid=' +
		 req.body.projectid + ' ORDER BY lname;',
		 function(err, members){
		 	if(err){
		 		console.log('error getUsers query');
		 		throw err;
		 	}
		 	res.end(JSON.stringify(members));
		 }
	);
}

exports.addPrevis = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addPrevis query');
				throw err;
			}
			connection.query(
				'INSERT INTO previs(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addPrevis query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addAnimator = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addAnimator query');
				throw err;
			}
			connection.query(
				'INSERT INTO animators(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addAnimator query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addLighter = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addLighter query');
				throw err;
			}
			connection.query(
				'INSERT INTO lighters(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addLighter query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addFX = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addFX query');
				throw err;
			}
			connection.query(
				'INSERT INTO vfx(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addFX query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addCompositing = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addCompositing query');
				throw err;
			}
			connection.query(
				'INSERT INTO compositing(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addCompositing query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addWrangler = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addWrangler query');
				throw err;
			}
			connection.query(
				'INSERT INTO renderwranglers(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addWrangler query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addModeler = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addModeler query');
				throw err;
			}
			connection.query(
				'INSERT INTO modeling(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addModeler query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addShader = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addShader query');
				throw err;
			}
			connection.query(
				'INSERT INTO shading(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addShader query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}

exports.addRigger = function(req,res){
	connection.query(
		'select users.id from users where fname=\"'+req.body.fname+'\" and lname=\"'+req.body.lname+'\";',
		function(err,userid){
			if(err){
				console.log('error addRigger query');
				throw err;
			}
			connection.query(
				'INSERT INTO rigging(userid,shotid) VALUES(' + userid[0].id +',' + req.body.id + ');',
				function(err){
					if(err){
						console.log('error addRigger query2');
						throw err;
					}
					res.end("success");
				}
			);
		}
	);
}