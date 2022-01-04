const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// mongoDB를 가져온다.
const MongoClient = require('mongodb').MongoClient;
var db; // 데이터베이스 지정할 변수.

app.set('view engine', 'ejs') // install한 ejs 등록.

MongoClient.connect('mongodb+srv://jgy_98:J141900j.@cluster0.wsokd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',function(에러, client){
    if(에러){
        return console.log(에러)
    }
    db = client.db('todoapp'); // mongoDB에서 만들어준 todoapp 이라는 database에 연결 시켜주기.
    // db에 연결이 되었으면 서버를 실행시켜준다.
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
    응답.send('전송완료')
  console.log(요청.body.title);
  let postCount;
  db.collection('counter').findOne({name: "게시물개수"},function(에러, 결과){
      postCount = 결과.totalCount;
      db.collection('post').insertOne({_id: postCount+1, 타이틀: 요청.body.title, 날짜: 요청.body.date}, function(에러, 결과){
        console.log('저장완료');
        // 내가 mongoDB에서 값을 수정하고 싶을 때 updateOne()를 쓴다. One은 하나만 수정. 여러개는 updateMany()사용.
        db.collection('counter').updateOne({name: '게시물개수'}, {$inc: {totalCount: 1}}, function(에러, 결과){
            if(에러) {return console.log(에러)}
            console.log(postCount);
        })
      });
  });
});

app.get('/list', function(요청, 응답){
    응답.render('list.ejs')
})
// app.get('/list', function(요청, 응답){
//     응답.sendFile(__dirname + '/list.html');
// })
