const dateFormatter = (array) => {
  const newArray = [];
  array.forEach((object) => {
    const newObject = {
      ...object
    };

    const milliseconds = newObject.created_at;
    const dateObject = new Date(milliseconds);
    newObject.created_at = dateObject;

    newArray.push(newObject);
  });

  return newArray;
};


// const createArticlesRef = articleRows => {
//   const ref = {};
//   articleRows.forEach(article => {
//     ref[article.title] = article[article_id]
//   });
//   return ref;
// }



// const commentFormatter = array => {
//   const ref = {};

//   array.forEach(comments => {
//     ref.author = comments[created_by];
//     ref[article_id] = 0;
//     ref.votes = comments.votes
//     ref[created_at] = comments[created_at];
//     ref.body = comments.body;
//   })

//   return ref;
// }

module.exports = { dateFormatter, commentFormatter };
