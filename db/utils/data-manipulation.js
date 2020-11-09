const dateFormatter = (array) => {
  const newArray = [];
  array.forEach(({ created_at, ...args }) => {
    const newObject = {
      ...args,
      created_at,
    };

    const milliseconds = newObject.created_at;
    const dateObject = new Date(milliseconds);
    newObject.created_at = dateObject.toLocaleString();

    newArray.push(newObject);
  });

  return newArray;
};

module.exports = { dateFormatter };
