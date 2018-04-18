var mongoose = require('mongoose');

var nyBookSchema = mongoose.Schema( {
    title       : String,
    author      : String,
    listDate    : String,
    ISBN        : String
  });

  module.exports = mongoose.model('NYBooks', nyBookSchema);