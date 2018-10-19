
const mongoose = require('mongoose');

const crypto = require('crypto');
// const config = require('../../config');

const { Schema } = mongoose;

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

// create new User document
User.statics.create = (username, password) => {
  const encrypted = crypto
    .createHmac('sha1', global.config.mongo.secret)
    .update(password)
    .digest('base64');

  const user = new this({
    username,
    password: encrypted,
  });

  // return the Promise
  return user.save();
};

// find one user by using username
User.statics.findOneByUsername = username => this.findOne({ username }).exec();

// verify the password of the User documment
User.methods.verify = (password) => {
  const encrypted = crypto
    .createHmac('sha1', global.config.mongo.secret)
    .update(password)
    .digest('base64');

  return this.password === encrypted;
};

User.methods.assignAdmin = () => {
  console.log(this);
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);
