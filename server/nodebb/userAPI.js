var Client = require('node-rest-client').Client;
var client = new Client();
 
var config = require('../env').config(); 
var token = config.nodebb.token
var url = config.nodebb.url

// set content-type header 
var  headers = {"Content-Type": "application/json",
  'authorization': "Bearer "+token};

// registering remote methods 
client.registerMethod("createUser", url+"/api/v1/users", "POST");
client.registerMethod("deleteUser", url+"/api/v1/users/${uid}", "DELETE");

exports.createUser = function(username, password, email, cb){
	var data = {'username' : username};
	if(password) data.password = password;
	if(email) data.email = email;
	
	var args = {
		'data' : data,
	  'headers':headers
	};

	client.methods.createUser(args, function callback(data,response){
	 var res = JSON.parse(data);
		//console.log(res);
		if(res.code == 'ok'){
			console.log("Sucessfully created user :",res.payload.uid);
			cb(null,res.payload.uid)
		}
		else{
			console.log("Error while creating user:",username,":",res.message);
			cb("error",null)
		}
	});
}

exports.deleteUser = function(uid,cb){
	var args = {
		'path' : { 'uid': uid},
		'headers':headers
	};
	client.methods.deleteUser(args, function callback(data,response){
	 var res = JSON.parse(data);
		//console.log(res);
		if(res.code == 'ok'){
			console.log("Sucessfully deleted user :",uid);
			cb(null)
		}
		else{
			console.log("Error while deletig user:",uid,":",res.message);
			cb("error")
		}
	});
}

