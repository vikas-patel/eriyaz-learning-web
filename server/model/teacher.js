var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    UserSchema = require('./user.js');

var TeacherSchema = UserSchema.extend({
  exercises : [
    {type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'}
  ]
});

module.exports = mongoose.model('Teacher', TeacherSchema);