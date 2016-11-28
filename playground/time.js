const moment= require('moment');

// var date = new Date();
// console.log(date.getMonth());

// 10:35 am

let createdAt = 12345;

let date = moment(createdAt);
date.add(2, 'hour');
console.log(date.format('MMM Do, YYYY h:mm a'));