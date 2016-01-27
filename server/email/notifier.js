var mailgun = require('./mailgun.js');

var from = 'postmaster@eriyaz.com'
var admin_email_id = "eriyazonline@gmail.com"

exports.SendLevelCompletionEmail = function(email_id, userName, appName, levelName){
	var subject = "Well done!! You have completed " + appName + "-" + levelName;
	var text = userName + ",\n"
	text+="Well Done!! You  have completed "+appName + "-" + levelName +".\n"
	text+="Regards,\n"
	text+="eRiyaz Team,\n"
	text+="eriyazonline@gmail.com\n"
	var email = {from:from, to:email_id, subject:subject, text:text};
	mailgun.SendEMail(email);
}

exports.SendWelcomeEmail = function(email_id,name){
	var welcomeSubject = "Welcome to eRiyaz"
	var welcomeText = ""
	welcomeText+="Greetings "+name+",\n"
	welcomeText+="\n"
	welcomeText+="Welcome to eRiyaz.\n"
	welcomeText+="Your account is pending for admin approval. You will receive a confirmation email on account activation.\n"
	welcomeText+="\n"
	welcomeText+="Regards,\n"
	welcomeText+="eRiyaz Team,\n"
	welcomeText+="eriyazonline@gmail.com\n"
	welcomeText+="+91 8287459406"

	var email = {from:from, to:email_id, subject:welcomeSubject, text:welcomeText}
	mailgun.SendEMail(email);
}

exports.ResetPasswordEmail = function(emailAddress, req, token) {
	var subject = "eRiyaz Password Reset";
	var text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          'http://' + req.headers.host + '#/reset/' + token + '\n\n' +
	          'If you did not request this, please ignore this email and your password will remain unchanged.\n';
	var email = {from:'passwordreset@eriyaz.com', to:emailAddress, subject:subject, text:text};
	mailgun.SendEMail(email);
}

exports.NewUserEmail = function(user){
	var welcomeSubject = "New user on eRiyaz"
	var welcomeText = ""
	welcomeText+="Hello Admin!\n"
	welcomeText+="\n"
	welcomeText+="Following user has signed up on eRiyaz:\n"
	welcomeText+="Email:\t"+user.local.email+"\n"
	welcomeText+="Name:\t"+user.name+"\n"
	welcomeText+="DoB:\t"+user.dob+"\n"
	welcomeText+="Gender\t: "+user.gender+"\n"
	welcomeText+="Phone:\t"+user.phone+"\n"
	welcomeText+="\n"
	welcomeText+="Regards,\n"
	welcomeText+="eRiyaz Team"
	var email = {from:from, to:admin_email_id, subject:welcomeSubject, text:welcomeText}
	mailgun.SendEMail(email);
}

exports.SendActivationEmail = function(email_id,name){
	var welcomeSubject = "eRiyaz Account Activated"
	var welcomeText= ""
	welcomeText+="Greetings "+name+",\n"
	welcomeText+="\n"
	welcomeText+="Thank you for joining eRiyaz.\n"
	welcomeText+="\n"
	welcomeText+="Your account has been activated. You can login with your email/password now.\n"
	welcomeText+="\n"
	welcomeText+="Regards,\n"
	welcomeText+="eRiyaz Team,\n"
	welcomeText+="eriyazonline@gmail.com\n"
	welcomeText+="+91 8287459406"

	var email = {from:from, to:email_id, subject:welcomeSubject, text:welcomeText}
	mailgun.SendEMail(email);
}