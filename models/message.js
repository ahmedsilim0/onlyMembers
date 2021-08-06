var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    title: {type: String, required: true, maxLength: 100},
    text: {type: String, required: true, maxLength: 2000},
    timestamp: {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User' },
  }
);

module.exports = mongoose.model('Message', MessageSchema);