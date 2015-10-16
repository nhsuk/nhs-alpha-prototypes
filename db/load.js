var fs = require('fs');

module.exports = {
  load: function(app) {
    fs.readdir(__dirname, function(err, file_names) {
      json_files = file_names.filter(function(name) {
        return name.match(/\.json$/);
      });

      json_files.forEach(function(file_name) {
        fs.readFile(__dirname + '/' + file_name, 'utf8', function(err, data) {
          if (err) {
            console.log('Could not load data from ' + file_name);
            throw(err);
          }
          else {
            var dataset_name = file_name.replace(/\.json$/, '');
            app.locals[dataset_name] = JSON.parse(data);
          }
        });
      });
    });
  }
}
