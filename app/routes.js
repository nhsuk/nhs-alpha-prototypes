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

    // Booking with context - pass through "service" query parameter
    // ie ?service=diabetes-foot-test
    app.get('/booking-with-context/your-details', function(req, res) {
      var service = req.query.service;
      res.render('booking-with-context/your-details', {"service": service});
    });

    // Booking with context - from "service" query parameter, pass in details
    // about the session.
    app.get('/booking-with-context/next-available-appointment', function(req, res) {
      var service_context = appointment_details_for_service(req.query.service);

      res.render('booking-with-context/next-available-appointment',
                 {"service_context": service_context});
    });

    app.get('/booking-with-context/appointment-confirmed', function(req, res) {
      var service_context = appointment_details_for_service(req.query.service);

      res.render('booking-with-context/appointment-confirmed',
                 {"service_context": service_context});
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

function appointment_details_for_service(slug) {
  switch(slug) {
    case 'diabetes-blood-glucose-test' :
      return {
        name: 'Blood sugar test',
        triage_hint: 'In your GP practice, blood sugar test appointments ' +
                       'are carried out by a practice nurse.',
        confirmation_hint: "You don't need to do anything special before the " +
                           "test - just eat and drink as you normally would.",
        appointment: {
          link_url: 'appointment-confirmed?service=' + slug,
          appointment_date: 'Tuesday 26th January 2016',
          appointment_time: '16:10',
          avatar_img_path: '/public/images/icon-avatar-alison-wylde.png',
          name: 'Nurse Alison Wylde',
          appointment_type: 'Face to face',
          address: 'Lakeside Surgery<br>22 Castelnau<br>London<br>NW13 9HJ'
        }

      };

    case 'diabetes-foot-check' :
      return {
        name: 'Diabetes foot check',
        triage_hint: 'In your GP practice, diabetes foot checks are carried ' +
                     'out by a practice nurse.',
        confirmation_hint: "You'll need to remove your shoes and socks " +
                           "at your appointment so make sure you wear " +
                           "comfortable footwear.",
        appointment: {
          link_url: 'appointment-confirmed?service=' + slug,
          appointment_date: 'Tuesday 26th January 2016',
          appointment_time: '16:10',
          avatar_img_path: '/public/images/icon-avatar-alison-wylde.png',
          name: 'Nurse Alison Wylde',
          appointment_type: 'Face to face',
          address: 'Lakeside Surgery<br>22 Castelnau<br>London<br>NW13 9HJ'
        }

      };

    case 'diabetes-eye-screening' :
      return {
        name: 'Diabetes eye screening',
        triage_hint: 'For your GP practice, diabetic eye screening is ' +
                     'carried out at: ' +
                    '<br>The Royal Hospital.<br>34 Queen\'s Avenue<br>SW14 4JR',
        confirmation_hint: 'Please bring along any glasses or contact lenses ' +
                           'if you wear them.',
        appointment: {
          link_url: 'appointment-confirmed?service=' + slug,
          appointment_date: 'Tuesday 26th January 2016',
          appointment_time: '16:10',
          avatar_img_path: '/public/images/icon-avatar-ravi-aggarwal.png',
          name: 'Nurse Ravi Aggarwal',
          appointment_type: 'Face to face',
          address: "The Royal Hospital<br>34 Queen's Avenue<br>London<br>NW13 9HJ"
        }

      };

    case 'diabetes-annual-review' :
      return {
        name: 'Diabetes annual review',
        triage_hint: 'In your GP practice, diabetes annual reviews are ' +
                     'carried out by a nurse practitioner.',
        confirmation_hint: "Remember to bring along any records or information " +
                           "such as blood glucose levels that you want to discuss.",
        appointment: {
          link_url: 'appointment-confirmed?service=' + slug,
          appointment_date: 'Tuesday 26th January 2016',
          appointment_time: '16:10',
          avatar_img_path: '/public/images/icon-avatar-alison-wylde.png',
          name: 'Nurse Alison Wylde',
          appointment_type: 'Face to face',
          address: 'Lakeside Surgery<br>22 Castelnau<br>London<br>NW13 9HJ'
        }

      };
  }
}
