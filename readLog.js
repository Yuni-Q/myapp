
const fs = require('fs');

let text = fs.readFileSync('./logs/app-debug-2018-10-29.log', 'utf8');
text = text.split('\n');
console.log(JSON.parse(text[2]).level);
