var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    membership: {type: String, required: true, maxLength: 100},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  }
);

UserSchema
  .virtual('url')
  .get(function() {
    return '/users/' + this._id;
  })

module.exports = mongoose.model('User', UserSchema);