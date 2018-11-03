const express = require('express');
const request = require('sync-request');
const {
  parseString,
} = require('xml2js');
const Bus = require('../mongoMedel/bus');
const query = require('../mongoMedel/query');
const {
  isLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();


router.get('/', isLoggedIn, async (req, res) => {
  const busses = await Bus.find({}).sort({
    date: 1,
  });
  res.render('./busses/index', {
    title: req.user.userName,
    busses,
    user: req.user,
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  const {
    _id,
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

router.get('/busStops', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.user;
  const busses = await Bus.find({
    userId: _id,
  }).sort({
    date: 1,
  });
  const time = {};
  busses.forEach((bus) => {
    let busStopName = bus.name;
    busStopName = encodeURI(busStopName);
    const busStopNameKo = decodeURI(busStopName);
    if (time[busStopNameKo]) return;
    time[busStopNameKo] = [];
    const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${global.config.busStopKey}&stSrch=${busStopName}`;
    const {
      body,
    } = request('GET', busStopNumberUri);
    parseString(body, (err, result) => {
      const busStopNumber = result.ServiceResult.msgBody[0].itemList[0].arsId[0];
      const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${global.config.busStopKey}&arsId=${busStopNumber}`;
      const body2 = request('GET', busTime).body;
      parseString(body2, (err2, result2) => {
        const {
          itemList,
        } = result2.ServiceResult.msgBody[0];
        itemList.forEach((element) => {
          time[busStopNameKo].push(`${element.rtNm}번 버스 도착 시간은 ${element.arrmsg1}입니다.`);
        });
      });
    });
  });
  res.render('./busses/busStops', {
    title: '정류장',
    time,
    user: req.user,
  });
});

router.get('/busStop', async (req, res) => {
  const time = {};
  res.render('./busses/findBus', {
    title: '정류장',
    time,
    user: req.user,
  });
});

router.get('/busStop/:busStopName', async (req, res) => {
  let { busStopName } = req.params;
  const time = {};
  busStopName = encodeURI(busStopName);
  const busStopNameKo = decodeURI(busStopName);
  time[busStopNameKo] = [];
  const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${global.config.busStopKey}&stSrch=${busStopName}`;
  const {
    body,
  } = request('GET', busStopNumberUri);
  parseString(body, (err, result) => {
    const busStopNumber = result.ServiceResult.msgBody[0].itemList[0].arsId[0];
    const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${global.config.busStopKey}&arsId=${busStopNumber}`;
    const body2 = request('GET', busTime).body;
    parseString(body2, (err2, result2) => {
      const {
        itemList,
      } = result2.ServiceResult.msgBody[0];
      itemList.forEach((element) => {
        time[busStopNameKo].push(`${element.rtNm}번 버스 도착 시간은 ${element.arrmsg1}입니다.`);
      });
    });
  });
  res.render('./busses/findBus', {
    title: '정류장',
    time,
    user: req.user,
  });
});

router.get('/:_id/edit', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const bus = await Bus.findOne({
    _id,
  });
  res.render('./busses/edit', {
    title: '정류장 수정',
    bus,
    user: req.user,
  });
});

router.get('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const bus = await Bus.findOne({
    _id,
  });
  res.render('./busses/show', {
    title: 'Show',
    bus,
    user: req.user,
  });
});

router.put('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const {
    _id: userId,
  } = req.user;
  const {
    name,
  } = req.body;
  const bus = await Bus.findOne({
    _id,
  });
  bus.name = name;
  bus.userId = userId;
  const result = bus.save();
  res.json(result);
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const result = await Bus.deleteOne({
    _id,
  });
  res.json(result);
});

module.exports = router;
