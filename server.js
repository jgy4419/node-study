const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
var db; // 데이터베이스 지정.

app.set('view engine', 'ejs') // install한 ejs 등록.

MongoClient.connect('mongodb+srv://jgy_98:J141900j.@cluster0.wsokd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',function(에러, client){
    if(에러){
        return console.log(에러)
    }
    db = client.db('todoapp');
    app.listen(8080, function(){
        console.log('listen on 8080');
    });
})

app.get('/', function(요청, 응답){
    응답.sendfile(__dirname + '/index.html')
});

app.get('/write',function(요청, 응답){
    응답.sendFile(__dirname + '/write.html') 
});
app.post('/add', function(요청, 응답){
  console.log(요청.body.title);
  db.collection('post').insertOne({타이틀: 요청.body.title, 날짜: 요청.body.date}, function(에러, 결과){
    console.log('저장완료');    
  });
});

app.get('/list', function(요청, 응답){
    응답.render('list.ejs')
})
// app.get('/list', function(요청, 응답){
//     응답.sendFile(__dirname + '/list.html');
// })
