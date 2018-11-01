const express = require('express');
const request = require('sync-request');
const {
  parseString
} = require('xml2js');
const {
  forEach
} = require('async-foreach');
const Bus = require('../mongoMedel/bus');
const query = require('../mongoMedel/query');
const {
  isLoggedIn
} = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const busses = await Bus.find({}).sort({
    date: 1
  });
  res.render('./busses/index', {
    title: req.user.userName,
    busses,
    user: req.user,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const {
    _id
  } = req.user;
  const result = await query.Bus.create(req.body, _id);
  res.json(result);
});

router.get('/create', isLoggedIn, async (req, res) => {
  res.render('./busses/create', {
    title: '정류장 추가',
    user: req.user,
  });
});

router.get('/busstop', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.user;
  const busses = await Bus.find({
    userId: _id,
  }).sort({
    date: 1,
  });
  let time = [];
  busses.forEach((bus) => {
    let busStopName = bus.name;
    busStopName = encodeURI(busStopName);
    time[busStopName] = [];
    const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${config.busStopKey}&stSrch=${busStopName}`;
    console.log('busStopNumberUri', busStopNumberUri);
    const { body } = request('GET', busStopNumberUri);
    console.log(body);
    console.log('10');
    parseString(body, (err, result) => {
      console.log('11');
      console.log(result);
      const busStopNumber = result.ServiceResult.msgBody[0].itemList[0].arsId[0];
      const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${config.busStopKey}&arsId=${busStopNumber}`;
      console.log('busTime', busTime);
      const body2 = request('GET', busTime).body;
      console.log('12');
      parseString(body2, (err2, result2) => {
        console.log('13');
        const {
          itemList,
        } = result2.ServiceResult.msgBody[0];
        itemList.forEach((element) => {
          console.log('14', element.rtNm);
          time[busStopName].push(`${element.rtNm}번 버스 도착 시간은 ${element.arrmsg1}입니다.`);
        });
        console.log('1', time);
      });
      console.log('2', time);
    });
  });
  console.log('3', time);
  time = time;
  console.log(time);
  await res.send(time);
});

router.get('/:_id/edit', isLoggedIn, async (req, res) => {
  const {
    _id
  } = req.params;
  const bus = await Bus.findOne({
    _id
  });
  res.render('./busses/edit', {
    title: '정류장 수정',
    bus,
    user: req.user,
  });
});

router.get('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id
  } = req.params;
  const bus = await Bus.findOne({
    _id
  });
  res.render('./busses/show', {
    title: 'Show',
    bus,
    user: req.user,
  });
});

router.put('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id
  } = req.params;
  const userId = req.user._id;
  const {
    name
  } = req.body;
  const bus = await Bus.findOne({
    _id
  });
  bus.name = name;
  bus.userId = userId;
  const result = bus.save();
  res.json(result);
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id
  } = req.params;
  const result = await Bus.deleteOne({
    _id
  });
  res.json(result);
});

module.exports = router;
