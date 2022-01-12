const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// method-override 라이브러리 등록.
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

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
    // 응답.sendfile(__dirname + '/index.html')
    응답.render('index.ejs')
});

app.get('/write',function(요청, 응답){
    // 응답.sendFile(__dirname + '/write.html') 
    응답.render('write.ejs')
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

app.get('/edit/:id', function(요청, 응답){
    db.collection('post').findOne({_id: parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        // /edit/2로 접속하면 2번째게시물 제목, 날짜를 edit.ejs로 보내줌.
        응답.render('edit.ejs', {post: 결과})
        if(에러){
            console.log(에러)
        }
    })
})

// 누가 /edit 경로로 put요청을 했을 때 
app.put('/edit', function(요청, 응답){
    // post라는 파일에 _id가 ??인 데이터를 찾아서 $set(오파레이션)을 사용해서 타이틀: ???를 변경해주세요~~
    // $set은 업데이터 해주세요. 만약 그 데이터가 없으면 추가시켜줌.
    db.collection('post').updateOne({_id: parseInt(요청.body.id)}, {$set: {타이틀: 요청.body.title, 날짜 : 요청.body.date}}, function(에러, 결과){
        console.log('수정완료.');
        // tip : 서버코드에는 꼭 응답이 필요하다. 응답을 안해주면 사이트가 멈추는 현상이 생김..
        응답.redirect('/list')
    })
})

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 

// url에 login을 입력해서 들어갔을 때 로그인 페이지 띄워줌.
app.get('/login', function(요청, 응답){
    응답.render('login.ejs')
})
// 로그인 버튼을 눌렀을 때 가능 만들기.
// local방식을 함.
app.post('/login', passport.authenticate('local', {
    // 로그인에 실패하면 /fall 경로로 페이지 이동.
    failureRedirect: '/fail'
}),(요청, 응답) => {
    // 로그인에 성공하면 / 경로로 이동.
  응답.redirect('/')   
})

// .get()의 두번쨰 인자에 내가 만든 미들웨어 넣어주기. 
// 그러면 /mypage로 요청을 하면 로그인했는 함수가 실행하고 요청, 응답이 나옴.
app.get('/mypage', 로그인했니, function(요청, 응답){
    // 로그인에 성공하면 요청.user로 DB에서 해당 id의 정보를 가져올 수 있다.
    console.log(요청.user);
    // render의 두번째 인자는 myPage.ejs에 보낼 데이터 작성(객체 데이터로).
    응답.render('myPage.ejs', {사용자: 요청.user});
})
// 로그인했는지 식별해주는 미들웨어 만들어주는 방법.
function 로그인했니(요청, 응답, next){
    // db에 user가 있는지
    // 요청.user는 로그인 후 세션이 있으면 요청.user가 항상있다.
    if(요청.user){
        next() // next()는 다음으로 통과시켜달라는 뜻.
    }else{
        요청.send('로그인 안하셨네용');
    }
}


// LocalStraregy는 어떻게 인증할 것인지? 알려줌.
passport.use(new LocalStrategy({
    // form에서 입력한 name이 id, pw인 것을 각각 가져옴.
    usernameField: 'id',
    passwordField: 'pw',
    session: true, // 로그인 후 세션을 저장할 것인지.
    passReqToCallback: false,
    // 여기부터 사용하의 id, pw가 db에 저장된 id, pw중 같은게 있는지 검증해줌.
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번); // 사용자가 입력한 id, pw를 console에 띄워줌.
    // db에 login이라는 파일에 id가 같은지 검사.
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
      // 만약 일치하는 아이다가 없으면? 
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      // db에 id가 있으면 여기 실행. 아이디가 일치하면 다음으로 비밀번호가 일치한지 검사해준다. 
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  // 유저 정보를 세션으로 저장하고, 쿠키를 만들어줌.
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });

  // 로그인한 유저의 개인정보를 DB에서 찾는 역할.
  passport.deserializeUser(function (아이디, done) {
      db.collection('login').findOne({id: 아이디}, function(에러, 결과){
          // 결과는 id: test, pw: test를 가져옴.
          done(null, 결과)
      })
  }); 

  app.get('/search', (요청, 응답) => {
      var 검색조건 = [
          {
              $search: {
                  // index에는 내가만든 인덱스명
                  index: 'titleSearch',
                  // 실제 검색 요청하는 부분.
                  text: {
                      query: 요청.query.value,
                      // collection언에서 어떤 항목에서 검사할 것인지 찾기.(여러개 동시에 검사 가능.)
                      path: "타이틀" // 타이틀, 날짜 둘 다 찾고 싶으면 ['타이틀', '날짜'] 이렇게 넣어주기.
                  }
              }
          },
          {$sort: {_id: 1}},
          {$limit: 10}
      ]
      db.collection('post').aggregate(검색조건).toArray((에러, 결과)=>{
        console.log(결과);
        응답.render('searchRes.ejs', {res: 결과})
      })
  })

  