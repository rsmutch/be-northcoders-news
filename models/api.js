const fs = require('fs').promises;

exports.fetchApi = () => {
  return fs.readFile('./api.json', 'utf-8').then((data) => {
    return data;
  });
};
