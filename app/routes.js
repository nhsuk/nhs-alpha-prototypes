var querystring = require('querystring');

module.exports = {
  bind : function (app) {
    function find_gp_practice(slug) {
      return app.locals.gp_practices.filter(
        function(p) {
          return p.slug === slug;
        }
      )[0];
    }

    function find_appointment(uuid) {
      return app.locals.appointments.filter(
        function(a) {
          return a.uuid === uuid;
        }
      )[0];
    }

    function find_matching_appointments(filter_functions) {
      return filter_functions.reduce(function(filtered_appointments, filter_func) {
        return filtered_appointments.filter(filter_func);
      }, app.locals.appointments);
    }

    function find_matching_appointment(filter_functions) {
      return find_matching_appointments(filter_functions)[0]
    }

    function getServiceFromSlug(service_slug_param) {
      var service_slug = service_slug_param || 'general-practice',
          service = app.locals.services.filter(function(service) {
            return service.slug === service_slug;
          })[0];

      return service;
    }

    function getPractitionerFromUuid(uuid) {
      return app.locals.practitioners.filter(function(practitioner) {
        return practitioner.uuid === uuid;
      })[0];
    };

    function findPractitionersForService(service_slug) {
      var service_to_uuid = {};  // {'eye-check': [practitioner_uuid_1, practitioner_uuid_2]}

      app.locals.appointments.forEach(function(appointment) {
        if(!service_to_uuid.hasOwnProperty(appointment.service)) {
          service_to_uuid[appointment.service] = [];
        }

        if(-1 == service_to_uuid[appointment.service].indexOf(appointment.practitioner_uuid)) {
          service_to_uuid[appointment.service].push(appointment.practitioner_uuid);
        }
      });

      return service_to_uuid[service_slug].map(getPractitionerFromUuid);
    }

    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/examples/template-data', function (req, res) {
      res.render('examples/template-data', { 'name' : 'Foo' });
    });

    app.get('/diabetes-content*', function (req, res) {
      res.redirect('/type-2-diabetes' + req.params[0]);
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

    // Register with a GP - suggested GP practices
    app.get('/register-with-a-gp/suggested-gps', function(req, res) {
      res.render(
        'register-with-a-gp/suggested-gps',
        { practices: app.locals.gp_practices }
      );
    });

    // Register with a GP - practice details
    app.get('/register-with-a-gp/practices/:practice', function(req, res) {
      var practice = find_gp_practice(req.params.practice);

      res.render('register-with-a-gp/practice-details',
                 {'practice': practice});
    });

    // Register with a GP - choose a practice to register with
    app.get('/register-with-a-gp/practices/:practice/register', function(req, res) {
      var practice = find_gp_practice(req.params.practice);

      req.session.practice = {
        name: practice.name,
        address: practice.address.join(', ')
      };

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

    app.get('/register-with-a-gp/application-complete', function(req, res) {
      res.render(
        'register-with-a-gp/application-complete',
        {
          hideDonorQuestions: req.query.hideDonorQuestions
        }
      )
    });

    app.get('/book-an-appointment/:service_slug?/see-particular-person', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          practitioners = findPractitionersForService(service.slug);

      res.render(
        'book-an-appointment/see-particular-person',
        {
          practice: app.locals.gp_practices[0],
          practitioners: practitioners
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/appointments-with-practitioner', function(req, res) {
      var practitioner_uuid = req.query.practitioner,
          service = getServiceFromSlug(req.params.service_slug),
          practitioner = getPractitionerFromUuid(practitioner_uuid);

      res.render(
        'book-an-appointment/appointments-with-practitioner',
        {
          practice: app.locals.gp_practices[0],
          practitioner: practitioner,
          appointments: find_matching_appointments([
            filterByPractitionerUuid(practitioner_uuid),
            filterByService(service.slug)])
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/next-appointment-early-morning', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/next-appointment-early-morning',
        {
          practice: practice,
          service: service,
          appointments: {
            face_to_face: find_matching_appointment([filterByService(service.slug),filterFaceToFace]),
            early: find_matching_appointment([filterByService(service.slug),filterBefore10]),
          }
        }
      );
    });

    app.get('/book-an-appointment/next-appointment-with-woman', function(req, res) {
      res.render(
        'book-an-appointment/next-appointment-with-woman',
        {
          practice: app.locals.gp_practices[0],
          appointments: {
            face_to_face: find_matching_appointment([filterByService('general-practice'),filterFaceToFace]),
            female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP])
          }
        }
      );
    });

    app.get('/book-an-appointment/next-appointment-with-woman-early-morning', function(req, res) {
      res.render(
        'book-an-appointment/next-appointment-with-woman-early-morning',
        {
          practice: app.locals.gp_practices[0],
          appointments: {
            face_to_face: find_matching_appointment([filterByService('general-practice'),filterFaceToFace]),
            female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP]),
            early_female_gp: find_matching_appointment([filterByService('general-practice'),filterFemaleGP, filterBefore10])
          }
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/find-new-appointment', function(req, res) {
      var service_slug = req.params.service_slug,
          offramp = req.session.service_booking_offramp &&
                    req.session.service_booking_offramp[service_slug];

      if (offramp) {
        delete req.session.service_booking_offramp[service_slug];
      }

      res.render('book-an-appointment/find-new-appointment');
    });

    app.get('/book-an-appointment/:service_slug?/next-available-appointment', function(req, res) {

      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/next-available-appointment',
        {
          practice: practice,
          service: service,
          appointments: {
            face_to_face: find_matching_appointment([filterByService(service.slug),filterFaceToFace]),
          }
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/all-appointments', function(req, res) {

      var service = getServiceFromSlug(req.params.service_slug),
          practice = service.slug === 'general-practice' ? app.locals.gp_practices[0] : null;

      res.render(
        'book-an-appointment/all-appointments',
        {
          practice: practice,
          appointments: find_matching_appointments([filterByService(service.slug)]),
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/confirm-appointment/:uuid', function(req, res) {
      var appointment = find_appointment(req.params.uuid),
          service = getServiceFromSlug(req.params.service_slug),
          practice = app.locals.gp_practices[0],
          address = appointment.address || [practice.name].concat(practice.address);

      res.render(
        'book-an-appointment/confirm-appointment',
        {
          practice: practice,
          service: service,
          appointment: appointment,
          address: address
        }
      );
    });

    app.get('/book-an-appointment/:service_slug?/appointment-confirmed/:uuid', function(req, res) {
      var service = getServiceFromSlug(req.params.service_slug),
          offramp = req.session.service_booking_offramp &&
                    req.session.service_booking_offramp[service.slug];

      if (offramp) {
        delete req.session.service_booking_offramp[service.slug];
        res.redirect(offramp.replace('UUID', req.params.uuid));
      }
      else {
        res.render(
          'book-an-appointment/appointment-confirmed',
          {
            practice: app.locals.gp_practices[0],
            service: service,
            appointment: find_appointment(req.params.uuid)
          }
        );
      }
    });

    app.get(/^\/(book-an-appointment\/[^.]+)$/, function (req, res) {
      var path = (req.params[0]);

      res.render(
        path,
        {
          practice: app.locals.gp_practices[0]
        },
        function(err, html) {
          if (err) {
            console.log(err);
            res.send(404);
          } else {
            res.end(html);
          }
        }
      );
    });

    app.get('/planner/main', function(req, res) {
      var booked_eye_test = req.query.booked_eye_test &&
                            find_appointment(req.query.booked_eye_test),
          booked_diabetes_review = req.query.booked_diabetes_review &&
                                   find_appointment(req.query.booked_diabetes_review),
          booked_blood_test = req.query.booked_blood_test &&
                              find_appointment(req.query.booked_blood_test),
          cards = {
            past: [],
            present: [],
            future: []
          };

      // historic stuff
      cards.past.push('test-results');
      cards.past.push('medication');

      // actions to take
      if (!booked_blood_test) {
        cards.present.push('book-your-blood-test');
      }
      if (!booked_diabetes_review) {
        cards.present.push('book-your-first-diabetes-review');
      }
      if (!booked_eye_test) {
        cards.present.push('book-your-first-eye-test');
      }

      // upcoming stuff
      cards.future.push('repeat-prescription');
      if (booked_eye_test) {
        cards.future.push('your-eye-test-appointment');
      }
      if (booked_blood_test) {
        cards.future.push('your-blood-test-appointment');
      }
      if (booked_diabetes_review) {
        cards.future.push('your-diabetes-review-appointment');
      }

      res.render(
        'planner/main',
        {
          cards: cards,
          booked_eye_test: booked_eye_test,
          booked_diabetes_review: booked_diabetes_review,
          booked_blood_test: booked_blood_test,
          querystring: querystring.stringify(req.query)
        }
      );
    });

    app.get('/planner/book-diabetes-review', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-annual-review';

      // work out a return URL
      query.booked_diabetes_review = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-diabetes-review-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });

    app.get('/planner/book-eye-test', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-eye-screening';

      // work out a return URL
      query.booked_eye_test = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-eye-test-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });

    app.get('/planner/book-blood-test', function(req, res) {
      var query = req.query,
          service_slug = 'diabetes-blood-glucose-test';

      // work out a return URL
      query.booked_blood_test = 'UUID';
      var return_url = '/planner/main?' + querystring.stringify(query)
          + '#your-blood-test-appointment';

      // set the return URL in the session
      if (!req.session.service_booking_offramp) {
        req.session.service_booking_offramp = {};
      }
      req.session.service_booking_offramp[service_slug] = return_url;

      // redirect to the service booking journey, skipping log in
      res.redirect(
        '/book-an-appointment/' + service_slug + '/next-available-appointment'
      );
    });
  }
};

var filterByService = function(service_slug) {
  return function(appointment) {
    return appointment.service === service_slug;
  }
}

var filterFaceToFace = function(appointment) {
  return appointment.appointment_type == 'face to face';
};

var filterFemaleGP = function(appointment) {
  return appointment.practitioner.gender == 'female' && appointment.practitioner.role == 'GP';
};

var filterBefore10 = function(appointment) {
  var hour = parseInt(appointment.appointment_time.split(':')[0], 10);
  return hour < 10;
};

var filterByPractitionerUuid = function(uuid) {
  return function(appointment) {
    return appointment.practitioner_uuid === uuid;
  }
}
