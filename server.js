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
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과)
        응답.render('list.ejs', {post : 결과});
    });
})

app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    // 요청.body에 담겨온 게시물번호를 다진 글을 db에서 찾아서 삭제해주세요.
    요청.body._id = parseInt(요청.body._id);
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료')
        // 성공 했으면 성공했다고 메시지 보내주기.
        // status는 상태를 나타내고 ()안에 200은 성공했을 떄를 나타낸다.(400은 실패를 뜻함.)
        응답.status(200).send({message: '성공했습니다.'});
    })
})

app.get('/detail/:id', function(요청, 응답){
    // 요청.params.id는 url의 파라미터중에 id라고 지은 파라미터 이름을 넣어달라는 뜻.
    db.collection('post').findOne({_id: parseInt(요청.params.id)}, function(에러, 결과){
        // 응답.render로 detail.ejs 보여주도록 하기.
        // data라는 이름에 불러온 데이터 결과를 모두 넣어줌. 불러올 떄 data.값 넣어서 오브젝트 내에 원하는 데이터 가져올 수 있음.
        응답.render('detail.ejs', {data: 결과})
    })
})