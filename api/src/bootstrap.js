// This module just adds a line to the database
// with a start time. It serves as a simple code
// example and can be used for basic troubleshooting.
var mongoose = require('mongoose');

const instanceSchema = mongoose.Schema({
  startTime: Date
});
const Instance = mongoose.model('Instance', instanceSchema);

module.exports = {
  run: (props) => {
    mongoose.connect(props.mongoUrl);
    const instance = new Instance({ startTime: new Date() });
    return instance.save();
  }
}
