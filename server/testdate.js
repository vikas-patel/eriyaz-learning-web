
var date = new Date();
for(var i=0;i<30;i++) {
	date.setDate(date.getDate() - 1);
	console.log(date);
	console.log(Math.random());
}
