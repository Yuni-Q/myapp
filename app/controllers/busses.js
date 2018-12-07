const express = require('express');
const request = require('sync-request');
const fetch = require('node-fetch');
const {
  parseString,
} = require('xml2js');
const Bus = require('../mongoMedel/bus');
const query = require('../mongoMedel/query');
const {
  isLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();


// router.get('/', isLoggedIn, async (req, res) => {
//   const busses = await Bus.find({}).sort({
//     date: 1,
//   });
//   res.render('./busses/index', {
//     title: req.user.userName,
//     busses,
//     user: req.user,
//   });
// });

router.post('/', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.user;
  const result = await query.Bus.create(req.body, _id);
  res.json({
    ok: true,
    message: null,
    result,
  });
});

// router.get('/create', isLoggedIn, async (req, res) => {
//   res.render('./busses/create', {
//     title: '정류장 추가',
//     user: req.user,
//   });
// });

// router.get('/busStops', isLoggedIn, async (req, res) => {
//   const {
//     _id,
//   } = req.user;
//   const busses = await Bus.find({
//     userId: _id,
//   }).sort({
//     date: 1,
//   });
//   const time = {};
//   busses.some((bus) => {
//     let busStopName = bus.name;
//     busStopName = encodeURI(busStopName);
//     const busStopNameKo = decodeURI(busStopName);
//     if (time[busStopNameKo]) {
//       return true;
//     }
//     const busStopNumbers = [];
//     const busStopTimes = {};

//     const busStopKey = 'ZToJL71tb0BfKZ6CzMa%2FYCbxw5sVQQks%2F%2BEhWi0%2B29s7PdXcQGYxJGChT%2FRysDxAZWmhSQRT3D6WT90GqkwJJA%3D%3D';
//     const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${busStopKey}&stSrch=${busStopName}`;
//     fetch(busStopNumberUri)
//       .then(response => response.text())
//       .then(xml => parseString(xml, (err, result) => {
//         if (err) {
//           console.log(err);
//         }
//         result.ServiceResult.msgBody[0].itemList.forEach((element) => {
//           busStopNumbers.push(element.arsId.toString());
//         });
//       }))
//       .then(() => {
//         busStopNumbers.forEach((element) => {
//           busStopTimes[element] = [];
//           const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${busStopKey}&arsId=${element}`;
//           const {
//             body,
//           } = request('GET', busTime);
//           parseString(body, (err, result2) => {
//             if (err) {
//               console.log(err);
//             }
//             const {
//               itemList,
//             } = result2.ServiceResult.msgBody[0];
//             if (itemList) {
//               itemList.forEach((element2) => {
//                 const temp = {};
//                 temp[element2.rtNm] = element2.arrmsg1.toString();
//                 busStopTimes[element].push(temp);
//               });
//             }
//           });
//         });
//       })
//       .then(() => {
//         res.json(busStopTimes);
//       })
//       .catch(err => console.log(err));
//   });
//   res.render('./busses/busStops', {
//     title: '정류장',
//     time,
//     user: req.user,
//   });
// });

// router.get('/busStop', async (req, res) => {
//   const time = {};
//   res.render('./busses/findBus', {
//     title: '정류장',
//     time,
//     user: req.user,
//   });
// });

router.get('/busStop/:busStopName', async (req, res) => {
  let {
    busStopName,
  } = req.params;
  const busStopNumbers = [];
  const busStopTimes = {};
  busStopName = encodeURI(busStopName);

  const busStopKey = 'ZToJL71tb0BfKZ6CzMa%2FYCbxw5sVQQks%2F%2BEhWi0%2B29s7PdXcQGYxJGChT%2FRysDxAZWmhSQRT3D6WT90GqkwJJA%3D%3D';
  const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${busStopKey}&stSrch=${busStopName}`;
  fetch(busStopNumberUri)
    .then(response => response.text())
    .then(xml => parseString(xml, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      result.ServiceResult.msgBody[0].itemList.forEach((element) => {
        busStopNumbers.push(element.arsId.toString());
      });
    }))
    .then(() => {
      busStopNumbers.forEach((element) => {
        busStopTimes[element] = [];
        const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${busStopKey}&arsId=${element}`;
        const {
          body,
        } = request('GET', busTime);
        parseString(body, (err, result2) => {
          if (err) {
            console.log(err);
            return;
          }
          const {
            itemList,
          } = result2.ServiceResult.msgBody[0];
          if (itemList) {
            itemList.forEach((element2) => {
              const temp = {};
              temp[element2.rtNm] = element2.arrmsg1.toString();
              busStopTimes[element].push(temp);
            });
          }
        });
      });
    })
    .then(() => {
      console.log(busStopTimes);
      res.json({
        ok: true,
        message: null,
        result: busStopTimes,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        ok: false,
        message: '에러 발생',
        result: error,
      });
    });
});

router.get('/:_id/edit', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const bus = await Bus.findOne({
    _id,
  });
  res.json({
    ok: true,
    message: null,
    result: bus,
  });
});

router.get('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const bus = await Bus.findOne({
    _id,
  });
  res.json({
    ok: true,
    message: null,
    result: bus,
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
    busStopNumber,
  } = req.body;
  const bus = await Bus.findOne({
    _id,
  });
  bus.name = name;
  bus.busStopNumber = busStopNumber;
  bus.userId = userId;
  const result = bus.save();
  res.json({
    ok: true,
    message: null,
    result,
  });
});


router.delete('/:_id', isLoggedIn, async (req, res) => {
  const {
    _id,
  } = req.params;
  const result = await Bus.deleteOne({
    _id,
  });
  res.json({
    ok: true,
    message: null,
    result,
  });
});

module.exports = router;
