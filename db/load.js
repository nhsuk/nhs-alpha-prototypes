var fs = require('fs');

module.exports = {
  load: function(app) {
    fs.readFile(__dirname + '/gp_practices.json', 'utf8', function(err, data) {
      if (err) {
        console.log("Could not load db data");
        throw(err);
      }
      else {
        app.locals.gp_practices = JSON.parse(data);
      }
    });
  }
}
