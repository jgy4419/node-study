let router = require('express').Router();


function 로그인했니(요청, 응답, next){
    if(요청.user){
        next();
    }else{
        응답.send('로그인 안하셨네용');
    }
}


router.get('/sport', 로그인했니, (요청, 응답) => {
    응답.send('스포츠 게시판');
});

router.get('/game', 로그인했니, (요청, 응답) => {
    응답.send('게임 게시판');
});

module.exports = router;