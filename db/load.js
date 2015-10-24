var fs = require('fs'),
    Promise = require('bluebird'),
    util = require('util');

Promise.promisifyAll(fs);

module.exports = {
  load: function(app) {
    load_data_files()
      .then(expand_practitioners)
      .done(function(data) {
        Object.keys(data).forEach(function(key) {
          app.locals[key] = data[key];
        });
      });
  }
}

function load_data_files() {
  return fs.readdirAsync(__dirname)
    .filter(function(file_name) {
      return file_name.match(/\.json$/);
    })
    .map(function(file_name) {
      return fs.readFileAsync(__dirname + '/' + file_name, 'utf8');
    })
    .map(JSON.parse)
    .reduce(function(a, b) {
      return util._extend(a, b);
    })
    .catch(SyntaxError, function(e) {
      console.error('invalid JSON in file ' + file_name);
      throw(e);
    })
    .catch(function(e) {
      console.log('unable to read file ' + file_name);
      throw(e);
    });
}

function expand_practitioners(data) {
  // TODO this mutates, which is a bit nasty, but probably fine for now
  Object.keys(data).forEach(function(key) {
    data[key].forEach(function(item) {
      if ('practitioner_uuid' in item) {
        item.practitioner = find_practitioner(
          item.practitioner_uuid, 
          data['practitioners']
        );
      }
    });
  });

  return data;
}

function find_practitioner(uuid, practitioners) {
  return practitioners.filter(function(practitioner) {
    return practitioner.uuid === uuid;
  })[0];
}
