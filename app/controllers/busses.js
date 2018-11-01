
const express = require('express');
const request = require('request');
const { parseString } = require('xml2js');
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

router.get('/busstop', async (req, res) => {
  const { _id } = req.params;
  const busses = await Bus.find({ userId: _id }).sort({ date: 1 });
  const time = [];
  busses.forEach(((bus) => {
    let busStopName = bus;
    busStopName = encodeURI(busStopName);
    const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${config.busStopKey}&stSrch=${busStopName}`;
    request(busStopNumberUri, (error, response, body) => {
      parseString(body, (err, result) => {
        const busStopNumber = result.ServiceResult.msgBody[0].itemList[0].arsId[0];
        const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${config.busStopKey}&arsId=${busStopNumber}`;
        request(busTime, (error2, response2, body2) => {
          parseString(body2, (err2, result2) => {
            (result2.ServiceResult.msgBody[0].itemList).forEach(((element) => {
              time.push(`${element.rtNm}번 버스 도착 시간은 ${element.arrmsg1}입니다.`);
            }));
          });
        });
      });
    });
  }));
  res.json({ time });
});
module.exports = router;
