const express = require('express');
const app = express()
const port = 5002
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

const { User } = require('./models/User')

//application/x-www-form-urlencoded : 이렇게 생긴 데이터를 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({ extended: true }));

//application/json : 이렇게 생긴 파일을 분석해서 가져올 수 있게 함.
app.use(bodyParser.json());
app.use(cookieParser());

const mogoose = require('mongoose');

mogoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/users/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)

  //save(): 몽고디비 메소드
  user.save((err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  //요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.'
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })

      //비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키 , 로컬스토리지
        res.cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      })
    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {
  //인증 처리 하는 곳
  //클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;
  //토큰을 복호화 한 후 유저를 찾는다.

  //유저가 있으면 인증 ok
  //유저가 없으면 인증 no

})

app.listen(port, () => console.log(`Exmaple app listenind on port ${port}!`));


