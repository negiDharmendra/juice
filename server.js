var http = require('http');
var express = require('express');
var body_parser = require('body-parser');

var app = express();
app.use(express.static('./'));

app.get('/',function(req,res){
	res.redirect('/index.html')
})

http.createServer(app).listen(3000,function(){console.log("listening at port 3000")});
