---------------- Development Setup -------------------------------------
Installations:
	Download & Install "Git Bash".
	Download MongoDB.
	Install nodeJS (https://nodejs.org/#download)
Get code in your local directory:
	Open web page: https://bitbucket.org/eartonic/eriyaz-web
	Click on 'Clone' (below header 'Actions')
	Copy the selected text (e.g git clone https://vikaspatel@bitbucket.org/eartonic/eriyaz-web.git)
	Open GitBash terminal
		cd C:/
		mkdir repos
		cd repos
		git clone https://<your_bitbucket_id>@bitbucket.org/eartonic/eriyaz-web.git
	If successful, you should see new directory 'eriyaz-web'.
Install dependent packages:
	$ cd repos\eriyaz-web
	$ npm install
	$ npm install bower
	$ cd client\public\src\ext-libs
	$ bower install
Create default location to store mongodb data.
	$ cd C:\
	$ mkdir data
	$ cd data
	$ mkdir db
Start Application:
	Start mongoDB: bin\mongod
	Start Node Server
	$ cd C:\
	$ cd repos\eriyaz-web\server
	$ node app
open url: localhost:3000 (crome browser)
---------------- End of Development Setup -------------------------------------

Karma quick start :-
Included karma dependencies in package.json, so just run "npm install" to install karma.
Next install karma-client with "npm install -g karma-cli"
karma.conf.js was created using "karma init karma.conf.js"
Start karma with "karma start"
run tests with "karma run"
to add more tests add them in test directory & include them in karma.conf.js.

---------------- Deploy on Production and Staging -------------------------------------
make sure you have gulp installed (> npm install -g gulp)
and other gulp dependencies that I have listed in devDependencies in package.json (> npm install)
from cmd in eriyaz folder run following commands :
> gulp clean
> gulp rjs
> gulp build

To setup heroku commands download and install - heroku toolbelt
https://toolbelt.heroku.com/

then open git bash & do following :
> heroku login
login : ashvyn.jain@gmail.com
pass : eartrainer

also add following remotes :-
staging - https://git.heroku.com/eriyaz-staging.git
production -  https://git.heroku.com/eriyaz.git

then to deploy new build just do -
git push staging master 
git push production master

Staging is accessible via :-
http://eriyaz-staging.herokuapp.com/

Production is Accessible via :- 
http://eriyaz.com

Database configuration for production,staging is stored in :-
evn.json
---------------- End of Deployment -------------------------------------