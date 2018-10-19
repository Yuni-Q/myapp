const mongoose = require('mongoose');

const { Schema } = mongoose;

const Keyword = new Schema({
  start: { type: Date, default: Date.now },
  keywords: [String],
});

// create new User document
Keyword.statics.create = (start, keywords) => {
  const keyword = new this({
    start,
    keywords,
  });

  // return the Promise
  return keyword.save();
};

// find one user by using username
Keyword.statics.findOneByUsername = keywords => this.findOne({ keywords }).exec();


// verify the password of the User documment
Keyword.methods.verify = keywords => this.keywords === keywords;


// Keyword.methods.assignAdmin = function() {
//   console.log(this);
//   this.admin = true;
//   return this.save();
// };

module.exports = mongoose.model('Keyword', Keyword);
