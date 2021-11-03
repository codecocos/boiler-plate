const express = require('express');
const app = express()
const port = 5002
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User')

//application/x-www-form-urlencoded : 이렇게 생긴 데이터를 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({ extended: true }));

//application/json : 이렇게 생긴 파일을 분석해서 가져올 수 있게 함.
app.use(bodyParser.json());

const mogoose = require('mongoose');
mogoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)

  //save(): 몽고디비 메소드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Exmaple app listenind on port ${port}!`));


