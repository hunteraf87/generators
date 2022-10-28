const {ThreadsManager} = require('../dist');

var countCritical = 0;
var countHigh = 0;
var countLow = 0;
var threadsManager = new ThreadsManager();

threadsManager.forEach(
    new Array(50e7),
    () => countCritical++,
    {priority: "critical"}
).then(() => console.log('executed1'));

threadsManager.forEach(
    new Array(50e7),
    () => countHigh++,
    {priority: "high"}
).then(() => console.log('executed2'));

threadsManager.forEach(
    new Array(50e7),
    () => countLow++
).then(() => console.log('executed3'));

// threadsManager.forEach(new Array(50e7), () => count++).then(() => console.log('executed4'));
// threadsManager.forEach(new Array(50e7), () => count++, 'test').then(() => console.log('executed5'));

// setTimeout(() => threadsManager.stop(0), 10000)
// setTimeout(() => threadsManager.stop('test'), 10000)
// setTimeout(() => threadsManager.stop(2), 15000)

// setInterval(() => console.log('count', threadsManager.count), 5000)
const i1 = setInterval(() => console.log('countCritical', countCritical), 5000)
const i2 = setInterval(() => console.log('countHigh', countHigh), 5000)
const i3 = setInterval(() => console.log('countLow', countLow), 5000)

setTimeout(() => threadsManager.break(), 60000)
setTimeout(() => clearInterval(i1), 60000)
setTimeout(() => clearInterval(i2), 60000)
setTimeout(() => clearInterval(i3), 60000)