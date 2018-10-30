
const express = require('express');
const Post = require('../../mongoMedel/post');
const query = require('../../mongoMedel/query');
const { isLoggedIn } = require('../../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const posts = await Post.find({});
  res.render('page', {
    title: req.user.userName,
    posts,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { todo, date } = req.body;
  const userId = req.user._id;
  await query.Post.create(todo, date, userId);
  res.redirect('/users/page');
});
router.get('/post/create', isLoggedIn, async (req, res) => {
  res.render('post', {
    title: '글쓰기',
    // content: posts,
  });
});

router.get('/post/edit', isLoggedIn, async (req, res) => {
  const _id = req.query.id;
  const posts = await Post.findOne({ _id });
  res.render('postUpdate', {
    title: '글수정',
    posts,
  });
});

router.post('/post/edit', isLoggedIn, async (req, res) => {
  const { _id, todo, date } = req.body;
  const posts = await Post.findOne({ _id });
  posts.todo = todo;
  posts.date = date;
  posts.save();
  res.redirect('/users/page');
});

router.get('/post/delete', isLoggedIn, async (req, res) => {
  const _id = req.query.id;
  await Post.deleteOne({ _id });
  res.redirect('/users/page');
});

module.exports = router;
