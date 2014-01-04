#!/usr/bin/env node

/*
  Based shamelessly on TJ's Express generator.
*/

var program = require('commander');
var exec = require('child_process').exec;
var path = require('path');
var eol = require('os').EOL, pkg = require('../package.json');
var fs = require('fs');
var mkdirp = require('mkdirp');



program.version(pkg.version)
	.usage('[options] [dir]')
	.option('-e, --ejs', 'add ejs engine support (defaults to jade)')
    .option('-M, --mongoose', 'add mongoose model support')
  	.option('-J, --jshtml', 'add jshtml engine support (defaults to jade)')
  	.option('-H, --hogan', 'add hogan.js engine support')
  	.option('-c, --css <engine>', 'add stylesheet <engine> support (less|stylus) (defaults to plain css)')
  	.option('-f, --force', 'force on non-empty directory')
	.parse(process.argv);

program.template = 'jade';
if (program.ejs) program.template = 'ejs';
if (program.jshtml) program.template = 'jshtml';
if (program.hogan) program.template = 'hjs';

var args = program.args;

if( args.length == 0 ) {
	console.log('No module name specified.  Exiting...');
  console.log(program.usage());
	process.exit();
}

var module = {};
module.name = program.args.shift() || '';
console.log('Creating module ' + module.name);

module.path = path.join(process.cwd(),module.name.toLowerCase());


var router = [
    ''
  , 'module.exports = function(app){'
  , '  app.get(\'/\',require(\'home\'))'
  , '  //add other routes below'
  , '}'
].join(eol);

var home = [
    ''
  , '/*'
  , ' * GET home page.'
  , ' */'
  , ''
  , 'exports.index = function(req, res){'
  , '  res.render(\'index\', { title: \'Express::Module::'+module.name+'\' });'
  , '};'
].join(eol);


/**
 * Jade layout template.
 */

var jadeLayout = [
    'doctype 5'
  , 'html'
  , '  head'
  , '    title= title'
  , '    link(rel=\'stylesheet\', href=\'stylesheets/style.css\')'
  , '  body'
  , '    block content'
].join(eol);

/**
 * Jade index template.
 */

var jadeIndex = [
    'extends layout'
  , ''
  , 'block content'
  , '  h1= title'
  , '  p Welcome to #{title}'
].join(eol);

/**
 * EJS index template.
 */

var ejsIndex = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title><%= title %></title>'
  , '    <link rel=\'stylesheet\' href=\'stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    <h1><%= title %></h1>'
  , '    <p>Welcome to <%= title %></p>'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * JSHTML layout template.
 */

var jshtmlLayout = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title> @write(title) </title>'
  , '    <link rel=\'stylesheet\' href=\'stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    @write(body)'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * JSHTML index template.
 */

var jshtmlIndex = [
    '<h1>@write(title)</h1>'
  , '<p>Welcome to @write(title)</p>'
].join(eol);

/**
 * Hogan.js index template.
 */
var hoganIndex = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title>{{ title }}</title>'
  , '    <link rel=\'stylesheet\' href=\'stylesheets/style.css\' />'
  , '  </head>'
  , '  <body>'
  , '    <h1>{{ title }}</h1>'
  , '    <p>Welcome to {{ title }}</p>'
  , '  </body>'
  , '</html>'
].join(eol);

/**
 * Default css template.
 */

var css = [
    'body {'
  , '  padding: 50px;'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;'
  , '}'
  , ''
  , 'a {'
  , '  color: #00B7FF;'
  , '}'
].join(eol);

/**
 * Default less template.
 */

var less = [
    'body {'
  , '  padding: 50px;'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;'
  , '}'
  , ''
  , 'a {'
  , '  color: #00B7FF;'
  , '}'
].join(eol);

var models = "module.exports = {foo:'bar'};"
var schemas= "";
if(program.mongoose){

  models = [
      'var mongoose = require(\'mongoose\');'
    , ''
    , 'exports = module.exports = mongoose.model(\''+capitalize(module.name)+'\',require(\'../schemas\'))'
  ].join(eol);

  schemas = [
      'var Schema = require(\'mongoose\').Schema;'
    , ''
    , 'exports = module.exports = new Schema({'
    , '  foo:\'bar\''
    , '});'
    , 'exports.methods.hello = function(){console.log(\'hello!\')}'
  ].join(eol);
}
/**
 * Default stylus template.
 */

var stylus = [
    'body'
  , '  padding: 50px'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif'
  , 'a'
  , '  color: #00B7FF'
].join(eol);

/**
 * App template.
 */

var app = [
    ''
  , '/**'
  , ' * Module dependencies.'
  , ' */'
  , ''
  , 'var express = require(\'express\');'
  , 'var path = require(\'path\');'
  , ''
  , 'var app = express();'
  , ''
  , '// all environments'
  , 'app.set(\'views\', __dirname + \'/views\');'
  , 'app.set(\'view engine\', \':TEMPLATE\');'
  , 'app.use(express.static(path.join(__dirname, \'public\')));'
  , 'require(\'./routes\')(app);'
  , 'module.exports = app;'
].join(eol);

// Generate sub-app

(function createSubApp(path) {
  emptyDirectory(path, function(empty){
    if (empty || program.force) {
      createApplicationAt(path);
    } else {
      abort('Directory non-empty.  Exiting...');
    }
  });
})(module.path);

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */



function createApplicationAt(path) {

  mkdir(path, function(){
    mkdir(path + '/models',function(){
      write(path + '/models/index.js',models)
    });
    
    if(program.mongoose){
      mkdir(path + '/schemas',function(){
        write(path+'/schemas/index.js',schemas);
      });
    }
    
    
    mkdir(path + '/public');
    mkdir(path + '/public/javascripts');
    mkdir(path + '/public/images');
    mkdir(path + '/public/stylesheets', function(){
      switch (program.css) {
        case 'less':
          write(path + '/public/stylesheets/style.less', less);
          break;
        case 'stylus':
          write(path + '/public/stylesheets/style.styl', stylus);
          break;
        default:
          write(path + '/public/stylesheets/style.css', css);
      }
    });

    mkdir(path + '/routes', function(){
      write(path + '/routes/index.js', router);
      write(path + '/routes/home.js', home);
    });

    mkdir(path + '/views', function(){
      switch (program.template) {
        case 'ejs':
          write(path + '/views/index.ejs', ejsIndex);
          break;
        case 'jade':
          write(path + '/views/layout.jade', jadeLayout);
          write(path + '/views/index.jade', jadeIndex);
          break;
        case 'jshtml':
          write(path + '/views/layout.jshtml', jshtmlLayout);
          write(path + '/views/index.jshtml', jshtmlIndex);
          break;
        case 'hjs':
          write(path + '/views/index.hjs', hoganIndex);
          break;

      }
    });

    // CSS Engine support
    switch (program.css) {
      case 'less':
        app = app.replace('{css}', eol + 'app.use(require(\'less-middleware\')({ src: __dirname + \'/public\' }));');
        break;
      case 'stylus':
        app = app.replace('{css}', eol + 'app.use(require(\'stylus\').middleware(__dirname + \'/public\'));');
        break;
      default:
        app = app.replace('{css}', '');
    }
    // Template support
    app = app.replace(':TEMPLATE', program.template);

    // package.json

    write(path + '/index.js', app);
  });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
  });
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */

function abort(str) {
  console.error(str);
  process.exit(1);
}

/**
 * Capitalize the given `str`.
 *
 * @param {String} str
 */

function capitalize(str){
  str +="";
  return str.charAt(0).toUpperCase() + str.substr(1);
}