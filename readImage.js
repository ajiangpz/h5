var fs=require('fs');
fs.readdir('./Image',function(error,filearr){
	console.log(JSON.stringify(filearr));
})