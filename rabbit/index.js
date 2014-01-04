
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
require('./routes')(app);
module.exports = app;