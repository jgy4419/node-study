// express를 사용하겠다고 정의하고, 그 안에 Router()라는 함수를 사용하겠습니다.
var router = require('express').Router();

 // 예제 라우터
 // app대신 위에 선언한 변수명인 router로 변경하기
router.get('/shirts', function(요청, 응답){
    응답.send('셔츠파는 페이지.')
});

router.get('/pants', function(요청, 응답){
    응답.send('바지 파는 페이지.')
});

module.exports = router;