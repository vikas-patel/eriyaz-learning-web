var mailgun = require('./mailgun.js');

var from = 'postmaster@eriyaz.com'
var admin_email_id = "eriyazonline@gmail.com"

exports.SendWelcomeEmail = function(email_id,name){
	var welcomeSubject = "Welcome to eRiyaz"
	var welcomeText = "Greetings "+name+"!\n\nWelcome to eRiyaz. Now you can learn to sing 10X faster by logging in to www.eriyaz.com using your email id "+email_id+".\n\nRegards,\neRiyaz Team"
	var email = {from:from, to:email_id, subject:welcomeSubject, text:welcomeText}
	mailgun.SendEMail(email);
}

exports.NewUserEmail = function(user){
	var welcomeSubject = "New user on eRiyaz"
	var welcomeText = "Hello Admin!\n\nFollowing user has signed up on eRiyaz:\nEmail:"+user.local.email+"\nName:"+user.name+"\nDoB:"+user.dob+"\nGender:"+user.gender+"\nPhone:"+user.phone+"\n\nRegards,\neRiyaz Team"
	var email = {from:from, to:admin_email_id, subject:welcomeSubject, text:welcomeText}
	mailgun.SendEMail(email);
}