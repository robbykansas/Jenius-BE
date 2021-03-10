const mongoose = require('mongoose')
const Email = require('mongoose-type-email')
const { Schema } = mongoose

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  accountNumber: {
    type: Number,
    unique: true,
    required: true
  },
  emailAddress: {
    type: Email,
    required: true,
  },
  identityNumber: {
    type: Number,
    unique: true,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)