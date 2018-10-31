const express = require('express');
const request = require('request');
const _ = require('lodash');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const url = `${req.protocol}://${req.host}:${process.env.PORT || '3000'}`;
  res.cookie('name', 'Yun');
  res.render('index', { title: '안녕하세요', url });

  // 쿠키 세팅
  // res.cookie(key,value,{options});

  // 쿠키 사용
  // req.cookies.key

  // 쿠키 삭제
  // res.clearCookie(key);
  // res.clearCookie(key, {path:'/path'});
});

router.get('/movies', async (req, res) => {
  let preMovies = '';
  // let movies = '';
  const temp = [];
  let row = {};
  let size = '';
  let result = '';
  request('https://yts.ag/api/v2/list_movies.json?limit=50', (
    error,
    response,
    body,
  ) => {
    console.time();
    try {
      if (!error && response.statusCode === 200) {
        preMovies = JSON.parse(body);
        const { movies } = preMovies.data;
        movies.forEach((element) => {
          element.torrents.forEach((e) => {
            if (e.size.slice(-2, -1) === 'G') {
              size = e.size.slice(0, -2) * 1024;
            } else {
              size = e.size.slice(0, -2) * 1;
            }
            const { title } = element;
            const { quality } = e;
            row = { title, quality, size };
            temp.push(row);
          });
        });
        result = _.sortBy(temp, ['size']);
        result.forEach((e) => {
          e.size += ' MB';
        });
        console.timeEnd();
        res.json(result);
      }
    } catch (_err) {
      console.log(_err);
    }
  });
});

module.exports = router;
