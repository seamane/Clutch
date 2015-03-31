var nodemailer = require("nodemailer");
//var util = require('util');
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "byuclutch@gmail.com",
		pass: "IK54s12fQi"
	}
});

exports.sendEmail = function(req,res){
	var mailOptions = {
		from: 'Clutch <byuclutch@gmail.com>',
		to: req.body.to,
		subject: req.body.subject,
		text: req.body.text
	}
	// console.log(req.body);
	smtpTransport.sendMail(mailOptions,function(error,response){
		if(error){
			res.end("error");
		}
		else{
			res.end("sent");
		}
	});
}
