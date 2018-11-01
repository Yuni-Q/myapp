
const express = require('express');
const moment = require('moment');
const Post = require('../mongoMedel/post');
const query = require('../mongoMedel/query');
const { isLoggedIn } = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const url = `${req.protocol}://${req.host}:${process.env.PORT || '3000'}`;
  const posts = await Post.find({}).sort({ date: 1 });
  console.log(posts);
  res.render('./posts/index', {
    title: req.user.userName,
    posts,
    user: req.user,
    url,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  const result = await query.Post.create(req.body, _id);
  res.json(result);
});

router.get('/create', isLoggedIn, async (req, res) => {
  res.render('./posts/create', {
    title: '글쓰기',
    user: req.user,
  });
});

router.get('/:_id/edit', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const posts = await Post.findOne({ _id });
  const date = await moment(posts.date).format('YYYY-MM-DD');
  res.render('./posts/edit', {
    title: '글수정',
    posts,
    date,
    user: req.user,
  });
});

router.get('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const posts = await Post.findOne({ _id });
  res.render('./posts/show', {
    title: 'Show',
    posts,
    user: req.user,
  });
});

router.put('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const {
    todo,
    date,
    status,
    priority,
  } = req.body;
  const post = await Post.findOne({ _id });
  post.todo = todo;
  post.date = date;
  post.status = status;
  post.priority = priority;
  const result = post.save();
  res.json(result);
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const result = await Post.deleteOne({ _id });
  res.json(result);
});

module.exports = router;
