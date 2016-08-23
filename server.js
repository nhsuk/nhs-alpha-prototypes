var path = require('path'),
    express = require('express'),
    helmet = require('helmet'),
    swig = require('swig'),
    swig_extras = require('swig-extras'),
    session = require('express-session'),
    routes = require(__dirname + '/app/routes.js'),
    db = require(__dirname + '/db/load.js'),
    app = express(),
    port = (process.env.PORT || 3000),

// Grab environment variables specified in Procfile or as Heroku config vars
    username = process.env.USERNAME,
    password = process.env.PASSWORD,
    env = process.env.NODE_ENV || 'development';

// Application settings
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');


// Template engine settings

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

// Set base directory for Swig templates and includes
swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/app/views' )});

// Set up markdown
swig_extras.useTag(swig, 'markdown');


// Middleware to serve static assets
app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/app/assets_govuk_legacy'));
app.use('/public', express.static(__dirname + '/nhsalpha_modules/nhsalpha_frontend_toolkit'));

app.use(express.favicon(path.join(__dirname, 'app', 'assets_govuk_legacy', 'images','favicon.ico')));


// send assetPath to all views
app.use(function (req, res, next) {
  res.locals({'assetPath': '/public/'});
  next();
});

// set up sessions
app.use(session({
  secret: 'this is actually public'
}));

if (env !== 'development') {
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        '\'self\''
      ],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\''
      ],
      imgSrc: [
        '\'self\'',
        'data:'
      ],
      styleSrc: [
        '\'self\'',
        '\'unsafe-inline\''
      ],
      connectSrc: [
        '\'self\''
      ]
    }
  }));
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard({
    action: 'deny',
  }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
}

// give views/layouts direct access to session data
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

// make everything in db/*.json available in app.locals
db.load(app);

// routes (found in app/routes.js)

routes.bind(app);

// auto render any view that exists

app.get(/^\/([^.]+)$/, function (req, res) {

	var path = (req.params[0]);

	res.render(path, function(err, html) {
		if (err) {
			console.log(err);
			res.send(404);
		} else {
			res.end(html);
		}
	});

});

// start the app

app.listen(port);
console.log('');
console.log('Listening on port ' + port);
console.log('');
