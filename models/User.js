const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userShcema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})

//비밀번호를 저장하기 전에 함수 실행.
userShcema.pre('save', function (next) {
  var user = this;

  //비밀번호가 변경된 경우가 해쉬값이 변경되도록 설정
  if (user.isModified('password')) {

    //비밀번호를 암호화 시킨다.
    //genSalt : salt를 생성함.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      //유저모델의 패스워드 필드(사용자가 입력한 plain 패스워드), 생성된 salt , 
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        //해쉬된 비밀번호로 바꿔준다.
        user.password = hash
        next()
      })
    })
    //비밀번호를 바꾸는 것이 아니면 next로 보내주어야 함.
  } else {
    next()
  }
})

//로그인
userShcema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword : 12345678910   암호화된 password : $2b$10$V3MZ4JdZaYlW.sTZcP40p.TULaXHS77JvMxFu1BYJL.oQgPp/Da0e
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    //플레인과 암호화된 것이 같다면, 에러는 없고 isMatch 호출
    cb(null, isMatch)
  })
}
//로그인
userShcema.methods.generateToken = function (cb) {
  var user = this;

  //jsonwebToken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  // user._id+'secretToken' = token
  // ->
  // 'secretToken' -> user._id

  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    //에러는 없고, 유저 부분 전달
    cb(null, user)
  })
}

userShcema.statics.findByToken = function token(db) {
  var user = this;

  //토큰을 decode한다.
   

}
//모델이름,스키마
const User = mongoose.model('User', userShcema)

module.exports = { User }