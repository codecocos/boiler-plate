const { User } = require('../models/User');

let auth = (req, res, next) => {

  //인증 처리 하는 곳

  //클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;

  //토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true })

    //다음 단계에서 token 과 user를 사용할 수 있게 하기위해 req에 담아줌.
    req.token = token;
    req.user = user;
    next();
  })

  //유저가 있으면 인증 ok
  //유저가 없으면 인증 no

}

module.exports = { auth };