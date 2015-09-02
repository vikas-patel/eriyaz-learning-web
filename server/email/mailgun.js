var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var smtpTransport = nodemailer.createTransport(mg({auth:{
	api_key: 'key-c9b4ec5b9599a6853a521a848ecbc695',
    domain: 'eriyaz.com',
	}
 }));

exports.SendEMail = function(mailOptions, done){
      smtpTransport.sendMail(mailOptions, function(err) {
		if(err)
			console.log('error','Error while sending mail');
		else
			console.log('info', 'An e-mail has been sent to ' + mailOptions.to);
		if(done)
			done(err, 'done');
      });
}
