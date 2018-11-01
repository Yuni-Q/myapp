const mongoose = require('mongoose');

const { Schema } = mongoose;

const Bus = new Schema({
  name: String,
  userId: String,
});

// create new User document
Bus.statics.create = (todo, date, userId) => {
  const keyword = new this({
    date,
    todo,
    userId,
  });

  // return the Promise
  return keyword.save();
};

// find one user by using username
Bus.statics.findOneByUsername = todo => this.findOne({ todo }).exec();


// verify the password of the User documment
Bus.methods.verify = todo => this.todo === todo;


// Keyword.methods.assignAdmin = function() {
//   this.admin = true;
//   return this.save();
// };

module.exports = mongoose.model('Bus', Bus);
