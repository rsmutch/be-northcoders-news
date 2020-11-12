exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const errorCodes = ['22P02'];
  if (errorCodes.includes(err.code)) {
    res.status(404).send({ msg: 'Article not found' });
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
  // res.status(405).send({ msg: 'Method not allowed' });
};
