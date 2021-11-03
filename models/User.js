const mongoose = require('mongoose');

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

//모델이름,스키마
const User = mongoose.model('User', userShcema)

module.exports = { User }