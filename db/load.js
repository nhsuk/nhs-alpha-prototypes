var fs = require('fs'),
    Promise = require('bluebird');

Promise.promisifyAll(fs);

module.exports = {
  load: function(app) {
    load_data_files(app);
  }
}

function load_data_files(app) {
  fs.readdir(__dirname, function(err, file_names) {
    json_files = file_names.filter(function(name) {
      return name.match(/\.json$/);
    });

    json_files.forEach(function(file_name) {
      fs.readFileAsync(__dirname + '/' + file_name, 'utf8')
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
  });
}
