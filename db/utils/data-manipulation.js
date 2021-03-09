// // extract any functions you are using to manipulate your data, into this file
exports.formatTime = (object, unixTime) => {
  const correctTime = {};
  object.forEach((item) => {
    correctTime[unixTime] = item[unixTime] * 1000;
  });
  return correctTime;
};

//take an article array of objects
//
// spread object
// access the key where we want to convert the value
// return a new object without mutating input
