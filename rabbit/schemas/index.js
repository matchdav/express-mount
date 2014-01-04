var Schema = require('mongoose').Schema;

exports = module.exports = new Schema({
  foo:'bar'
});
exports.methods.hello = function(){console.log('hello!')}