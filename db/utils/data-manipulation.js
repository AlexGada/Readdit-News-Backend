// // extract any functions you are using to manipulate your data, into this file
exports.formatTime = (articles) => {
  const correctTime = [];
  for (let i = 0; i < articles.length; i++) {
    correctTime[i] = {};
    for (let prop in articles[i]) {
      correctTime[i][prop] = articles[i][prop];
      correctTime[i].created_at = new Date(correctTime[i].created_at);
    }
  }
  return correctTime;
};

exports.formatItems = (items, refObj, keyToChange, newKey) => {
  const formattedItems = items.map((item) => {
    const formattedItem = { ...item };
    formattedItem[newKey] = refObj[formattedItem[keyToChange]];
    delete formattedItem[keyToChange];

    return formattedItem;
  });
  return formattedItems;
};

exports.createRefObj = (items, key, value) => {
  const refObj = {};
  if (!items.length) return refObj;

  items.forEach((item) => {
    const refKey = item[key];
    const refValue = item[value];

    refObj[refKey] = refValue;
  });
  return refObj;
};
