var nodemailer = require('nodemailer');

var generator = require('xoauth2').createXOAuth2Generator({
    user: 'eriyazonline@gmail.com',
    clientId: '637052885908-emh7bgkmcbqqho6uao70jb81rirjdbtj.apps.googleusercontent.com',
    clientSecret: 'kL12LdZ-5DOwWJkqMOzUFUR0',
    refreshToken: '1/Z9mDKx64LlSPLzD_LU99bH5zfWE5aSowBpWpDMtwHItIgOrJDtdun6zK6XiATCKT'
    //accessToken: 'ya29.zgFQMRIo0A25pF-BO5GbqmH1f6ub64xfuUmtznxfcGWUL7NJLF7qQpvjDHhltzSHyljI' // optional
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'eRiyaz Sing<eriyazonline@gmail.com>', // sender address
    to: 'v.vikas.patel@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};
console.log("sending email.");
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});