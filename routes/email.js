var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "email@gmail.com",
		pass: "password"
	}
});

exports.sendEmail = function(req,res){
	var mailOptions = {
		to: req.query.to,
		subject: req.query.subject,
		text: req.query.text
	}

	smtpTransport.sendMail(mailOptions,function(error,response){
		if(error){
			res.end("error");
		}
		else{
			res.end("sent");
		}
	});
}
