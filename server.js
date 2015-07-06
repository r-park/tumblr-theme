var express = require('express');


var app = express();


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('.'));


app.get('/', function(req, res){
  res.render('index');
});


app.get('/post', function(req, res){
  res.render('permalink');
});


var server = app.listen(7000, 'localhost', function(){
  console.info('Express listening on port ' + server.address().port);
});
