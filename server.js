var express = require('express');


var app = express();


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('.'));


var images = require('./images/list');

app.get('/', function(req, res){
  res.render('index', {images: images});
});


app.get('/post', function(req, res){
  res.render('permalink');
});


var server = app.listen(7000, 'localhost', function(){
  console.info('Express listening on port ' + server.address().port);
});
