const dateFormatter = (array) => {
  const newArray = [];
  array.forEach((object) => {
    const newObject = {
      ...object,
    };

    const milliseconds = newObject.created_at;
    const dateObject = new Date(milliseconds);
    newObject.created_at = dateObject;

    newArray.push(newObject);
  });

  return newArray;
};

const createArticlesRef = (articleRows) => {
  const ref = {};
  articleRows.forEach((article) => {
    ref[article.title] = article.article_id;
  });
  return ref;
};

const commentFormatter = (array, refObj) => {
  const formattedArray = [];

  array.forEach((comments) => {
    const formattedComment = {};
    formattedComment.author = comments.created_by;
    formattedComment.article_id = refObj[comments.belongs_to];
    formattedComment.votes = comments.votes;
    formattedComment.created_at = comments.created_at;
    formattedComment.body = comments.body;
    formattedArray.push(formattedComment);
  });

  return formattedArray;
};

module.exports = { dateFormatter, createArticlesRef, commentFormatter };
