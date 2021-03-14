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

exports.createRefObject = (arr, refKey, refValue) => {
  const refObject = {};

  arr.forEach((obj) => {
    const refKeys = obj[refKey];
    const refVal = obj[refValue];

    refObject[refKeys] = refVal;
  });
  return refObject;
};

exports.formatData = (
  arr,
  keyToChangeOne,
  newKeyOne,
  keyToChangeTwo,
  newKeyTwo,
  refObj
) => {
  const reformattedArr = arr.map(({ ...obj }) => {
    obj[newKeyOne] = obj[keyToChangeOne];
    obj[newKeyTwo] = refObj[obj[keyToChangeTwo]];
    delete obj[keyToChangeOne];
    delete obj[keyToChangeTwo];
    return obj;
  });
  return reformattedArr;
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
