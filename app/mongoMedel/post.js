const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
  date: { type: Date, default: Date.now },
  todo: String,
  userId: String,
  content: String,
  status: Boolean,
  priority: Number,
});

// create new User document
Post.statics.create = (todo, date, userId) => {
  const keyword = new this({
    date,
    todo,
    userId,
  });

  // return the Promise
  return keyword.save();
};

// find one user by using username
Post.statics.findOneByUsername = todo => this.findOne({ todo }).exec();


// verify the password of the User documment
Post.methods.verify = todo => this.todo === todo;


// Keyword.methods.assignAdmin = function() {
//   this.admin = true;
//   return this.save();
// };

module.exports = mongoose.model('Post', Post);
