
const express = require('express');
const Post = require('../mongoMedel/post');
const query = require('../mongoMedel/query');
const { isLoggedIn } = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const posts = await Post.find({}).sort({ date: 1 });
  res.json({
    ok: true,
    message: null,
    result: posts,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { _id } = req.user;
  const result = await query.Post.create(req.body, _id);
  res.json({
    ok: true,
    message: null,
    result,
  });
});

router.put('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const { _id: userId } = req.user;
  const {
    todo,
    date,
    content,
    status,
    priority,
  } = req.body;
  const post = await Post.findOne({ _id });
  post.todo = todo;
  post.date = date;
  post.content = content;
  post.status = status;
  post.priority = priority;
  post.userId = userId;
  const result = post.save();
  res.json({
    ok: true,
    message: null,
    result,
  });
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const { _id } = req.params;
  const result = await Post.deleteOne({ _id });
  res.json({
    ok: true,
    message: null,
    result,
  });
});

module.exports = router;
