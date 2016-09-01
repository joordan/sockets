var moment = require('moment');
var now = moment();

console.log('string: ' + now.format());
console.log('int: ' + now.valueOf());
console.log('epoch (s) unix timestamp: ' + now.format('X'));
console.log('epoch (ms) javascript timestamp: ' + now.format('x'));

var timestamp = now.format('x');

//reverse
var timestamp = 1472769713476;
var timestampMoment = moment.utc(timestamp);

console.log('from time stamp string: ' + timestampMoment.local().format('h:mma'));


now.subtract(1,'year');

console.log(now.format());
console.log(now.format('MMM Do YYYY, h:mma')); //Month day year ,X:XX PM