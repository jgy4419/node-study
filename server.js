const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.listen(8000, function(){
    console.log('listening on 8000');
});

app.get('/', function(요청, 응답){
    응답.sendfile(__dirname + '/index.html')
});

app.get('/write',function(요청, 응답){
    응답.sendFile(__dirname + '/write.html') 
});

app.post('/add', function(요청, 응답){
  console.log(요청.body);
  응답.send('전송완료')
});