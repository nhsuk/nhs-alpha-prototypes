# Making pages

Save all HTML pages (called templates below) to the `app/views` folder otherwise they won't be recognised by the application.

All template files should have the `.html` extension.

Any template will be automatically served. For example if you add a template called `help.html` and then go to `localhost:3000/help` in your browser, you will see that page.

Folders also work, so you can make the template `views/account/profile.html`, and then view the page by going to `localhost:3000/account/profile`.

For more complex prototypes, you will need to use the [Swig templating language](http://paularmstrong.github.io/swig/).

