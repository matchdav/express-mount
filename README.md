This is a command line utility for generating mounted Express subapps.  

Installation: 
    'npm install -g express-mount'

Example Usage: 

    $ express zoo

    create : zoo
    create : zoo/package.json
    create : zoo/app.js
    create : zoo/public
    create : zoo/public/javascripts
    create : zoo/public/images
    create : zoo/public/stylesheets
    create : zoo/public/stylesheets/style.css
    create : zoo/routes
    create : zoo/routes/index.js
    create : zoo/routes/user.js
    create : zoo/views
    create : zoo/views/layout.jade
    create : zoo/views/index.jade

    $ cd zoo

    $ express-mount lion

    Creating module lion
     create : /zoo/lion
     create : /zoo/lion/index.js
     create : /zoo/lion/models
     create : /zoo/lion/models/index.js
     create : /zoo/lion/public/images
     create : /zoo/lion/public
     create : /zoo/lion/public/javascripts
     create : /zoo/lion/public/stylesheets
     create : /zoo/lion/public/stylesheets/style.css
     create : /zoo/lion/routes
     create : /zoo/lion/routes/index.js
     create : /zoo/lion/routes/home.js
     create : /zoo/lion/views
     create : /zoo/lion/views/layout.jade
     create : /zoo/lion/views/index.jade

    $ express-mount tiger

    Creating module tiger
     create : /zoo/tiger
     create : /zoo/tiger/index.js
     create : /zoo/tiger/models
     create : /zoo/tiger/models/index.js
     create : /zoo/tiger/public
     create : /zoo/tiger/public/images
     create : /zoo/tiger/routes
     create : /zoo/tiger/routes/index.js
     create : /zoo/tiger/routes/home.js
     create : /zoo/tiger/views
     create : /zoo/tiger/views/layout.jade
     create : /zoo/tiger/views/index.jade
     create : /zoo/tiger/public/stylesheets
     create : /zoo/tiger/public/stylesheets/style.css
     create : /zoo/tiger/public/javascripts

    $ express-mount bear

    Creating module bear
     create : /zoo/bear
     create : /zoo/bear/index.js
     create : /zoo/bear/models
     create : /zoo/bear/models/index.js
     create : /zoo/bear/public
     create : /zoo/bear/public/javascripts
     create : /zoo/bear/public/images
     create : /zoo/bear/public/stylesheets
     create : /zoo/bear/public/stylesheets/style.css
     create : /zoo/bear/routes
     create : /zoo/bear/routes/index.js
     create : /zoo/bear/routes/home.js
     create : /zoo/bear/views
     create : /zoo/bear/views/layout.jade
     create : /zoo/bear/views/index.jade


In /zoo/app.js:

    app.use('/lion',require('./lion'));
    app.use('/tiger',require('./tiger'));
    app.use('/bear',require('./bear'));

NOTE that relative paths inside each subapp's view (href='resource', src='resource') will resolve to 'http://baseURL/subAppPath/resource'