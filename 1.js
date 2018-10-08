// const request = require("request");
// const _ = require("lodash");

// request("https://yts.ag/api/v2/list_movies.json?limit=50", function(
//   error,
//   response,
//   body
// ) {
//   console.time();
//   try {
//     if (!error && response.statusCode == 200) {
//       let pre_movies = JSON.parse(body);
//       let movies = pre_movies.data.movies;
//       let temp = [];
//       let row = {};
//       let size;
//       let result;

//       movies.forEach(element => {
//         element.torrents.forEach(e => {
//           if (e.size.slice(-2, -1) == "G") {
//             size = e.size.slice(0, -2) * 1024;
//           } else {
//             size = e.size.slice(0, -2) * 1;
//           }
//           title = element.title;
//           quality = e.quality;
//           row = { title, quality, size };
//           temp.push(row);
//         });
//       });
//       result = _.sortBy(temp, ["size"]);
//       result.forEach(e => {
//         e.size = e.size + " MB";
//       });
//       console.log(result);
//     }
//   } catch (_err) {
//     console.log(_err);
//   }
//   console.timeEnd();
// });
