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
