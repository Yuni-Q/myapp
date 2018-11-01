
const request = require('request');
const { parseString } = require('xml2js');
const config = require('./config/development.json');

let busStopName = '한서병원';
busStopName = encodeURI(busStopName);
const busStopNumberUri = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${config.busStopKey}&stSrch=${busStopName}`;
request(busStopNumberUri, (error, response, body) => {
  parseString(body, (err, result) => {
    const busStopNumber = result.ServiceResult.msgBody[0].itemList[0].arsId[0];
    const busTime = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?ServiceKey=${config.busStopKey}&arsId=${busStopNumber}`;
    request(busTime, (error2, response2, body2) => {
      parseString(body2, (err2, result2) => {
        (result2.ServiceResult.msgBody[0].itemList).forEach(((element) => {
          console.log(`${element.rtNm}번 버스 도착 시간은 ${element.arrmsg1}입니다.`);
        }));
      });
    });
  });
});
