
const express = require('express');
const moment = require('moment');
const Post = require('../mongoMedel/post');
const query = require('../mongoMedel/query');
const { isLoggedIn } = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const posts = await Post.find({});
  res.render('./posts/index', {
    title: req.user.userName,
    posts,
    user: req.user,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { todo, date } = req.body;
  const { _id } = req.user;
  const result = await query.Post.create(todo, date, _id);
  res.json(result);
});

router.get('/create', isLoggedIn, async (req, res) => {
  res.render('./posts/create', {
    title: '글쓰기',
    user: req.user,
  });
});

router.get('/edit', isLoggedIn, async (req, res) => {
  const { _id } = req.query;
  const posts = await Post.findOne({ _id });
  const date = await moment(posts.date).format('YYYY-MM-DD');
  res.render('./posts/edit', {
    title: '글수정',
    posts,
    date,
    user: req.user,
  });
});

router.put('/', isLoggedIn, async (req, res) => {
  const { _id, todo, date } = req.body;
  const posts = await Post.findOne({ _id });
  posts.todo = todo;
  posts.date = date;
  const result = posts.save();
  res.json(result);
});

router.delete('/', isLoggedIn, async (req, res) => {
  const { _id } = req.body;
  const result = await Post.deleteOne({ _id });
  res.json(result);
});

module.exports = router;
