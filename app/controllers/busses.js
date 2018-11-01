
const express = require('express');
const Bus = require('../mongoMedel/bus');
const query = require('../mongoMedel/query');
const { isLoggedIn } = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const busses = await Bus.find({}).sort({ date: 1 });
  res.render('./busses/index', {
    title: req.user.userName,
    busses,
    user: req.user,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  const result = await query.Bus.create(req.body, _id);
  res.json(result);
});

router.get('/create', isLoggedIn, async (req, res) => {
  res.render('./busses/create', {
    title: '정류장 추가',
    user: req.user,
  });
});

router.get('/:_id/edit', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const bus = await Bus.findOne({ _id });
  res.render('./busses/edit', {
    title: '정류장 수정',
    bus,
    user: req.user,
  });
});

router.get('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const bus = await Bus.findOne({ _id });
  res.render('./busses/show', {
    title: 'Show',
    bus,
    user: req.user,
  });
});

router.put('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const userId = req.user._id;
  const { name } = req.body;
  const bus = await Bus.findOne({ _id });
  bus.name = name;
  bus.userId = userId;
  const result = bus.save();
  res.json(result);
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const result = await Bus.deleteOne({ _id });
  res.json(result);
});

module.exports = router;
