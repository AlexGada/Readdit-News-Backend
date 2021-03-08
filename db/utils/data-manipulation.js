// // extract any functions you are using to manipulate your data, into this file
exports.formatTime = (unixTime) => {
  const milliseconds = unixTime * 1000;
  const dateObj = new Date(milliseconds);
  return dateObj;
};

//take an article array of objects
//
// spread object
// access the key where we want to convert the value
// return a new object without mutating input
