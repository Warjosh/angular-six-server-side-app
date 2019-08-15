var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var countersSchema = new Schema({
	seq: { type: Number },
});

module.exports = mongoose.model('Counters', countersSchema);