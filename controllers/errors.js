exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const notFound = ['22P02', '23503'];
  const requiredIsNull = ['23502'];
  if (notFound.includes(err.code)) {
    res.status(404).send({ msg: `${err.detail} not found` });
  } else if (requiredIsNull.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route not found' });
};

exports.invalidMethodError = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
