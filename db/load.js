var fs = require('fs'),
    Promise = require('bluebird');

Promise.promisifyAll(fs);

module.exports = {
  load: function(app) {
    load_data_files(app);
  }
}

function load_data_files(app) {
  return fs.readdirAsync(__dirname)
    .filter(function(file_name) {
      return file_name.match(/\.json$/);
    })
    .map(function(file_name) {
      return fs.readFileAsync(__dirname + '/' + file_name, 'utf8')
        .then(JSON.parse)
        .then(function(data) {
          var dataset_name = file_name.replace(/\.json$/, '');
          app.locals[dataset_name] = data;
        })
        .catch(SyntaxError, function(e) {
          console.error('invalid JSON in file ' + file_name);
          throw(e);
        })
        .catch(function(e) {
          console.log('unable to read file ' + file_name);
          throw(e);
        });
    });
}
