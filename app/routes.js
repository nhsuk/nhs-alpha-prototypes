module.exports = {
  bind : function (app) {

    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/examples/template-data', function (req, res) {
      res.render('examples/template-data', { 'name' : 'Foo' });
    });

    // add your routes here

    // Change or cancel appointment fork:
    app.get('/change-or-cancel-an-appointment/path-handler', function(req, res) {
      console.log(req.query);
      if (req.query.appointment === 'change') {
        res.redirect('/change-or-cancel-an-appointment/change-to-next-available-appointment');
      } else {
        res.redirect('/change-or-cancel-an-appointment/cancel-appointment');
      }
    });

    // Register with a GP - choose a practice to register with
    app.get('/register-with-a-gp/:practice/register', function(req, res) {
      req.session.practice = practice_details_for_slug(req.params.practice);
      res.redirect('/register-with-a-gp/choose-registration-method');
    });

    // Register with a GP - choose register method fork:
    app.get('/register-with-a-gp/choose-registration-method-handler', function(req, res) {
      if (req.query.registration_method === 'with-signin') {
        res.redirect('/register-with-a-gp/register-with-signin');
      } else {
        res.redirect('/register-with-a-gp/register-without-signin');
      }
    });
  }
};

function practice_details_for_slug(slug) {
  switch(slug) {
    case 'lakeside-surgery':
      return {
        name: 'Lakeside Surgery',
        address: '22 Castelnau, London, NW13 9HJ'
      };
    case 'shrewsbottom-surgery':
      return {
        name: 'Shrewsbottom Surgery',
        address: '15 Pound Lane, London, NW12 9AT'
      };
    case 'victoria-medical-centre':
      return {
        name: 'Victoria Medical Centre',
        address: '48 Buttoy, London, NW13 9HT'
      };
  }
}
