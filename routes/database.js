var mysql = require('mysql');
var randomstring = require("randomstring");
var sha1 = require('sha1');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'griffin1',


});

exports.initDatabase = function(req,res)
{
	// connection.connect(function(err){
	// 	if(err != null){
	// 		console.log('Error connecting to mysql\n' + err + '\n');
	// 		throw err;
	// 	}
	// 	else{
	// 		console.log('mySQL connected\n');
	// 	}
	// });

	connection.query('CREATE DATABASE IF NOT EXISTS clutch', function(err){
		if(err){//} && err.number != client.ERROR_DB_CREATE_EXISTS){
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
		//+ 'passwords VARCHAR(50),'       //new column		//new column, password was taken out.
		+ 'salt VARCHAR(50),'
		+ 'hashe VARCHAR(50),'
		+ 'email VARCHAR(50)'
		+ ');',function(err){
		if(err){
			throw err;
		}
	});

	connection.query(
		'CREATE TABLE IF NOT EXISTS tasks('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'userid INT,'
		+ 'shotid INT'
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
		+ 'sequenceid INT,'
		+ 'projectid INT'
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
		'CREATE TABLE IF NOT EXISTS notes('
		+ 'id INT NOT NULL AUTO_INCREMENT,'
		+ 'PRIMARY KEY(id),'
		+ 'note VARCHAR(500),'
		+ 'shotid INT,'
		+ 'type VARCHAR(20)'
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
		'CREATE TABLE IF NOT EXISTS shotdressers('
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
	console.log("all tables created");
}

exports.validateUser = function(req,res){
		var p=req.body.password;
		console.log(p);

	connection.query(
		'select * from users '
		+ 'where username=\'' + req.body.username + '\';',
		//+ 'where username=\'' + req.body.username + '\' AND passwords=\'' + req.body.password + '\';',
		function (err,rows,fields){
			if(err){
				console.log('error validatUser query');
				throw err;
			}
			if(JSON.stringify(rows) === '[]')
			{
				console.log("EMPTY");
				res.end(JSON.stringify(rows));
			}
			else
			{
				//console.log(JSON.stringify(rows));
					//console.log(rows[0].username);
					var salt = rows[0].salt;
					var h = rows[0].hashe;
					var compare = sha1(req.body.password + salt);
					if(compare == h)
					{
						console.log("SUCCESS");
						res.end(JSON.stringify(rows));
					}
					else
					{
						res.end('[]');
					}

			}
			//console.log("AFTER ROWS");
			//res.end(JSON.stringify(rows));
		}
	);
}

exports.create = function(req, res){
	var salt=randomstring.generate(4);
	var newstring = req.body.password + salt;
	var hash = sha1(newstring);


	connection.query
	(
		'INSERT INTO users (fname, lname, username, salt, hashe, email)' +
		'VALUES (\''+req.body.fname+'\', \''+req.body.lname+'\', \''+req.body.username+'\', \''+salt+'\', \''+hash+'\', \''+req.body.email+'\');',
		function (err,rows,fields){
			if(err){
				console.log('error createuser query');
				throw err;
			}
			res.end(JSON.stringify(rows));
			console.log(JSON.stringify(rows));
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
			console.log(JSON.stringify(rows));
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
			}
	 		res.end(JSON.stringify(sequences));
		}
	);
}