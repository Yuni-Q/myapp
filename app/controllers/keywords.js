const express = require('express');
const query = require('../mongoMedel/query');
const Keyword = require('../mongoMedel/keyword');

const router = express.Router();

router.post('/', async (req, res) => {
  const { start, keywords } = req.body;

  // create a new user if does not exist
  const create = await query.keywords.create(start, keywords);
  // count the number of the user
  const count = await query.keywords.count();

  const respond = res.json(await query.keywords.respond());

  // run when there is an error (username exists)
  const onError = error => res.status(409).json({ message: error.message });

  // check username duplication
  Keyword.find({})
    .then(create)
    .then(count)
    .then(respond)
    .catch(onError);
});

router.get('/:keywords', async (req, res, next) => {
  const { keywords } = req.params;
  try {
    const result = await query.keywords.aggregate(keywords);
    res.json({
      ok: true,
      message: null,
      result,
    });
  } catch (err) {
    next(err);
    res.json({
      ok: false,
      message: '에러 발생',
      result: err,
    });
  }
});

module.exports = router;
