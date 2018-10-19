const express = require('express');
const Keyword = require('../mongoMedel/keyword');

const router = express.Router();

router.post('/', (req, res) => {
  const { start, keywords } = req.body;
  // const newKeyword = null;

  // create a new user if does not exist
  const create = () => {
    const val = new Keyword();
    val.start = start;
    val.keywords = keywords;
    val.save();
  };
  // count the number of the user
  const count = () => Keyword.count({}).exec();

  const respond = () => {
    res.json({
      message: 'registered successfully',
    });
  };

  // run when there is an error (username exists)
  const onError = error => res.status(409).json({ message: error.message });

  // check username duplication
  Keyword.find({})
    .then(create)
    .then(count)
    .then(respond)
    .catch(onError);
  // res.json(newKeyword);
});

router.get('/', async (req, res, next) => {
  const { keywords } = req.query;
  console.log(keywords);

  await Keyword.aggregate([
    { $unwind: '$keywords' },
    { $match: { keywords } },
    {
      $group: {
        _id: { start: '$start', keywords: '$keywords' },
        count: { $sum: 1 },
      },
    },
  ])
    .then(result => res.send(result))
    .catch(err => next(err));
  // .then(k => {
  //   let a = [];
  //   k.forEach(element => {
  //     console.log(element);
  //     if (element.keywords.includes(keywords)) {
  //       a.push(element);
  //     }
  //   });
  //   console.log(a);
  //   a = _.groupBy(a, "start");

  //   for (const key of Object.keys(a)) {
  //     b[key] = a[key].length;
  //   }
  // });

  // res.send(b);
  // res.send(c);
});

module.exports = router;
