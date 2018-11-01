const User = require('./user');
const Post = require('./post');
const Keyword = require('./keyword');


exports.keywords = {
  create(start, keywords) {
    const val = new Keyword();
    val.start = start;
    val.keywords = keywords;
    return val.save();
  },

  count() {
    return Keyword.count({}).exec();
  },

  respond() {
    return {
      message: 'registered successfully',
    };
  },

  aggregate(keywords) {
    return Keyword.aggregate([{
      $unwind: '$keywords',
    },
    {
      $match: {
        keywords,
      },
    },
    {
      $group: {
        _id: {
          start: '$start',
          keywords: '$keywords',
        },
        count: {
          $sum: 1,
        },
      },
    },
    ]);
  },
};
exports.User = {
  create(userName, password) {
    const user = new User();
    user.userName = userName;
    user.password = password;
    return user.save();
  },

  count() {
    return User.count({}).exec();
  },

  respond() {
    return {
      message: 'registered successfully',
    };
  },
};

exports.Post = {
  create(body, userId) {
    const post = new Post();
    post.todo = body.todo;
    post.date = body.date;
    post.status = body.status;
    post.priority = body.priority;
    post.userId = userId;
    return post.save();
  },

  count() {
    return Post.count({}).exec();
  },

  respond() {
    return {
      message: 'registered successfully',
    };
  },
};
